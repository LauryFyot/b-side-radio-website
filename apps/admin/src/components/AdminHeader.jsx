// Top header of the admin workspace.
// Holds quick search UI and user identity badge.
// Keeps the shell consistent across every editable tab.
function AdminHeader({ adminUser }) {
  return (
    <header className="topbar">
      <input className="search" placeholder="Search tracks, shows, listeners..." />
      <div className="top-actions">
        <button className="chip chip-alert">Welcome {(adminUser?.email || 'Admin')}</button>
        <button className="avatar">{(adminUser?.email || 'AD').slice(0, 2).toUpperCase()}</button>
      </div>
    </header>
  );
}

export default AdminHeader;
