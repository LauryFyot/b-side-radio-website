// Main content area of the admin page.
// Renders tabs, publish controls, and the active editable section.
// Delegates all mutations to handlers provided by the editor hook.
import AdminTabs from './AdminTabs';
import ShowsScheduleSection from './sections/ShowsScheduleSection';
import YoutubeSection from './sections/YoutubeSection';
import MixesSection from './sections/MixesSection';
import VinylSection from './sections/VinylSection';
import CommentsSection from './sections/CommentsSection';

function PublishIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 3h11l3 3v15H5z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8 3v6h8V3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8 17h8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="spin-icon">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <path d="M12 4a8 8 0 0 1 8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function AdminContent({ activeTab, onTabChange, tabs, isPublishing, hasPendingChanges, onPublish, message, editor }) {
  const hasInternalFrame = activeTab === 'shows' || activeTab === 'mixes' || activeTab === 'vinyl';

  return (
    <section className="content-scroll">
      <div className="title-row">
        <div>
          <h1>Website edition</h1>
          <p>Curate what plays on b-side-radio.com this week.</p>
        </div>
        <button
          className={`publish-btn ${hasPendingChanges ? 'has-pending' : 'is-clean'} ${isPublishing ? 'is-publishing' : ''}`}
          onClick={onPublish}
          disabled={isPublishing || !hasPendingChanges}
          type="button"
        >
          {isPublishing ? <SpinnerIcon /> : <PublishIcon />}
          {isPublishing ? 'Publishing...' : hasPendingChanges ? 'Publish changes' : 'Published'}
        </button>
      </div>

      {message && <p className="publish-message">{message}</p>}

      <AdminTabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />

      <div className={`panel ${hasInternalFrame ? 'panel-frame-off' : ''}`}>
        {activeTab === 'shows' && (
          <ShowsScheduleSection
            shows={editor.shows}
            slots={editor.slots}
            onAddShow={editor.addShow}
            onAddSlot={editor.addSlot}
            onUpdateShow={editor.updateShow}
            onUploadShowCover={editor.uploadShowCover}
            onRemoveShow={editor.removeShow}
            onUpdateSlot={editor.updateSlot}
            onRemoveSlot={editor.removeSlot}
          />
        )}

        {activeTab === 'youtube' && (
          <YoutubeSection
            videos={editor.videos}
            onAddVideo={editor.addVideo}
            onUpdateVideo={editor.updateVideo}
            onRemoveVideo={editor.removeVideo}
          />
        )}

        {activeTab === 'mixes' && (
          <MixesSection
            tracks={editor.tracks}
            onAddTrack={editor.addTrack}
            onUpdateTrack={editor.updateTrack}
            onUploadTrackMp3={editor.uploadTrackMp3}
            onRemoveTrack={editor.removeTrack}
          />
        )}

        {activeTab === 'vinyl' && (
          <VinylSection
            covers={editor.covers}
            onAddCover={editor.addCover}
            onUpdateCover={editor.updateCover}
            onUploadCoverImage={editor.uploadCoverImage}
            onRemoveCover={editor.removeCover}
          />
        )}

        {activeTab === 'comments' && <CommentsSection comments={editor.comments} onSetCommentStatus={editor.setCommentStatus} />}
      </div>
    </section>
  );
}

export default AdminContent;
