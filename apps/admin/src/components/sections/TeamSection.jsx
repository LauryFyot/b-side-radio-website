import { useId } from 'react';
import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2 } from 'lucide-react';

const MAX_TEAM_MEMBERS = 8;
const inputClass = 'w-full min-w-0 rounded-full border border-[#ddd8df] bg-white px-3.5 py-2 text-sm text-[#1e1a22] outline-0 placeholder:text-[#8a8392]';

function TeamSection({ members, onAdd, onUpdate, onUploadImage, onRemove, onMove }) {
  const componentId = useId().replace(/:/g, '');
  if (!Array.isArray(members)) {
    return <p role="status">Team editing is unavailable. Run supabase/team-members-migration.sql, then reload.</p>;
  }

  return (
    <section className="rounded-[var(--admin-radius)] bg-admin-subsection p-[var(--admin-panel-padding)] max-[1080px]:p-[var(--admin-panel-padding-mobile)]">
      <div className="mb-[var(--admin-section-content-gap)] flex items-center justify-between gap-3">
        <div>
          <p className="m-0 text-[length:var(--admin-section-kicker-size)] font-bold uppercase tracking-[0.12em] text-[#726b78]">Homepage</p>
          <h2 className="m-0 font-['Space_Grotesk'] text-[length:var(--admin-section-title-size)] font-bold">Team members</h2>
          <p className="m-0 text-xs text-admin-muted">{members.length}/{MAX_TEAM_MEMBERS} members</p>
        </div>
        <button type="button" disabled={members.length >= MAX_TEAM_MEMBERS} onClick={onAdd} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-admin-line bg-white px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50">
          <Plus size={15} aria-hidden="true" /> Add member
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {members.map((member, index) => {
          const memberKey = member.id != null ? `saved-${member.id}` : member.draft_key;
          const inputId = `${componentId}-team-image-${memberKey ?? `draft-${index}`}`;
          return (
          <article key={memberKey ?? `draft-${index}`} className="grid min-w-0 gap-3 rounded-[var(--admin-radius)] border border-[#ddd8df] bg-white p-3 sm:grid-cols-[112px_minmax(0,1fr)]">
            <div className="grid content-start gap-2">
              <label className="group relative block aspect-[4/5] cursor-pointer overflow-hidden rounded-xl bg-admin-subsection-muted" htmlFor={inputId}>
                {member.image_url ? <img src={member.image_url} alt={member.name ? `${member.name} portrait` : 'Team portrait preview'} className="absolute inset-0 size-full object-cover" /> : null}
                <span className="absolute inset-0 grid place-items-center bg-black/35 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  <ImagePlus size={22} aria-hidden="true" />
                </span>
              </label>
              <input
                id={inputId}
                className="sr-only"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={async (event) => {
                  const input = event.currentTarget;
                  const file = input.files?.[0];
                  if (!file) return;
                  try {
                    await onUploadImage(memberKey, file);
                  } catch (error) {
                    console.error(error);
                  } finally {
                    input.value = '';
                  }
                }}
              />
              <div className="flex justify-center gap-1">
                <button type="button" disabled={index === 0} onClick={() => onMove(index, -1)} title="Move up" aria-label={`Move ${member.name || `member ${index + 1}`} up`} className="grid size-8 place-items-center rounded-full border border-admin-line bg-white disabled:opacity-40"><ArrowUp size={15} /></button>
                <button type="button" disabled={index === members.length - 1} onClick={() => onMove(index, 1)} title="Move down" aria-label={`Move ${member.name || `member ${index + 1}`} down`} className="grid size-8 place-items-center rounded-full border border-admin-line bg-white disabled:opacity-40"><ArrowDown size={15} /></button>
                <button type="button" onClick={() => onRemove(index)} title="Delete member" aria-label={`Delete ${member.name || `member ${index + 1}`} `} className="grid size-8 place-items-center rounded-full border border-admin-line bg-white text-admin-red"><Trash2 size={15} /></button>
              </div>
            </div>

            <div className="grid min-w-0 content-start gap-2">
              <label className="grid gap-1 text-[11px] font-bold text-[#625b68]">Name
                <input className={inputClass} value={member.name} onChange={(event) => onUpdate(index, 'name', event.target.value)} />
              </label>
              <label className="grid gap-1 text-[11px] font-bold text-[#625b68]">Role (FR)
                <input className={inputClass} value={member.role} onChange={(event) => onUpdate(index, 'role', event.target.value)} />
              </label>
              <label className="grid gap-1 text-[11px] font-bold text-[#625b68]">Role (EN)
                <input className={inputClass} value={member.role_en} onChange={(event) => onUpdate(index, 'role_en', event.target.value)} />
              </label>
              <label className="grid gap-1 text-[11px] font-bold text-[#625b68]">Text (FR)
                <textarea className="min-h-16 w-full resize-y rounded-xl border border-[#ddd8df] bg-white px-3.5 py-2 text-sm outline-0" value={member.bio} onChange={(event) => onUpdate(index, 'bio', event.target.value)} />
              </label>
              <label className="grid gap-1 text-[11px] font-bold text-[#625b68]">Text (EN)
                <textarea className="min-h-16 w-full resize-y rounded-xl border border-[#ddd8df] bg-white px-3.5 py-2 text-sm outline-0" value={member.bio_en} onChange={(event) => onUpdate(index, 'bio_en', event.target.value)} />
              </label>
            </div>
          </article>
          );
        })}
      </div>
    </section>
  );
}

export default TeamSection;