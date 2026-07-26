// Main content area of the admin page.
// Renders tabs, publish controls, and the active editable section.
// Delegates all mutations to handlers provided by the editor hook.
import AdminTabs from './AdminTabs';
import ShowsScheduleSection from './sections/ShowsScheduleSection';
import YoutubeSection from './sections/YoutubeSection';
import MixesSection from './sections/MixesSection';
import VinylSection from './sections/VinylSection';
import CommentsSection from './sections/CommentsSection';

function AdminContent({ activeTab, onTabChange, tabs, isPublishing, onPublish, message, editor }) {
  return (
    <section className="content-scroll">
      <div className="title-row">
        <div>
          <h1>Website edition</h1>
          <p>Curate what plays on b-side-radio.com this week.</p>
        </div>
        <button className="publish-btn" onClick={onPublish} disabled={isPublishing}>
          {isPublishing ? 'Publishing...' : 'Publish'}
        </button>
      </div>

      {message && <p className="publish-message">{message}</p>}

      <AdminTabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />

      <div className="panel">
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
