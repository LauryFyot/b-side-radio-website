// Editor for favorite mixes displayed on the site.
// Supports MP3 URL/file input, live audio preview, and duration hints.
// Writes updates back through track handlers from the editor hook.
import { useEffect, useState } from 'react';
import { formatDuration } from '../../utils/adminHelpers';

function MusicIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M16 5v9.5a2.5 2.5 0 1 1-1.5-2.28V8.6l-5 1.2v7.2a2.5 2.5 0 1 1-1.5-2.28V7.9z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 15V6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8.5 9.5 12 6l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 17.5v1.2A1.3 1.3 0 0 0 6.8 20h10.4a1.3 1.3 0 0 0 1.3-1.3v-1.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MixesSection({ tracks, onUpdateTrack, onUploadTrackMp3 }) {
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
    <section className="mixes-section">
      <div className="mixes-head">
        <div>
          <p className="mixes-kicker">Curated selection</p>
          <h2>6 favorite mixes</h2>
        </div>
        <p className="mixes-note">MP3 · duration detected automatically</p>
      </div>

      <div className="mixes-grid">
        {tracks.map((track, i) => (
          <article className={`mix-card tone-${(i % 4) + 1} mix-curated-card`} key={`track-${track.id ?? i}`}>
            <div className="mix-card-head">
              <span className="mix-slot-badge">#{i + 1}</span>
              <span className="mix-duration">{formatDuration(durations[track.id ?? i]) || '--:--'}</span>
            </div>

            <input
              className="mix-title-input"
              placeholder="Mix title"
              value={track.title || ''}
              onChange={(event) => onUpdateTrack(i, 'title', event.target.value)}
            />

            <p className="mix-artist">DJ set</p>

            <div className="mix-upload-panel">
              <p className="mix-file-status">
                <MusicIcon />
                {track.mp3_url ? 'MP3 ready' : 'No MP3 file yet'}
              </p>

              <label className="mix-upload-btn" htmlFor={`mix-file-${track.id ?? i}`}>
                <UploadIcon />
                Upload MP3
              </label>

              <input
                id={`mix-file-${track.id ?? i}`}
                className="mix-file-input"
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
            </div>

            <input className="mix-url-input" placeholder="https://...mp3" value={track.mp3_url || ''} onChange={(event) => onUpdateTrack(i, 'mp3_url', event.target.value)} />
          </article>
        ))}
      </div>
    </section>
  );
}

export default MixesSection;
