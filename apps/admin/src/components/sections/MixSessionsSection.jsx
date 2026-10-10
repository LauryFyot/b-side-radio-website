// Editor for the mix sessions displayed on the site.
// Supports MP3 URL/file input, live audio preview, and duration hints.
import { useEffect, useState } from 'react';
import { AudioLines, LoaderCircle, Plus, Trash2, Upload } from 'lucide-react';
import { formatDuration } from '../../utils/adminHelpers';

const MAX_MIX_SESSIONS = 8;

function getMixSessionKey(track, index) {
  return track.id == null ? `draft-${index}` : `saved-${track.id}`;
}

function MixSessionsSection({ tracks, onAddTrack, onUpdateTrack, onUploadTrackMp3, onRemoveTrack }) {
  const [durations, setDurations] = useState({});
  const [uploadingKey, setUploadingKey] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDurations() {
      const nextDurations = {};

      await Promise.all(
        tracks.map(
          (track, index) =>
            new Promise((resolve) => {
              const key = getMixSessionKey(track, index);
              const url = String(track.mp3_url || '').trim();
              if (url === '') {
                resolve();
                return;
              }

              const audio = new Audio();
              audio.preload = 'metadata';
              audio.onloadedmetadata = () => {
                nextDurations[key] = audio.duration;
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
      <div className="mb-[var(--admin-section-content-gap)] flex items-end justify-between gap-3 max-md:items-start max-md:flex-col">
        <div>
          <p className="m-0 text-[length:var(--admin-section-kicker-size)] font-bold uppercase tracking-[0.12em] text-[#736c78]">Curated selection</p>
          <h2 className="m-0 font-['Space_Grotesk'] text-[length:var(--admin-section-title-size)] [font-weight:var(--admin-section-title-weight)] tracking-[var(--admin-subsection-title-spacing)]">Mix sessions</h2>
        </div>
        <div className="flex items-center gap-3 max-md:w-full max-md:justify-between">
          <p className="m-0 text-[length:var(--admin-section-support-size)] leading-[var(--admin-section-support-line-height)] text-[#68616d]">
            {tracks.length}/{MAX_MIX_SESSIONS} · MP3 · duration detected automatically
          </p>
          <button
            className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-admin-line bg-white px-3 py-1 font-base text-xs disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onAddTrack}
            type="button"
            disabled={tracks.length >= MAX_MIX_SESSIONS}
          >
            <Plus className="size-3.5" />
            Add mix session
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-[14px] lg:grid-cols-3">
        {tracks.map((track, i) => {
          const key = getMixSessionKey(track, i);
          const isUploading = uploadingKey === key;
          return (
          <article className={`tone-${(i % 4) + 1} flex min-h-[248px] flex-col gap-2 rounded-[var(--admin-radius)] p-[18px] text-white`} key={key}>
            <div className="mb-0.5 flex items-center justify-between">
              <span className={`inline-flex min-h-2 items-center justify-center rounded-full px-2 py-0.5 font-bold text-xs ${i % 4 === 1 || i % 4 === 3 ? 'bg-[rgba(49,29,35,0.18)]' : 'bg-[rgba(0,0,0,0.16)]'}`}>#{i + 1}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-base opacity-90">{formatDuration(durations[key]) || '--:--'}</span>
                <button
                  className="grid size-7 cursor-pointer place-items-center rounded-full border-0 bg-black/10 text-current"
                  type="button"
                  disabled={uploadingKey !== null}
                  onClick={() => onRemoveTrack(i)}
                  aria-label={`Delete mix session ${i + 1}`}
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <label className={`${uploadingKey !== null ? 'cursor-wait' : 'cursor-pointer'} inline-flex size-8 shrink-0 items-center justify-center rounded-full border font-bold text-sm ${i % 4 === 1 ? 'border-[rgba(49,29,35,0.28)] text-[#2f2428]' : 'border-[rgba(255,255,255,0.42)]'}`} htmlFor={`mix-file-${key}`} title={isUploading ? 'Uploading MP3' : 'Upload MP3'} aria-label={isUploading ? 'Uploading MP3' : 'Upload MP3'} aria-busy={isUploading}>
                {isUploading
                  ? <LoaderCircle className="size-4 shrink-0 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                  : <Upload className="size-4 shrink-0" aria-hidden="true" />}
              </label>

              <div className="min-w-0 flex-1">
                <input
                  className={`w-full border-0 bg-transparent font-['Space_Grotesk'] text-sm font-bold leading-[1.15] outline-0 ${i % 4 === 1 ? 'text-[#2f2428] placeholder:text-[rgba(47,36,40,0.7)]' : 'placeholder:text-[rgba(255,255,255,0.86)]'}`}
                  placeholder="Mix title"
                  value={track.title || ''}
                  onChange={(event) => onUpdateTrack(i, 'title', event.target.value)}
                />
                <input
                  className={`w-full border-0 bg-transparent text-xs opacity-70 outline-0 ${i % 4 === 1 ? 'text-[#2f2428] placeholder:text-[rgba(47,36,40,0.7)]' : 'text-[rgba(255,255,255,0.84)] placeholder:text-[rgba(255,255,255,0.84)]'}`}
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

              {track.mp3_url && (
                <audio
                  className="h-8 max-w-full shrink-0 bg-opacity-10"
                  controls
                  preload="metadata"
                  src={track.mp3_url}
                  aria-label={`Preview ${track.title || 'MP3 mix'}`}
                />
              )}

              <input
                id={`mix-file-${key}`}
                className="pointer-events-none absolute h-0 w-0 opacity-0"
                type="file"
                disabled={uploadingKey !== null}
                accept="audio/mpeg,.mp3"
                onChange={async (event) => {
                  const input = event.currentTarget;
                  const file = input.files?.[0];
                  if (!file) {
                    return;
                  }

                  setUploadingKey(key);
                  try {
                    await onUploadTrackMp3(i, file);
                  } catch (error) {
                    console.error(error);
                  } finally {
                    setUploadingKey(null);
                    input.value = '';
                  }
                }}
              />
            </div>

            <input
              className={`w-full rounded-full border bg-transparent px-3.5 py-2 text-[length:var(--admin-field-text-size)] outline-0 ${i % 4 === 1 || i % 4 === 3 ? 'border-[rgba(49,29,35,0.28)] text-[#2f2428] placeholder:text-[rgba(47,36,40,0.7)]' : 'border-[rgba(255,255,255,0.35)] text-[rgba(255,255,255,0.86)] placeholder:text-[rgba(255,255,255,0.75)]'}`}
              placeholder="https://...mp3"
              disabled={isUploading}
              value={track.mp3_url || ''}
              onChange={(event) => onUpdateTrack(i, 'mp3_url', event.target.value)}
            />

            <input
              className={`w-full border-0 bg-transparent text-xs opacity-70 outline-0 ${i % 4 === 1 || i % 4 === 3 ? 'text-[#2f2428] placeholder:text-[rgba(47,36,40,0.7)]' : 'text-[rgba(255,255,255,0.86)] placeholder:text-[rgba(255,255,255,0.75)]'}`}
              placeholder="Recommended by"
              value={track.recommended_by || ''}
              onChange={(event) => onUpdateTrack(i, 'recommended_by', event.target.value)}
            />
          </article>
          );
        })}
      </div>
    </section>
  );
}

export default MixSessionsSection;