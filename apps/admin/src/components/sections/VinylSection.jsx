// Editor for vinyl carousel cover cards.
// Handles title/image URL fields plus image upload shortcuts.
// Keeps ordering and deletion under editor-managed draft state.
import { Trash2 } from 'lucide-react';

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function VinylIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="2.1" fill="currentColor" />
      <path d="M15.8 8.2A5.7 5.7 0 0 1 17.7 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M17 6.2A8.3 8.3 0 0 1 19.9 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function VinylSection({ covers, onAddCover, onUpdateCover, onUploadCoverImage, onRemoveCover }) {
  return (
    <section className="vinyl-section">
      <div className="section-head vinyl-head">
        <div>
          <p className="vinyl-kicker">Homepage carousel</p>
          <h2>Vinyl covers</h2>

        </div>
        <button className="chip icon-chip" onClick={onAddCover} type="button">
          <PlusIcon />
          Add
        </button>
      </div>

      <div className="vinyl-grid">
        {covers.map((cover, index) => (
          <article className="vinyl-card" key={`cover-${cover.id ?? index}`}>
            <label className="vinyl-upload-zone" htmlFor={`vinyl-file-${cover.id ?? index}`}>
              <div className="vinyl-disc">
                {cover.image_url ? <img alt={cover.title || 'Vinyl cover'} className="vinyl-cover-img" src={cover.image_url} /> : null}
                <span className="vinyl-upload-cta">
                  <VinylIcon />
                  {cover.image_url ? 'Change PNG' : 'Upload PNG'}
                </span>
              </div>
            </label>

            <div className="vinyl-card-foot">
              <input
                className="vinyl-title-input"
                placeholder="Vinyl title"
                value={cover.title || ''}
                onChange={(event) => onUpdateCover(index, 'title', event.target.value)}
              />
              <button
                className="vinyl-delete-btn"
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onRemoveCover(index);
                }}
                aria-label="Delete cover"
              >
                <Trash2 aria-hidden="true" focusable="false" />
              </button>
            </div>

            <input
              id={`vinyl-file-${cover.id ?? index}`}
              className="vinyl-file-input"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) {
                  return;
                }

                try {
                  await onUploadCoverImage(index, file);
                } catch (error) {
                  console.error(error);
                }
                event.target.value = '';
              }}
            />
          </article>
        ))}

        <button className="vinyl-add-card" type="button" onClick={onAddCover} aria-label="Add cover">
          <PlusIcon />
        </button>
      </div>
    </section>
  );
}

export default VinylSection;
