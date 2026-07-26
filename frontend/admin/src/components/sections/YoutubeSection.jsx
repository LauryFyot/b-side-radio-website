// Editor for featured YouTube spotlight videos.
// Accepts slot/title/url and validates links through embed preview.
// Keeps content changes local until publish is triggered.
import { getYouTubeEmbedUrl, extractYouTubeId } from '../../utils/adminHelpers';

function YoutubeSection({ videos, onAddVideo, onUpdateVideo, onRemoveVideo }) {
  return (
    <section>
      <div className="section-head">
        <h2>YouTube spotlight</h2>
        <button className="chip" onClick={onAddVideo}>+ Add</button>
      </div>
      <div className="video-grid">
        {videos.map((video, index) => (
          <article key={`video-${video.id ?? index}`} className="video-card">
            <input className="editor-input" type="number" min="1" max="3" value={video.slot || ''} onChange={(event) => onUpdateVideo(index, 'slot', Number(event.target.value))} />
            <input className="editor-input" placeholder="Video title" value={video.title || ''} onChange={(event) => onUpdateVideo(index, 'title', event.target.value)} />
            <input
              className="editor-input"
              placeholder="YouTube URL"
              value={video.youtube_url || ''}
              onChange={(event) => onUpdateVideo(index, 'youtube_url', event.target.value)}
            />
            {getYouTubeEmbedUrl(video.youtube_url) ? (
              <div className="video-preview">
                <iframe
                  title={video.title || `YouTube preview ${video.slot || index + 1}`}
                  src={getYouTubeEmbedUrl(video.youtube_url)}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
                <p className="hint">Preview video ID: {extractYouTubeId(video.youtube_url)}</p>
              </div>
            ) : (
              <p className="hint">Paste a standard YouTube link or short link to see a preview.</p>
            )}
            <button className="upload-btn" onClick={() => onRemoveVideo(index)}>
              Delete video
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default YoutubeSection;
