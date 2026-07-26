// Editor for vinyl carousel cover cards.
// Handles title/image URL fields plus image upload shortcuts.
// Keeps ordering and deletion under editor-managed draft state.
function VinylSection({ covers, onAddCover, onUpdateCover, onUploadCoverImage, onRemoveCover }) {
  return (
    <section>
      <div className="section-head">
        <h2>Vinyl covers</h2>
        <button className="chip" onClick={onAddCover}>
          + Add
        </button>
      </div>
      <div className="vinyl-grid">
        {covers.map((cover, index) => (
          <article className="vinyl-card" key={`cover-${cover.id ?? index}`}>
            <div className="vinyl-disc">●</div>
            <input className="editor-input" placeholder="Title" value={cover.title || ''} onChange={(event) => onUpdateCover(index, 'title', event.target.value)} />
            <input
              className="editor-input"
              placeholder="Image URL"
              value={cover.image_url || ''}
              onChange={(event) => onUpdateCover(index, 'image_url', event.target.value)}
            />
            <input
              className="editor-input"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
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
            {cover.image_url ? <img alt={cover.title || 'Vinyl cover'} className="cover-preview" src={cover.image_url} /> : <p className="hint">No image selected yet.</p>}
            <button className="upload-btn" onClick={() => onRemoveCover(index)}>
              Delete cover
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default VinylSection;
