import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';

function ScrollingBannerSection({ messages, onChange }) {
  if (!Array.isArray(messages)) {
    return <p role="status">Scrolling banner unavailable. Run supabase/scrolling-banner-migration.sql, then reload.</p>;
  }

  function update(index, language, value) {
    onChange(messages.map((message, position) => position === index ? { ...message, [language]: value } : message));
  }

  function move(index, direction) {
    const next = [...messages];
    const destination = index + direction;
    [next[index], next[destination]] = [next[destination], next[index]];
    onChange(next);
  }

  const fieldClass = 'w-full rounded-md border border-admin-line bg-white px-3 py-2 text-sm outline-none focus:border-admin-red';

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="m-0 font-['Space_Grotesk'] text-xl font-bold">Scrolling banner</h2>
        <button type="button" className="inline-flex items-center gap-2 rounded-md border border-admin-line bg-white px-3 py-2 text-sm" onClick={() => onChange([...messages, { fr: '', en: '' }])}>
          <Plus size={16} aria-hidden="true" /> Add message
        </button>
      </div>
      {messages.length === 0 && <p className="text-sm text-admin-muted" role="status">No messages</p>}
      <div className="divide-y divide-admin-line">
        {messages.map((message, index) => (
          <div key={index} className="grid grid-cols-1 items-start gap-3 py-4 md:grid-cols-[24px_minmax(0,1fr)_minmax(0,1fr)_auto]">
            <span className="pt-2 text-sm text-admin-muted">{index + 1}</span>
            <label className="grid min-w-0 gap-1 text-xs font-bold">French
              <input className={fieldClass} value={message.fr} onChange={(event) => update(index, 'fr', event.target.value)} aria-label={`French message ${index + 1}`} />
            </label>
            <label className="grid min-w-0 gap-1 text-xs font-bold">English
              <input className={fieldClass} value={message.en} onChange={(event) => update(index, 'en', event.target.value)} aria-label={`English message ${index + 1}`} />
            </label>
            <div className="flex gap-1 md:pt-5">
              <button className="grid size-9 place-items-center rounded-md border border-admin-line bg-white disabled:opacity-30" type="button" disabled={index === 0} onClick={() => move(index, -1)} title="Move up" aria-label={`Move message ${index + 1} up`}><ArrowUp size={16} /></button>
              <button className="grid size-9 place-items-center rounded-md border border-admin-line bg-white disabled:opacity-30" type="button" disabled={index === messages.length - 1} onClick={() => move(index, 1)} title="Move down" aria-label={`Move message ${index + 1} down`}><ArrowDown size={16} /></button>
              <button className="grid size-9 place-items-center rounded-md border border-admin-line bg-white text-admin-red" type="button" onClick={() => onChange(messages.filter((_, position) => position !== index))} title="Delete message" aria-label={`Delete message ${index + 1}`}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ScrollingBannerSection;