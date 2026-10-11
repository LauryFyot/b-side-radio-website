// Read-only preview of highlighted mix sessions.
function FeaturedMixSessionsSection({ mixSessions }) {
  return (
    <section>
      <h2>Mix sessions preview</h2>
      <div className="track-grid">
        {mixSessions.map((mixSession) => (
          <article key={`${mixSession.id}-${mixSession.title}`} className="track-card">
            <div className="cover" />
            <div>
              <h3>{mixSession.title || 'Untitled mix session'}</h3>
              <p>{mixSession.mp3_url || 'No mp3 url'}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FeaturedMixSessionsSection;