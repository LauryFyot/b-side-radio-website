// Content editing state manager for the admin app.
// Holds local drafts for shows, schedule, media, videos, and comments.
// Exposes CRUD helpers and publish action to sync changes to Supabase.
import { useMemo, useState } from 'react';
import { fetchBootstrapData, publishAdminData, uploadAdminFile } from '../lib/adminRepository';
import { isDbId, toSlug } from '../utils/adminHelpers';

function buildSnapshot(data, deletedIds) {
  return JSON.stringify({
    shows: data.shows || [],
    slots: data.slots || [],
    covers: data.covers || [],
    tracks: data.tracks || [],
    videos: data.videos || [],
    comments: data.comments || [],
    deletedIds: deletedIds || { shows: [], slots: [], covers: [], tracks: [], videos: [] }
  });
}

function useAdminEditor() {
  const [isPublishing, setIsPublishing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const [shows, setShows] = useState([]);
  const [slots, setSlots] = useState([]);
  const [covers, setCovers] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [videos, setVideos] = useState([]);
  const [comments, setComments] = useState([]);

  const [deletedIds, setDeletedIds] = useState({
    shows: [],
    slots: [],
    covers: [],
    tracks: [],
    videos: []
  });
  const [publishedSnapshot, setPublishedSnapshot] = useState(
    buildSnapshot(
      { shows: [], slots: [], covers: [], tracks: [], videos: [], comments: [] },
      { shows: [], slots: [], covers: [], tracks: [], videos: [] }
    )
  );

  function hydrateState(data) {
    const nextShows = data.shows || [];
    const nextSlots = data.slots || [];
    const nextCovers = data.covers || [];
    const nextTracks = data.tracks || [];
    const nextVideos = data.videos || [];
    const nextComments = data.comments || [];
    const emptyDeleted = { shows: [], slots: [], covers: [], tracks: [], videos: [] };

    // Replace full local draft from a server snapshot.
    setShows(nextShows);
    setSlots(nextSlots);
    setCovers(nextCovers);
    setTracks(nextTracks);
    setVideos(nextVideos);
    setComments(nextComments);
    setDeletedIds(emptyDeleted);
    setPublishedSnapshot(
      buildSnapshot(
        {
          shows: nextShows,
          slots: nextSlots,
          covers: nextCovers,
          tracks: nextTracks,
          videos: nextVideos,
          comments: nextComments
        },
        emptyDeleted
      )
    );
  }

  async function loadData() {
    // Fetch all admin datasets in one step (shows, slots, tracks, videos, comments...).
    const data = await fetchBootstrapData();
    hydrateState(data);
  }

  function clearData() {
    const emptyState = { shows: [], slots: [], covers: [], tracks: [], videos: [], comments: [] };
    hydrateState(emptyState);
    setMessage('');
  }

  function markDeleted(type, id) {
    // Track deleted persisted rows so publish can issue delete queries.
    if (!isDbId(id)) {
      return;
    }

    setDeletedIds((prev) => ({
      ...prev,
      [type]: prev[type].includes(id) ? prev[type] : [...prev[type], id]
    }));
  }

  function updateItem(setter, index, key, value) {
    setter((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)));
  }

  const updateSlot = (index, key, value) => updateItem(setSlots, index, key, value);
  const updateCover = (index, key, value) => updateItem(setCovers, index, key, value);
  const updateTrack = (index, key, value) => updateItem(setTracks, index, key, value);
  const updateVideo = (index, key, value) => updateItem(setVideos, index, key, value);

  function removeItem(type, setter, index) {
    setter((prev) => {
      const target = prev[index];
      if (target && isDbId(target.id)) {
        markDeleted(type, target.id);
      }
      return prev.filter((_, itemIndex) => itemIndex !== index);
    });
  }

  function addShow() {
    setShows((prev) => [...prev, { id: null, name: '', slug: '', description: '', cover_url: '', is_active: true }]);
  }

  function addSlot(dayOfWeek = 1) {
    const firstShowId = shows.find((show) => isDbId(show.id))?.id || null;
    setSlots((prev) => [
      ...prev,
      {
        id: null,
        show_id: firstShowId,
        day_of_week: Number(dayOfWeek) || 1,
        start_time: '08:00',
        end_time: '09:00',
        priority: 0,
        is_active: true
      }
    ]);
  }

  function addCover() {
    setCovers((prev) => [...prev, { id: null, image_url: '', title: '', sort_order: prev.length, is_active: true }]);
  }

  function addTrack() {
    setTracks((prev) => [...prev, { id: null, title: '', dj_name: '', cover_url: '', mp3_url: '', sort_order: prev.length, is_active: true }]);
  }

  function addVideo() {
    const usedSlots = new Set(videos.map((video) => Number(video.slot)));
    let nextSlot = 1;
    while (usedSlots.has(nextSlot) && nextSlot <= 3) {
      nextSlot += 1;
    }

    setVideos((prev) => [...prev, { id: null, slot: Math.min(nextSlot, 3), title: '', youtube_url: '', is_active: true }]);
  }

  function setCommentStatus(id, status) {
    setComments((prev) => prev.map((comment) => (comment.id === id ? { ...comment, status } : comment)));
  }

  function updateShow(index, key, value) {
    setShows((prev) =>
      prev.map((show, showIndex) => {
        if (showIndex !== index) {
          return show;
        }

        const nextShow = { ...show, [key]: value };

        if (key === 'name') {
          const previousSlug = toSlug(show.name);
          const nextSlug = toSlug(value);
          if (!show.slug || show.slug === previousSlug) {
            nextShow.slug = nextSlug;
          }
        }

        return nextShow;
      })
    );
  }

  async function uploadShowCover(index, file) {
    const publicUrl = await uploadAdminFile(file, 'shows');
    updateShow(index, 'cover_url', publicUrl);
    return publicUrl;
  }

  async function uploadCoverImage(index, file) {
    const publicUrl = await uploadAdminFile(file, 'covers');
    updateCover(index, 'image_url', publicUrl);
    return publicUrl;
  }

  async function uploadTrackMp3(index, file) {
    const publicUrl = await uploadAdminFile(file, 'tracks');
    updateTrack(index, 'mp3_url', publicUrl);
    return publicUrl;
  }

  async function publish() {
    // Persist the current draft to Supabase, then reload canonical data.
    setMessage('');
    setIsPublishing(true);

    try {
      await publishAdminData({ shows, slots, covers, tracks, videos, comments }, deletedIds);
      await loadData();
      setMessageType('success');
      setMessage('Publish done. Supabase is updated.');
    } catch (error) {
      setMessageType('error');
      setMessage(error.message || 'Publish failed.');
    } finally {
      setIsPublishing(false);
    }
  }

  function clearMessage() {
    setMessage('');
  }

  const hasPendingChanges = useMemo(
    () =>
      buildSnapshot(
        {
          shows,
          slots,
          covers,
          tracks,
          videos,
          comments
        },
        deletedIds
      ) !== publishedSnapshot,
    [shows, slots, covers, tracks, videos, comments, deletedIds, publishedSnapshot]
  );

  return {
    isPublishing,
    hasPendingChanges,
    message,
    messageType,
    clearMessage,
    shows,
    slots,
    covers,
    tracks,
    videos,
    comments,
    loadData,
    clearData,
    publish,
    addShow,
    addSlot,
    addCover,
    addTrack,
    addVideo,
    setCommentStatus,
    updateShow,
    updateSlot,
    updateCover,
    updateTrack,
    updateVideo,
    uploadShowCover,
    uploadCoverImage,
    uploadTrackMp3,
    removeShow: (index) => removeItem('shows', setShows, index),
    removeSlot: (index) => removeItem('slots', setSlots, index),
    removeCover: (index) => removeItem('covers', setCovers, index),
    removeTrack: (index) => removeItem('tracks', setTracks, index),
    removeVideo: (index) => removeItem('videos', setVideos, index)
  };
}

export default useAdminEditor;
