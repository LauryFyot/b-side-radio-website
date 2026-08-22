import { useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';

const statusOrder = ['pending', 'approved', 'spam', 'removed'];

const statusLabels = {
  pending: 'Pending',
  approved: 'Approved',
  spam: 'Spam',
  removed: 'Removed',
  all: 'All'
};

function normalizeStatus(status) {
  if (status === 'rejected') {
    return 'removed';
  }
  if (statusOrder.includes(status)) {
    return status;
  }
  return 'pending';
}

function ActionIcon({ type }) {
  if (type === 'approve') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M5 12.5l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === 'spam') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8.5 8.5l7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return <Trash2 aria-hidden="true" focusable="false" />;
}

// Moderation panel for user comments.
// Shows current status and creation metadata for each comment.
// Lets admins stage status changes before publish persists them.
function CommentsSection({ comments, onSetCommentStatus }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const counts = useMemo(() => {
    const result = { pending: 0, approved: 0, spam: 0, removed: 0, all: comments.length };
    for (const comment of comments) {
      const normalized = normalizeStatus(comment.status);
      result[normalized] += 1;
    }
    return result;
  }, [comments]);

  const filteredComments = useMemo(() => {
    if (activeFilter === 'all') {
      return comments;
    }

    return comments.filter((comment) => normalizeStatus(comment.status) === activeFilter);
  }, [comments, activeFilter]);

  return (
    <section className="comments-section">
      <p className="comments-kicker">Moderation</p>
      <h2>Comments</h2>

      <div className="comments-filters" role="tablist" aria-label="Comments status filters">
        {[...statusOrder, 'all'].map((filterKey) => (
          <button
            key={filterKey}
            type="button"
            className={`comment-filter ${activeFilter === filterKey ? 'is-active' : ''}`}
            onClick={() => setActiveFilter(filterKey)}
          >
            <span>{statusLabels[filterKey]}</span>
            <span className="filter-count">{counts[filterKey]}</span>
          </button>
        ))}
      </div>

      <div className="comment-list">
        {filteredComments.map((comment) => {
          const status = normalizeStatus(comment.status);
          const authorLabel = comment.author_name || 'Anonymous';
          const authorInitial = authorLabel[0]?.toUpperCase() || 'A';

          return (
          <article className="comment-card" key={`comment-${comment.id}`}>
            <div className="comment-head">
              <div className="comment-author-wrap">
                <span className="comment-avatar" aria-hidden="true">
                  {authorInitial}
                </span>
                <div>
                  <h3>{authorLabel}</h3>
                  <p className="comment-context">{new Date(comment.created_at).toLocaleString()}</p>
                </div>
              </div>
              <span className={`status status-${status}`}>{statusLabels[status]}</span>
            </div>
            <p className="comment-body">{comment.body}</p>
            <div className="comment-actions">
              <button
                className={`approve-btn ${status === 'approved' ? 'is-active' : ''}`}
                type="button"
                onClick={() => onSetCommentStatus(comment.id, 'approved')}
              >
                <ActionIcon type="approve" />
                Approve
              </button>
              <button className={status === 'spam' ? 'is-active' : ''} type="button" onClick={() => onSetCommentStatus(comment.id, 'spam')}>
                <ActionIcon type="spam" />
                Spam
              </button>
              <button className={status === 'removed' ? 'is-active' : ''} type="button" onClick={() => onSetCommentStatus(comment.id, 'removed')}>
                <ActionIcon type="remove" />
                Remove
              </button>
            </div>
          </article>
          );
        })}

        {filteredComments.length === 0 && <p className="comments-empty">No comments in this state.</p>}
      </div>
    </section>
  );
}

export default CommentsSection;
