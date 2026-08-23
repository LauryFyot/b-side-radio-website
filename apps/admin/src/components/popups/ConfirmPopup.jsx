// Generic confirmation modal reused by every popup that needs a yes/no choice.
// Renders nothing when `open` is false so callers can mount it unconditionally.
function ConfirmPopup({ open, title, description, cancelLabel = 'Cancel', confirmLabel = 'Confirm', variant = 'danger', onCancel, onConfirm }) {
  if (!open) {
    return null;
  }

  const confirmButtonClass =
    variant === 'neutral'
      ? 'border-admin-ink bg-admin-ink text-white'
      : 'border-admin-red bg-admin-red text-white';

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-[420px] rounded-[var(--admin-radius)] bg-white p-6">
        <h2 className="m-0 font-['Space_Grotesk'] text-lg font-bold text-admin-ink">{title}</h2>
        {description && <p className="mb-0 mt-2 text-sm text-admin-muted">{description}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button
            className="inline-flex cursor-pointer items-center rounded-full border border-[#ddd6df] bg-white px-4 py-2 text-sm font-bold text-[#433d4a]"
            onClick={onCancel}
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            className={`inline-flex cursor-pointer items-center rounded-full border px-4 py-2 text-sm font-bold ${confirmButtonClass}`}
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmPopup;
