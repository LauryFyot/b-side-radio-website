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
    <section className="youtube-section">
      <div className="youtube-stage">
        <p className="youtube-kicker">Featured this week</p>
        <h3 className="youtube-stage-title">{videos.length} YouTube videos</h3>

        <div className="youtube-grid">
        {videos.map((video, index) => (
          <article key={`video-${video.id ?? index}`} className="youtube-card">
            <div className="youtube-thumb-shell">
              {getYouTubeThumb(video.youtube_url) ? (
                <img className="youtube-thumb" src={getYouTubeThumb(video.youtube_url)} alt={video.title || `Video ${index + 1}`} loading="lazy" />
              ) : (
                <div className="youtube-thumb youtube-thumb-fallback">Paste a YouTube URL</div>
              )}

              <label className="youtube-slot-pill">
                Slot
                <select
                  className="youtube-slot-select"
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

            <div className="youtube-card-body">
              <input className="youtube-title-input" placeholder="Video title" value={video.title || ''} onChange={(event) => onUpdateVideo(index, 'title', event.target.value)} />
              <input
                className="youtube-url-input"
                placeholder="YouTube URL"
                value={video.youtube_url || ''}
                onChange={(event) => onUpdateVideo(index, 'youtube_url', event.target.value)}
              />

              {!extractYouTubeId(video.youtube_url) && <p className="youtube-hint">Use a regular YouTube URL or youtu.be short link.</p>}
            </div>
          </article>
        ))}
        </div>
      </div>
    </section>
  );
}

export default YoutubeSection;
