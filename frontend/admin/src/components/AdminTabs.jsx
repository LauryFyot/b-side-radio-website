// Horizontal tab switcher for admin sections.
// Receives tab definitions and current active id from parent state.
// Emits selected tab id back to the parent on click.
function AdminTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="tabs-row">
      {tabs.map((tab) => (
        <button key={tab.id} className={`tab-pill ${activeTab === tab.id ? 'is-active' : ''}`} onClick={() => onTabChange(tab.id)}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default AdminTabs;
