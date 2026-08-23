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
    <svg className="size-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 3h11l3 3v15H5z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8 3v6h8V3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8 17h8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="animate-spin">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <path d="M12 4a8 8 0 0 1 8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function AdminContent({ activeTab, onTabChange, tabs, isPublishing, hasPendingChanges, onPublish, message, editor }) {

  return (
    <section className="h-[calc(100vh-36px-74px)] overflow-auto p-5 max-[1080px]:h-auto max-[1080px]:max-h-none">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="m-0 font-['Space_Grotesk'] font-bold text-[clamp(32px,3vw,56px)] tracking-[-0.03em]">Website edition</h1>
          <p className="mb-0 text-admin-muted text-xs">Curate what plays on <b>b-side-radio.com</b> this week.</p>
        </div>
        <button
          className={`inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-full border px-4 py-[10px] font-['Space_Grotesk'] text-sm font-bold leading-none transition ${hasPendingChanges ? 'border-admin-red bg-admin-red text-white shadow-[0_0_0_4px_rgba(234,35,40,0.16)] hover:bg-[#d81f25] hover:border-[#d81f25]' : 'cursor-not-allowed border-[#ddd6df] bg-[#f2eef3] text-[#6b6573]'} ${isPublishing ? 'cursor-progress border-[#d72026] bg-[#d72026] text-white shadow-[0_0_0_4px_rgba(234,35,40,0.22)]' : ''}`}
          onClick={onPublish}
          disabled={isPublishing || !hasPendingChanges}
          type="button"
        >
          {isPublishing ? <SpinnerIcon /> : <PublishIcon />}
          {isPublishing ? 'Publishing...' : hasPendingChanges ? 'Publish changes' : 'Published'}
        </button>
      </div>

      {message && <p className="mb-0 mt-2.5 text-[#3f3a45]">{message}</p>}

      <AdminTabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />

      {/*mt-4 rounded-[var(--admin-radius)] bg-admin-subsection p-[var(--admin-panel-padding)] max-[1080px]:p-[var(--admin-panel-padding-mobile)]*/}
      <div className="mt-4">
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
