// Confirmation shown before pushing local edits live.
// Cancelling reloads the page to discard the unsaved draft.
import ConfirmPopup from './ConfirmPopup';

function PublishConfirmPopup({ open, onCancel, onConfirm }) {
  return (
    <ConfirmPopup
      open={open}
      title="Publish changes?"
      description={
        <>
          This will push your edits live to <b>b-side-radio.com</b>. Cancel to discard your local changes and reload the page.
        </>
      }
      cancelLabel="Cancel"
      confirmLabel="Confirm publish"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}

export default PublishConfirmPopup;
