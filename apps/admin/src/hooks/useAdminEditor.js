// Content editing state manager for the admin app.
// Holds local drafts for shows, schedule, media, videos, and comments.
// Exposes CRUD helpers and publish action to sync changes to Supabase.
import { useState } from 'react';
import { fetchBootstrapData, publishAdminData, uploadAdminFile } from '../lib/adminRepository';
import { isDbId, toSlug } from '../utils/adminHelpers';
function useAdminEditor() {
  const [isPublishing, setIsPublishing] = useState(false);
  const [message, setMessage] = useState('');

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

  function hydrateState(data) {
    // Replace full local draft from a server snapshot.
    setShows(data.shows || []);
    setSlots(data.slots || []);
    setCovers(data.covers || []);
    setTracks(data.tracks || []);
    setVideos(data.videos || []);
    setComments(data.comments || []);
    setDeletedIds({ shows: [], slots: [], covers: [], tracks: [], videos: [] });
  }

  async function loadData() {
    // Fetch all admin datasets in one step (shows, slots, tracks, videos, comments...).
    const data = await fetchBootstrapData();
    hydrateState(data);
  }

  function clearData() {
    hydrateState({ shows: [], slots: [], covers: [], tracks: [], videos: [], comments: [] });
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

  function addSlot() {
    const firstShowId = shows.find((show) => isDbId(show.id))?.id || null;
    setSlots((prev) => [...prev, { id: null, show_id: firstShowId, day_of_week: 1, start_time: '08:00', end_time: '09:00', priority: 0, is_active: true }]);
  }

  function addCover() {
    setCovers((prev) => [...prev, { id: null, image_url: '', title: '', sort_order: prev.length, is_active: true }]);
  }

  function addTrack() {
    setTracks((prev) => [...prev, { id: null, title: '', cover_url: '', mp3_url: '', sort_order: prev.length, is_active: true }]);
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
      setMessage('Publish done. Supabase is updated.');
    } catch (error) {
      setMessage(error.message || 'Publish failed.');
    } finally {
      setIsPublishing(false);
    }
  }

  return {
    isPublishing,
    message,
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
