import { useState } from 'react';
import { LoaderCircle, MessageSquareReply, Pencil, Save, Trash2, X } from 'lucide-react';

const buttonClass = 'inline-flex min-h-8 items-center justify-center gap-1.5 rounded-full border border-admin-line px-3 py-1 text-xs font-bold disabled:cursor-wait disabled:opacity-50';

export default function CommentReplies({ commentId, controller }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const context = controller.context;
  if (!context) return null;
  const replies = context.replies.filter((reply) => String(reply.comment_id) === String(commentId));
  const ownReply = replies.find((reply) => reply.author_id === context.userId);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await controller.save(commentId, ownReply?.id, draft);
      setEditing(false);
      setDraft('');
    } catch (failure) {
      setError(failure.message || 'Unable to save your reply.');
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    setError('');
    try {
      await controller.remove(ownReply.id);
      setConfirmDelete(false);
      setEditing(false);
      setDraft('');
    } catch (failure) {
      setError(failure.message || 'Unable to delete your reply.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 border-t border-admin-line pt-3">
      {replies.length > 0 && <ul className="m-0 list-none space-y-3 p-0">
        {replies.map((reply) => (
          <li key={reply.id} className="border-l-2 border-admin-red pl-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <strong>{reply.author_name}</strong>
              <span className="font-bold text-admin-red">Team</span>
              <time dateTime={reply.created_at}>{new Date(reply.created_at).toLocaleString()}</time>
              {reply.updated_at !== reply.created_at && <span className="text-admin-muted">Edited</span>}
              {context.canReply && reply.author_id === context.userId && !editing && <>
                <button type="button" className={buttonClass} title="Edit your reply" aria-label="Edit your reply" disabled={busy} onClick={() => { setDraft(reply.body); setEditing(true); setError(''); setConfirmDelete(false); }}><Pencil className="size-3.5" aria-hidden="true" /></button>
                <button type="button" className={buttonClass} title="Delete your reply" aria-label="Delete your reply" disabled={busy} onClick={() => { setConfirmDelete(true); setError(''); }}><Trash2 className="size-3.5" aria-hidden="true" /></button>
              </>}
            </div>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm">{reply.body}</p>
          </li>
        ))}
      </ul>}

      {confirmDelete && <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Confirm reply deletion">
        <span className="text-sm">Delete your reply?</span>
        <button type="button" className={buttonClass} disabled={busy} onClick={remove}><Trash2 className="size-3.5" aria-hidden="true" />Delete</button>
        <button type="button" className={buttonClass} disabled={busy} onClick={() => setConfirmDelete(false)}>Cancel</button>
      </div>}

      {context.canReply && !ownReply && !editing && <button type="button" className={`${buttonClass} mt-2`} disabled={!context.displayName} onClick={() => { setEditing(true); setDraft(''); setError(''); }}>
        <MessageSquareReply className="size-3.5" aria-hidden="true" />Reply
      </button>}
      {context.canReply && !context.displayName && <p className="mt-2 text-xs text-admin-red">Set your public display name in your Supabase profile before replying.</p>}

      {editing && <form onSubmit={submit} className="mt-3 space-y-2">
        <label className="block text-xs font-bold">
          Reply as {ownReply?.author_name || context.displayName}
          <textarea className="mt-1 block w-full resize-y rounded-lg border border-admin-line bg-white p-3 text-sm font-normal" rows={3} maxLength={1000} required value={draft} disabled={busy} onChange={(event) => setDraft(event.target.value)} />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <button type="submit" className={buttonClass} disabled={busy || !draft.trim()}>{busy ? <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" /> : <Save className="size-3.5" aria-hidden="true" />}Save reply</button>
          <button type="button" className={buttonClass} disabled={busy} onClick={() => { setEditing(false); setDraft(''); setError(''); }}><X className="size-3.5" aria-hidden="true" />Cancel</button>
          <span className="text-xs text-admin-muted">{draft.length}/1000</span>
        </div>
      </form>}
      {error && <p role="alert" className="mt-2 text-sm text-admin-red">{error}</p>}
    </div>
  );
}