// Editor for favorite mixes displayed on the site.
// Supports MP3 URL/file input, live audio preview, and duration hints.
// Writes updates back through track handlers from the editor hook.
import { useEffect, useState } from 'react';
import { AudioLines } from 'lucide-react';
import { formatDuration } from '../../utils/adminHelpers';

function UploadIcon() {
  return (
    <svg className="size-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
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
    <section className="rounded-[var(--admin-radius)] bg-admin-subsection p-[var(--admin-panel-padding)] max-md:p-[var(--admin-panel-padding-mobile)]">

      {/* Header */}
      <div className="mb-[var(--admin-section-content-gap)] flex items-end justify-between gap-3 max-md:items-start max-md:flex-col">
        <div>
          <p className="m-0 text-[length:var(--admin-section-kicker-size)] font-bold uppercase tracking-[0.12em] text-[#736c78]">Curated selection</p>
          <h2 className="m-0 font-['Space_Grotesk'] text-[length:var(--admin-section-title-size)] [font-weight:var(--admin-section-title-weight)] tracking-[var(--admin-subsection-title-spacing)]">Favorite mixes</h2>
        </div>
        <p className="m-[var(--admin-section-support-gap)] mb-0 text-[length:var(--admin-section-support-size)] leading-[var(--admin-section-support-line-height)] text-[#68616d] max-md:text-base">MP3 · duration detected automatically</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-[14px] lg:grid-cols-3">
        {tracks.map((track, i) => (
          // Card
          <article className={`tone-${(i % 4) + 1} flex min-h-[248px] flex-col gap-2 rounded-[var(--admin-radius)] p-[18px] text-white`} key={`track-${track.id ?? i}`}>
            <div className="mb-0.5 flex items-center justify-between">
              {/* ID */}
              <span className={`inline-flex min-h-2 items-center justify-center rounded-full px-2 py-0.5 font-bold text-xs ${i % 4 === 1 || i % 4 === 3 ? 'bg-[rgba(49,29,35,0.18)]' : 'bg-[rgba(0,0,0,0.16)]'}`}>#{i + 1}</span>
              {/* Time */}
              <span className="text-xs font-base opacity-90">{formatDuration(durations[track.id ?? i]) || '--:--'}</span>
            </div>

            {/* Header */}
            <div className={`flex items-center gap-2.5 center`}>
              {/* Upload */}
              <label className={`cursor-pointer items-center justify-center gap-2 rounded-full border p-1.5 font-bold text-sm ${i % 4 === 1 ? 'border-[rgba(49,29,35,0.28)] text-[#2f2428]' : 'border-[rgba(255,255,255,0.42)]'}`} htmlFor={`mix-file-${track.id ?? i}`}>
                <UploadIcon />
              </label>

              <div>
                {/* Title */}
                <input
                  className={`w-full border-0 bg-transparent font-['Space_Grotesk'] text-sm font-bold leading-[1.15] outline-0 ${i % 4 === 1 ? 'text-[#2f2428] placeholder:text-[rgba(47,36,40,0.7)]' : 'placeholder:text-[rgba(255,255,255,0.86)]'}`}
                  placeholder="Mix title"
                  value={track.title || ''}
                  onChange={(event) => onUpdateTrack(i, 'title', event.target.value)}
                />
                {/* DJ Name */}
                <input
                  className={`w-full border-0 bg-transparent text-xs opacity-50 outline-0 ${i % 4 === 1 ? 'text-[#2f2428] placeholder:text-[rgba(47,36,40,0.7)]' : 'text-[rgba(255,255,255,0.84)] placeholder:text-[rgba(255,255,255,0.84)]'}`}
                  placeholder="DJ name"
                  value={track.dj_name || ''}
                  onChange={(event) => onUpdateTrack(i, 'dj_name', event.target.value)}
                />
              </div>
            </div>
            <div className={`rounded-[var(--admin-radius)] p-3 ${i % 4 === 1 || i % 4 === 3 ? 'bg-[rgba(70,45,51,0.16)]' : 'bg-[rgba(255,255,255,0.16)]'}`}>
              <p className={`inline-flex items-center gap-2 text-xs ${i % 4 === 1 ? 'text-[#2f2428]' : ''}`}>
                <AudioLines aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.2} />
                {track.mp3_url ? 'MP3 loaded' : 'No MP3 file yet'}
              </p>

              <div className="flex items-center gap-2 max-md:flex-col">
                {track.mp3_url && (
                  <audio
                    className="h-8 max-w-full shrink-0 bg-opacity-10"
                    controls
                    preload="metadata"
                    src={track.mp3_url}
                    aria-label={`Preview ${track.title || 'MP3 mix'}`}
                  />
                )}
              </div>

              <input
                id={`mix-file-${track.id ?? i}`}
                className="pointer-events-none absolute h-0 w-0 opacity-0"
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

            <input className={`w-full rounded-full border bg-transparent px-3.5 py-2 text-[length:var(--admin-field-text-size)] outline-0 ${i % 4 === 1 || i % 4 === 3 ? 'border-[rgba(49,29,35,0.28)] text-[#2f2428] placeholder:text-[rgba(47,36,40,0.7)]' : 'border-[rgba(255,255,255,0.35)] text-[rgba(255,255,255,0.86)] placeholder:text-[rgba(255,255,255,0.75)]'}`} placeholder="https://...mp3" value={track.mp3_url || ''} onChange={(event) => onUpdateTrack(i, 'mp3_url', event.target.value)} />
          </article>
        ))}
      </div>
    </section>
  );
}

export default MixesSection;
