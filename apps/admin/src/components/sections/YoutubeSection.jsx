// Editor for featured YouTube spotlight videos.
// Accepts slot/title/url and validates links through embed preview.
// Keeps content changes local until publish is triggered.
import { extractYouTubeId } from '../../utils/adminHelpers';

function getYouTubeThumb(url) {
  const id = extractYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}

function YoutubeSection({ videos, onUpdateVideo }) {
  return (
    <section className="mt-4 rounded-[var(--admin-radius)] bg-admin-subsection p-[var(--admin-panel-padding)] max-[1080px]:p-[var(--admin-panel-padding-mobile)]">
      <div>
        <div className="flex-1 mb-[var(--admin-section-content-gap)]">
          <p className="m-0 text-[length:var(--admin-section-kicker-size)] font-bold uppercase tracking-[0.12em] text-[#7f7784]">Featured this week</p>
          <h2 className="m-0 font-['Space_Grotesk'] text-[length:var(--admin-section-title-size)] [font-weight:var(--admin-section-title-weight)] tracking-[var(--admin-subsection-title-spacing)]">Youtube videos</h2>
        </div>
        <div className="grid grid-cols-1 gap-[14px] lg:grid-cols-3">
          {videos.map((video, index) => (
            <article key={`video-${video.id ?? index}`} className="grid overflow-hidden rounded-[var(--admin-radius)] border border-[#ddd8df] bg-white">
              <div className="relative border-b border-[#e6e0e8]">
                {getYouTubeThumb(video.youtube_url) ? (
                  <img className="block aspect-video w-full object-cover" src={getYouTubeThumb(video.youtube_url)} alt={video.title || `Video ${index + 1}`} loading="lazy" />
                ) : (
                  <div className="grid aspect-video place-items-center bg-[linear-gradient(145deg,#ece8ef,#dfd8e3)] text-[13px] font-bold text-[#6e6773]">Paste a YouTube URL</div>
                )}

                <label className="absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-[rgba(19,14,19,0.66)] px-2 py-1 text-[11px] font-bold leading-none text-white">
                  Slot
                  <select
                    className="cursor-pointer appearance-none border-0 bg-transparent p-0 font-inherit leading-none text-white outline-0"
                    value={video.slot || ''}
                    onChange={(event) => onUpdateVideo(index, 'slot', Number(event.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6].map((slotNumber) => (
                      <option key={`slot-opt-${slotNumber}`} value={slotNumber}>
                        {slotNumber}
                      </option>
                    ))}
                  </select>
                </label>

              </div>

              <div className="grid gap-2 p-3 bg-[var(--admin-subsection-muted-bg)]">
                <input className="w-full rounded-xl border border-transparent px-0.5 py-0.5 font-['Space_Grotesk'] text-[length:var(--admin-card-title-size)] font-bold text-[#29242f] outline-0" placeholder="Video title" value={video.title || ''} onChange={(event) => onUpdateVideo(index, 'title', event.target.value)} />
                <input
                  className="w-full rounded-full border border-[#ddd7df] bg-white px-3 py-2 font-inherit text-[length:var(--admin-field-text-size)] text-[#6e6674] outline-0"
                  placeholder="YouTube URL"
                  value={video.youtube_url || ''}
                  onChange={(event) => onUpdateVideo(index, 'youtube_url', event.target.value)}
                />

                {!extractYouTubeId(video.youtube_url) && <p className="m-0 text-xs text-[#8b8392]">Use a regular YouTube URL or youtu.be short link.</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default YoutubeSection;
