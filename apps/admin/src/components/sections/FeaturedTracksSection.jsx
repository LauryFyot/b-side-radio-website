// Read-only preview of highlighted tracks.
// Uses favorite mixes as source data and shows the first items.
// Kept as a simple display component without editing controls.
function FeaturedTracksSection({ featuredTracks }) {
  return (
    <section>
      <h2>Highlighted tracks (auto from favorite mixes)</h2>
      <div className="track-grid">
        {featuredTracks.map((track) => (
          <article key={`${track.id}-${track.title}`} className="track-card">
            <div className="cover" />
            <div>
              <h3>{track.title || 'Untitled track'}</h3>
              <p>{track.mp3_url || 'No mp3 url'}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FeaturedTracksSection;
