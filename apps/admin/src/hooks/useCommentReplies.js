import { useEffect, useState } from 'react';
import { deleteCommentReply, fetchCommentReplyContext, saveCommentReply } from '../lib/adminRepository';

export default function useCommentReplies(userId, comments) {
  const [context, setContext] = useState(null);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  const idsKey = comments.map((comment) => comment.id).join(',');

  useEffect(() => {
    let cancelled = false;
    setContext(null);
    setError('');
    if (!userId) return;
    fetchCommentReplyContext(idsKey ? idsKey.split(',') : [])
      .then((next) => { if (!cancelled) setContext(next); })
      .catch((failure) => { if (!cancelled) setError(failure.message || 'Unable to load replies.'); });
    return () => { cancelled = true; };
  }, [userId, idsKey, refresh]);

  async function save(commentId, replyId, body) {
    const reply = await saveCommentReply({ commentId, replyId, body });
    setContext((current) => current && ({
      ...current,
      replies: [...current.replies.filter((entry) => entry.id !== reply.id), reply]
        .sort((first, second) => first.created_at.localeCompare(second.created_at))
    }));
  }

  async function remove(replyId) {
    await deleteCommentReply(replyId);
    setContext((current) => current && ({ ...current, replies: current.replies.filter((reply) => reply.id !== replyId) }));
  }

  return { context, error, reload: () => setRefresh((value) => value + 1), save, remove };
}