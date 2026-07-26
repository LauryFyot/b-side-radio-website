// Moderation panel for user comments.
// Shows current status and creation metadata for each comment.
// Lets admins stage status changes before publish persists them.
function CommentsSection({ comments, onSetCommentStatus }) {
  return (
    <section>
      <h2>Comments moderation</h2>
      <div className="comment-list">
        {comments.map((comment) => (
          <article className="comment-card" key={`comment-${comment.id}`}>
            <div className="comment-head">
              <h3>{comment.author_name}</h3>
              <span className="status">{comment.status}</span>
            </div>
            <p className="comment-context">{new Date(comment.created_at).toLocaleString()}</p>
            <p>{comment.body}</p>
            <div className="comment-actions">
              <button className="approve-btn" onClick={() => onSetCommentStatus(comment.id, 'approved')}>Approve</button>
              <button onClick={() => onSetCommentStatus(comment.id, 'spam')}>Spam</button>
              <button onClick={() => onSetCommentStatus(comment.id, 'rejected')}>Reject</button>
              <button onClick={() => onSetCommentStatus(comment.id, 'removed')}>Remove</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CommentsSection;
