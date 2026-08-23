// Editor for vinyl carousel cover cards.
// Handles title/image URL fields plus image upload shortcuts.
// Keeps ordering and deletion under editor-managed draft state.
import { Trash2 } from 'lucide-react';

function PlusIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function VinylIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="2.1" fill="currentColor" />
      <path d="M15.8 8.2A5.7 5.7 0 0 1 17.7 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M17 6.2A8.3 8.3 0 0 1 19.9 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function VinylSection({ covers, onAddCover, onUpdateCover, onUploadCoverImage, onRemoveCover }) {
  return (
    <section className="rounded-[var(--admin-radius)] bg-admin-subsection p-[var(--admin-panel-padding)] max-md:p-[var(--admin-panel-padding-mobile)]">
      <div className="mb-[var(--admin-section-content-gap)] flex items-center justify-between gap-2.5">
        <div>
          <p className="m-0 text-[length:var(--admin-section-kicker-size)] font-bold uppercase tracking-[0.12em] text-[#726b78]">Homepage carousel</p>
          <h2 className="m-0 font-['Space_Grotesk'] text-[length:var(--admin-section-title-size)] [font-weight:var(--admin-section-title-weight)] tracking-[var(--admin-subsection-title-spacing)]">Vinyl covers</h2>
        </div>
        {/* <button className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-admin-line bg-white px-3 py-1 font-base text-xs" onClick={onAddCover} type="button">
          <PlusIcon className="h-3.5 w-3.5" />
          Add
        </button> */}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {covers.map((cover, index) => (

          // Cover
          <article className="flex flex-col gap-3 rounded-[var(--admin-radius)] border border-[#ddd8df] bg-admin-subsection-muted p-4" key={`cover-${cover.id ?? index}`}>
            <label className="group block cursor-pointer" htmlFor={`vinyl-file-${cover.id ?? index}`}>
              <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_center,#61656a_0_3%,#2e3033_3%_8%,#27282a_8%_100%)] text-white">
                {cover.image_url ? <img alt={cover.title || 'Vinyl cover'} className="vinyl-cover-img absolute inset-0 h-full w-full object-cover" src={cover.image_url} /> : null}
                <span className={`absolute inset-0 z-[1] inline-flex flex-col items-center justify-center gap-2 rounded-full bg-[rgba(22,18,24,0.45)] text-sm font-bold text-[rgba(245,245,245,0.95)] transition-opacity duration-150 [text-shadow:0_1px_2px_rgba(0,0,0,0.4)] ${cover.image_url ? 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100' : 'opacity-100'}`}>
                  <VinylIcon className="size-8" />
                  {cover.image_url ? 'Change PNG' : 'Upload PNG'}
                </span>
              </div>
            </label>

            {/* Title */}
            <div className="flex items-center justify-between gap-2.5">
              <input
                className="w-full border-0 bg-transparent font-['Space_Grotesk'] text-[length:var(--admin-card-title-size)] font-bold text-[#1e1a22] outline-0"
                placeholder="Vinyl title"
                value={cover.title || ''}
                onChange={(event) => onUpdateCover(index, 'title', event.target.value)}
              />

              {/* Delete */}
              <button
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-[#59515f]"
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onRemoveCover(index);
                }}
                aria-label="Delete cover"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" focusable="false" />
              </button>
            </div>

            <input
              id={`vinyl-file-${cover.id ?? index}`}
              className="pointer-events-none absolute h-0 w-0 opacity-0"
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

        <button className="inline-flex cursor-pointer items-center justify-center rounded-[26px] border-2 border-dashed border-[#ddd6df] bg-[#fbfafc] text-[#8a8392]" type="button" onClick={onAddCover} aria-label="Add cover">
          <PlusIcon className="h-[30px] w-[30px]" />
        </button>
      </div>
    </section>
  );
}

export default VinylSection;
