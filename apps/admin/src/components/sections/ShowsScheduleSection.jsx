// Combined editor for program shows and weekly schedule slots.
// Lets admins edit show metadata and assign day/time programming.
// Supports cover upload and per-slot day/show/time adjustments.
import { Trash2 } from 'lucide-react';
import { dayLabels } from '../../constants/adminUi';
import { isDbId, toTimeInput } from '../../utils/adminHelpers';

const toneOrder = ['tone-1', 'tone-2', 'tone-3', 'tone-4'];

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8v4l2.8 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
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
    <section className="two-cols shows-schedule-section">
      <div className="column-card shows-column-card">
        <div className="section-head">
          <h2>Shows</h2>
          <button className="chip icon-chip" onClick={onAddShow} type="button">
            <PlusIcon />
            Add
          </button>
        </div>
        <div className="show-list">
          {shows.map((show, i) => (
            <article className={`show-card tone-${(i % 4) + 1}`} key={`show-${show.id ?? i}`}>
              <div className="show-top">
                <label className={`show-cover-upload ${show.cover_url ? 'has-image' : ''}`}>
                  {show.cover_url ? <img alt={show.name || 'Show cover'} className="show-cover" src={show.cover_url} /> : <div className="show-cover show-cover-fallback" />}
                  <span className="show-cover-cta">
                    <UploadIcon />
                    {show.cover_url ? 'Change' : 'Upload'}
                  </span>
                  <input
                    className="show-cover-file-input"
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
                <div className="show-title-wrap">
                  <input className="show-title-input" placeholder="Show name" value={show.name || ''} onChange={(event) => onUpdateShow(i, 'name', event.target.value)} />
                  <input className="show-slug-input" placeholder="dj-or-slug" value={show.slug || ''} onChange={(event) => onUpdateShow(i, 'slug', event.target.value)} />
                </div>
                <button className="slot-icon-btn" onClick={() => onRemoveShow(i)} type="button" aria-label="Delete show">
                  <Trash2 aria-hidden="true" focusable="false" />
                </button>
              </div>

              <textarea
                className="show-description"
                placeholder="Description"
                value={show.description || ''}
                onChange={(event) => onUpdateShow(i, 'description', event.target.value)}
              />

              <div className="show-bottom-row">
                <span className="show-char-count">{(show.description || '').length}/280</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="column-card schedule-column-card">
        <div className="section-head">
          <h2>Weekly schedule</h2>

        </div>
        <div className="schedule-list">
          {Object.entries(dayLabels).map(([dayNumber, dayLabel]) => {
            const daySlots = slots
              .map((slot, slotIndex) => ({ ...slot, _slotIndex: slotIndex }))
              .filter((slot) => Number(slot.day_of_week) === Number(dayNumber));

            return (
              <article className="day-card" key={dayLabel}>
                <div className="day-head">
                  <p className="day-title">{dayLabel}</p>
                  <button className="chip day-add-btn" onClick={() => onAddSlot(Number(dayNumber))} type="button">
                    <PlusIcon />
                    Slot
                  </button>
                </div>
                {daySlots.map((slot, index) => (
                  <div className={`slot slot-edit ${toneByShowId.get(slot.show_id) || 'tone-3'}`} key={`slot-${slot.id ?? `${dayLabel}-${index}`}`}>
                    <div className="slot-show-picker">
                      <select
                        className="slot-show-select"
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

                    <label className="slot-time-wrap">
                      <ClockIcon />
                      <input type="time" value={toTimeInput(slot.start_time)} onChange={(event) => onUpdateSlot(slot._slotIndex, 'start_time', event.target.value)} />
                    </label>

                    <label className="slot-time-wrap">
                      <ClockIcon />
                      <input type="time" value={toTimeInput(slot.end_time)} onChange={(event) => onUpdateSlot(slot._slotIndex, 'end_time', event.target.value)} />
                    </label>

                    <button className="slot-icon-btn" onClick={() => onRemoveSlot(slot._slotIndex)} type="button" aria-label="Delete slot">
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
