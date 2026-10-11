// Top header of the admin workspace.
// Holds quick search UI and user identity badge.
// Keeps the shell consistent across every editable tab.
function AdminHeader({ adminUser }) {
  return (
    <header className="flex h-[74px] items-center justify-between gap-4 border-b border-admin-line bg-[rgba(250,248,250,0.92)] px-5">
      <input className="h-[43px] w-full max-w-[470px] rounded-full border border-admin-line bg-white px-4 text-sm" placeholder="Search tracks, shows, listeners..." />
      <div className="flex items-center gap-2">
        <button className="cursor-pointer rounded-full border border-admin-red bg-admin-red px-[13px] py-2 font-bold text-white text-sm">Welcome {(adminUser?.email || 'Admin')}</button>
        <button className="cursor-pointer rounded-full border border-[#ffc9cd] bg-white px-[13px] py-2 font-bold text-admin-red">{(adminUser?.email || 'AD').slice(0, 2).toUpperCase()}</button>
      </div>
    </header>
  );
}

export default AdminHeader;
