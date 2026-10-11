import { useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';

const statusOrder = ['pending', 'approved', 'spam', 'removed'];
const filterOrder = ['all', ...statusOrder];
const commentButtonClass = 'inline-flex cursor-pointer items-center rounded-full border border-[var(--line)] bg-white px-3 py-[4px] text-xs font-bold text-[#2f2935]';
const activeCommentButtonClass = '!border-admin-red !bg-admin-red !text-white';

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

function formatCommentDate(value) {
  const date = new Date(value);
  const dateParts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
      .formatToParts(date)
      .map(({ type, value: partValue }) => [type, partValue])
  );
  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
    .format(date)
    .replace(':', 'h');

  return `${dateParts.day} ${dateParts.month}, ${dateParts.year} - ${time}`;
}

function ActionIcon({ type }) {
  if (type === 'approve') {
    return (
      <svg className="size-3 shrink-0" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M5 12.5l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === 'spam') {
    return (
      <svg className="size-3 shrink-0" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8.5 8.5l7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return <Trash2 className="size-3 shrink-0" aria-hidden="true" focusable="false" />;
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
    <section className="comments-section mt-4 rounded-[var(--admin-radius)] bg-admin-subsection p-[var(--admin-panel-padding)] max-[1080px]:p-[var(--admin-panel-padding-mobile)]">

      {/* Header */}
      <p className="m-0 text-[length:var(--admin-section-kicker-size)] font-bold uppercase tracking-[0.12em] text-[#7f7784]">Moderation</p>
      <h2 className="m-0 text-[length:var(--admin-section-title-size)] [font-weight:var(--admin-section-title-weight)] tracking-[var(--admin-subsection-title-spacing)]">Comments</h2>
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-3">
        <p className="m-0 min-w-[280px] flex-1 text-xs">Approve, mark as spam or remove visitor comments before they show on the site.</p>
        {/* Filters */}
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Comments status filters">
        {filterOrder.map((filterKey) => (
          <button
            key={filterKey}
            type="button"
            className={`${commentButtonClass} gap-2 ${activeFilter === filterKey ? activeCommentButtonClass : ''}`}
            onClick={() => setActiveFilter(filterKey)}
          >
            <span>{statusLabels[filterKey]}</span>
            <span className={`min-w-5 rounded-full px-1.5 py-0.5 text-center text-xs ${activeFilter === filterKey ? 'bg-[rgba(255,255,255,0.24)]' : 'bg-[rgba(25,18,28,0.1)]'}`}>{counts[filterKey]}</span>
          </button>
        ))}
        </div>
      </div>
      {/* Comments */}
      <div className="grid grid-cols-1 gap-3">
        {filteredComments.map((comment) => {

          {/* Comment */}
          const status = normalizeStatus(comment.status);
          const authorLabel = comment.author_name || 'Anonymous';
          const authorInitial = authorLabel[0]?.toUpperCase() || 'A';

          return (
          <article className="block rounded-[var(--admin-radius)] border border-[var(--line)] bg-[var(--admin-subsection-muted-bg)] p-3" key={`comment-${comment.id}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {/* Icon initial */}
                <span className="inline-flex size-[38px] shrink-0 items-center justify-center rounded-full bg-[#ffe7ea] font-extrabold text-[#cc2f37]" aria-hidden="true">{authorInitial}</span>
                <div>
                  <h3 className="m-0 text-[length:var(--admin-card-title-size)] font-bold text-sm">{authorLabel}</h3>
                  <p className="m-0 text-[#8b8792] text-xs">{formatCommentDate(comment.created_at)}</p>
                  {comment.author_email && (
                    <a className="m-0 text-xs text-admin-red underline" href={`mailto:${comment.author_email}`}>
                      {comment.author_email}
                    </a>
                  )}
                </div>
              </div>
              <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                status === 'approved'
                  ? 'bg-[#e9f6ec] text-[#2e6a40]'
                  : status === 'spam'
                    ? 'bg-[#f4edf8] text-[#684282]'
                    : status === 'removed'
                      ? 'bg-[#ecebed] text-[#55505f]'
                      : 'bg-[#ece8ed] text-[#443f49]'
              }`}>{statusLabels[status]}</span>
            </div>
            <p className="m-0 mt-3 text-[length:var(--admin-field-text-size)] text-[#1d1821]">{comment.body}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                className={`${commentButtonClass} gap-2 ${status === 'approved' ? activeCommentButtonClass : ''}`}
                type="button"
                onClick={() => onSetCommentStatus(comment.id, 'approved')}
              >
                <ActionIcon type="approve" />
                Approve
              </button>
              <button className={`${commentButtonClass} gap-2 ${status === 'spam' ? activeCommentButtonClass : ''}`} type="button" onClick={() => onSetCommentStatus(comment.id, 'spam')}>
                <ActionIcon type="spam" />
                Spam
              </button>
              <button className={`${commentButtonClass} gap-2 ${status === 'removed' ? activeCommentButtonClass : ''}`} type="button" onClick={() => onSetCommentStatus(comment.id, 'removed')}>
                <ActionIcon type="remove" />
                Remove
              </button>
            </div>
          </article>
          );
        })}

        {filteredComments.length === 0 && <p className="m-0 mt-2 font-semibold text-[#797281]">No comments in this state.</p>}
      </div>
    </section>
  );
}

export default CommentsSection;
