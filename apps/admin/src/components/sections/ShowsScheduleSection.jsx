// Combined editor for program shows and weekly schedule slots.
// Lets admins edit show metadata and assign day/time programming.
// Supports cover upload and per-slot day/show/time adjustments.
import { Trash2 } from 'lucide-react';
import { dayLabels } from '../../constants/adminUi';
import { isDbId, toTimeInput } from '../../utils/adminHelpers';

const toneOrder = ['tone-1', 'tone-2', 'tone-3', 'tone-4'];

function PlusIcon() {
  return (
    <svg className='size-3 shrink-0' viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className='size-4 shrink-0' viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8v4l2.8 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg className='size-4 shrink-0' viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 15V6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8.5 9.5 12 6l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 17.5v1.2A1.3 1.3 0 0 0 6.8 20h10.4a1.3 1.3 0 0 0 1.3-1.3v-1.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m7 10 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShowsScheduleSection({
  shows,
  slots,
  onAddShow,
  onAddSlot,
  onUpdateShow,
  onUploadShowCover,
  onRemoveShow,
  onUpdateSlot,
  onRemoveSlot
}) {
  const persistedShowOptions = shows.filter((show) => isDbId(show.id));
  const toneByShowId = new Map(
    persistedShowOptions.map((show, index) => [show.id, toneOrder[index % toneOrder.length]])
  );

  return (
    <section className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[var(--admin-shows-columns)]">
      
      {/* Shows */}
      <div className="min-w-0 rounded-[var(--admin-radius)] bg-admin-subsection p-[var(--admin-panel-padding)] max-md:p-[var(--admin-panel-padding-mobile)]">
        {/* Header shows */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex-1">
            <p className="m-0 text-[length:var(--admin-section-kicker-size)] font-bold uppercase tracking-[0.12em] text-[#7f7784]">Showtime</p>
            <h2 className="m-0 font-['Space_Grotesk'] text-[length:var(--admin-section-title-size)] [font-weight:var(--admin-section-title-weight)] tracking-[var(--admin-subsection-title-spacing)]">Shows</h2>
          </div>
          <button className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-admin-line bg-white px-3 py-1 font-base text-xs" onClick={onAddShow} type="button">
            <PlusIcon />
            Add
          </button>
        </div>
        {/* Card shows */}
        <div className="grid gap-2.5">
          {shows.map((show, i) => (
            <article className={`tone-${(i % 4) + 1} grid gap-2.5 rounded-2xl p-3 text-white`} key={`show-${show.id ?? i}`}>
              <div className="grid grid-cols-[70px_minmax(0,1fr)_auto] items-start gap-2.5">
                {/* Picture */}
                <label className="relative inline-flex h-[70px] w-[70px] cursor-pointer">
                  {show.cover_url ? <img alt={show.name || 'Show cover'} className="h-[70px] w-[70px] rounded-[18px] border border-[rgba(255,255,255,0.36)] object-cover" src={show.cover_url} /> : <div className="h-[70px] w-[70px] rounded-[18px] border border-[rgba(255,255,255,0.36)] bg-[linear-gradient(135deg,rgba(255,255,255,0.26),rgba(255,255,255,0.06))]" />}
                  <span className={`absolute inset-0 inline-flex flex-col items-center justify-center gap-[3px] rounded-[18px] bg-[rgba(49,31,33,0.58)] text-[10px] font-bold tracking-[0.02em] text-[#f6efef] transition-opacity duration-150 ${show.cover_url ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                    <UploadIcon />
                    {show.cover_url ? 'Change' : 'Upload'}
                  </span>
                  <input
                    className="pointer-events-none absolute h-0 w-0 opacity-0"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) {
                        return;
                      }

                      try {
                        await onUploadShowCover(i, file);
                      } catch (error) {
                        console.error(error);
                      }
                      event.target.value = '';
                    }}
                  />
                </label>
                
                <div className="grid min-w-0 gap-1">
                  <input className="w-full border-0 bg-transparent font-['Space_Grotesk'] text-[length:var(--admin-card-title-size)] font-bold leading-none tracking-[-0.02em] text-inherit outline-0 placeholder:text-[rgba(255,255,255,0.82)] mt-1" placeholder="Show name" value={show.name || ''} onChange={(event) => onUpdateShow(i, 'name', event.target.value)} />
                  <input className="w-full border-0 bg-transparent text-xs lowercase text-inherit opacity-70 outline-0 placeholder:text-[rgba(255,255,255,0.82)]" placeholder="dj-or-slug" value={show.slug || ''} onChange={(event) => onUpdateShow(i, 'slug', event.target.value)} />
                </div>
                <button className="inline-flex h-[30px] w-[30px] cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-inherit opacity-[0.92] outline-0 transition-opacity hover:opacity-100" onClick={() => onRemoveShow(i)} type="button" aria-label="Delete show">
                  <Trash2 className="size-4 shrink-0 opacity-70" aria-hidden="true" focusable="false" />
                </button>
              </div>

              <textarea
                className="min-h-[68px] w-full resize-y rounded-[18px] border-0 bg-[rgba(255,255,255,0.18)] p-3 text-[length:var(--admin-field-text-size)] leading-[1.32] text-inherit outline-0 placeholder:text-[rgba(255,255,255,0.8)]"
                placeholder="Description"
                value={show.description || ''}
                onChange={(event) => onUpdateShow(i, 'description', event.target.value)}
              />

              <div className="flex justify-end">
                <span className="text-xs font-normal opacity-60">{(show.description || '').length}/280</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Schedule */}
      <div className="min-w-0 rounded-[var(--admin-radius)] bg-admin-subsection p-[var(--admin-panel-padding)] max-md:p-[var(--admin-panel-padding-mobile)]">
        {/* Header schedule */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex-1">
            <p className="m-0 text-[length:var(--admin-section-kicker-size)] font-bold uppercase tracking-[0.12em] text-[#7f7784]">Hours</p>
            <h2 className="m-0 font-['Space_Grotesk'] text-[length:var(--admin-section-title-size)] [font-weight:var(--admin-section-title-weight)] tracking-[var(--admin-subsection-title-spacing)]">Weekly schedule</h2>
          </div>
        </div>

        {/* Card schedule */}
        <div className="grid gap-2.5">
          {Object.entries(dayLabels).map(([dayNumber, dayLabel]) => {
            const daySlots = slots
              .map((slot, slotIndex) => ({ ...slot, _slotIndex: slotIndex }))
              .filter((slot) => Number(slot.day_of_week) === Number(dayNumber));

            return (
              <article className="min-w-0 rounded-[22px] border border-admin-line bg-admin-subsection-muted p-3" key={dayLabel}>
                {/* Card header */}
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <p className="m-0 mb-2 font-bold tracking-[0.08em] text-[#59555f] text-sm">{dayLabel}</p>
                  <button className="inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-admin-line bg-white px-2.5 py-1 text-xs font-base" onClick={() => onAddSlot(Number(dayNumber))} type="button">
                    <PlusIcon />
                    Slot
                  </button>
                </div>

                {/* Selectors */}
                {daySlots.map((slot, index) => (
                  <div className={`mb-1.5 grid min-w-0 grid-cols-[minmax(0,1fr)_auto_auto_30px] items-center gap-2 rounded-full px-3 py-1 text-white max-md:gap-1.5 [&_svg]:h-3.5 [&_svg]:w-3.5 ${toneByShowId.get(slot.show_id) === 'tone-1' ? '!bg-[#fb3438]' : toneByShowId.get(slot.show_id) === 'tone-2' ? '!bg-[#f8b8be] !text-[#362a31]' : toneByShowId.get(slot.show_id) === 'tone-4' ? '!bg-[#a73a33]' : '!bg-[#2f2a30]'}`} key={`slot-${slot.id ?? `${dayLabel}-${index}`} `}>
                    <div className="inline-flex min-w-0 items-center gap-1.5 rounded-full px-2.5">
                      <select
                        className="min-h-[30px] min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-sm font-inherit font-bold text-sm outline-0"
                        value={slot.show_id || ''}
                        onChange={(event) =>
                          onUpdateSlot(slot._slotIndex, 'show_id', event.target.value === '' ? null : Number(event.target.value))
                        }
                      >
                        <option value="">Select show</option>
                        {persistedShowOptions.map((show) => (
                          <option value={show.id} key={`opt-${show.id}`}>
                            {show.name || 'Untitled show'}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon />
                    </div>

                    <label className="inline-flex min-w-0 items-center gap-[5px] font-bold">
                      <ClockIcon />
                        <input className="min-h-[30px] w-fit min-w-max appearance-none border-0 bg-transparent p-0 font-inherit font-bold text-sm outline-0 [&::-webkit-calendar-picker-indicator]:hidden" type="time" value={toTimeInput(slot.start_time)} onChange={(event) => onUpdateSlot(slot._slotIndex, 'start_time', event.target.value)} />
                    </label>

                    <label className="inline-flex min-w-0 items-center gap-[5px] font-bold">
                      <ClockIcon />
                        <input className="min-h-[30px] w-fit min-w-max appearance-none border-0 bg-transparent p-0 font-inherit font-bold text-sm outline-0 [&::-webkit-calendar-picker-indicator]:hidden" type="time" value={toTimeInput(slot.end_time)} onChange={(event) => onUpdateSlot(slot._slotIndex, 'end_time', event.target.value)} />
                    </label>

                    <button className="inline-flex h-[30px] w-[30px] cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-inherit opacity-[0.92] outline-0 transition-opacity hover:opacity-100" onClick={() => onRemoveSlot(slot._slotIndex)} type="button" aria-label="Delete slot">
                      <Trash2 aria-hidden="true" focusable="false" />
                    </button>

                  </div>
                ))}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ShowsScheduleSection;
