// Editor for favorite mixes displayed on the site.
// Supports MP3 URL/file input, live audio preview, and duration hints.
// Writes updates back through track handlers from the editor hook.
import { useEffect, useState } from 'react';
import { formatDuration } from '../../utils/adminHelpers';

function MixesSection({ tracks, onAddTrack, onUpdateTrack, onUploadTrackMp3, onRemoveTrack }) {
  const [durations, setDurations] = useState({});

  useEffect(() => {
    let cancelled = false;

    async function loadDurations() {
      const nextDurations = {};

      await Promise.all(
        tracks.map(
          (track, index) =>
            new Promise((resolve) => {
              const url = String(track.mp3_url || '').trim();
              if (url === '') {
                resolve();
                return;
              }

              const audio = new Audio();
              audio.preload = 'metadata';
              audio.onloadedmetadata = () => {
                nextDurations[track.id ?? index] = audio.duration;
                resolve();
              };
              audio.onerror = () => resolve();
              audio.src = url;
            })
        )
      );

      if (!cancelled) {
        setDurations(nextDurations);
      }
    }

    loadDurations();

    return () => {
      cancelled = true;
    };
  }, [tracks]);

  return (
    <section>
      <div className="section-head">
        <h2>6 favorite mixes</h2>
        <button className="chip" onClick={onAddTrack}>
          + Add
        </button>
      </div>
      <div className="mix-grid">
        {tracks.map((track, i) => (
          <article className={`mix-card tone-${(i % 4) + 1}`} key={`track-${track.id ?? i}`}>
            <input className="editor-input" placeholder="Title" value={track.title || ''} onChange={(event) => onUpdateTrack(i, 'title', event.target.value)} />
            <input className="editor-input" placeholder="MP3 URL" value={track.mp3_url || ''} onChange={(event) => onUpdateTrack(i, 'mp3_url', event.target.value)} />
            <input
              className="editor-input"
              type="file"
              accept="audio/mpeg,.mp3"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) {
                  return;
                }

                try {
                  await onUploadTrackMp3(i, file);
                } catch (error) {
                  console.error(error);
                }
                event.target.value = '';
              }}
            />
            <div className="audio-preview">
              {track.mp3_url ? <audio controls src={track.mp3_url} preload="metadata" /> : <p className="hint">No audio selected yet.</p>}
              {formatDuration(durations[track.id ?? i]) && <p className="hint">Duration: {formatDuration(durations[track.id ?? i])}</p>}
            </div>
            <input
              className="editor-input"
              placeholder="Cover URL (optional)"
              value={track.cover_url || ''}
              onChange={(event) => onUpdateTrack(i, 'cover_url', event.target.value)}
            />
            <button className="upload-btn" onClick={() => onRemoveTrack(i)}>
              Delete mix
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default MixesSection;
