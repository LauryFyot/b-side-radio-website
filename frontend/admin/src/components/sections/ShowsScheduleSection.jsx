// Combined editor for program shows and weekly schedule slots.
// Lets admins edit show metadata and assign day/time programming.
// Supports cover upload and per-slot day/show/time adjustments.
import { dayLabels } from '../../constants/adminUi';
import { isDbId, toTimeInput } from '../../utils/adminHelpers';

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
  return (
    <section className="two-cols">
      <div>
        <div className="section-head">
          <h2>Shows</h2>
          <button className="chip" onClick={onAddShow}>
            + Add
          </button>
        </div>
        <div className="show-list">
          {shows.map((show, i) => (
            <article className={`show-card tone-${(i % 4) + 1}`} key={`show-${show.id ?? i}`}>
              <input className="editor-input" placeholder="Show name" value={show.name || ''} onChange={(event) => onUpdateShow(i, 'name', event.target.value)} />
              <input className="editor-input" placeholder="Slug" value={show.slug || ''} onChange={(event) => onUpdateShow(i, 'slug', event.target.value)} />
              <textarea
                className="editor-textarea"
                placeholder="Description"
                value={show.description || ''}
                onChange={(event) => onUpdateShow(i, 'description', event.target.value)}
              />
              <input
                className="editor-input"
                placeholder="Cover URL"
                value={show.cover_url || ''}
                onChange={(event) => onUpdateShow(i, 'cover_url', event.target.value)}
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
                    await onUploadShowCover(i, file);
                  } catch (error) {
                    console.error(error);
                  }
                  event.target.value = '';
                }}
              />
              {show.cover_url ? <img alt={show.name || 'Show cover'} className="cover-preview" src={show.cover_url} /> : <p className="hint">No cover selected yet.</p>}
              <button className="upload-btn" onClick={() => onRemoveShow(i)}>
                Delete show
              </button>
            </article>
          ))}
        </div>
      </div>

      <div>
        <div className="section-head">
          <h2>Weekly schedule</h2>
          <button className="chip" onClick={onAddSlot}>
            + Slot
          </button>
        </div>
        <div className="schedule-list">
          {Object.entries(dayLabels).map(([dayNumber, dayLabel]) => {
            const daySlots = slots
              .map((slot, slotIndex) => ({ ...slot, _slotIndex: slotIndex }))
              .filter((slot) => Number(slot.day_of_week) === Number(dayNumber));

            return (
              <article className="day-card" key={dayLabel}>
                <p className="day-title">{dayLabel}</p>
                {daySlots.map((slot, index) => (
                  <div className="slot slot-edit" key={`slot-${slot.id ?? `${dayLabel}-${index}`}`}>
                    <select
                      value={slot.show_id || ''}
                      onChange={(event) =>
                        onUpdateSlot(slot._slotIndex, 'show_id', event.target.value === '' ? null : Number(event.target.value))
                      }
                    >
                      <option value="">Select show</option>
                      {shows
                        .filter((show) => isDbId(show.id))
                        .map((show) => (
                          <option value={show.id} key={`opt-${show.id}`}>
                            {show.name || 'Untitled show'}
                          </option>
                        ))}
                    </select>
                    <select value={Number(slot.day_of_week) || 1} onChange={(event) => onUpdateSlot(slot._slotIndex, 'day_of_week', Number(event.target.value))}>
                      {Object.entries(dayLabels).map(([dayNumber, label]) => (
                        <option key={`${slot.id ?? slot._slotIndex}-${dayNumber}`} value={dayNumber}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <input type="time" value={toTimeInput(slot.start_time)} onChange={(event) => onUpdateSlot(slot._slotIndex, 'start_time', event.target.value)} />
                    <input type="time" value={toTimeInput(slot.end_time)} onChange={(event) => onUpdateSlot(slot._slotIndex, 'end_time', event.target.value)} />
                    <button className="ghost" onClick={() => onRemoveSlot(slot._slotIndex)}>
                      🗑
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
