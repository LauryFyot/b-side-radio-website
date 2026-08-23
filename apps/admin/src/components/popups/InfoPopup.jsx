// Dismissible status popup for success/error feedback after an async action.
function InfoPopup({ open, variant = 'success', title, description, onClose }) {
  if (!open) {
    return null;
  }

  const isError = variant === 'error';

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-[420px] rounded-[var(--admin-radius)] bg-white p-6">
        <h2 className={`m-0 font-['Space_Grotesk'] text-lg font-bold ${isError ? 'text-admin-red' : 'text-[#2e6a40]'}`}>{title}</h2>
        {description && <p className="mb-0 mt-2 text-sm text-admin-muted">{description}</p>}
        <div className="mt-5 flex justify-end">
          <button
            className={`inline-flex cursor-pointer items-center rounded-full border px-4 py-2 text-sm font-bold text-white ${isError ? 'border-admin-red bg-admin-red' : 'border-[#2e6a40] bg-[#2e6a40]'}`}
            onClick={onClose}
            type="button"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default InfoPopup;
