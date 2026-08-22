// Horizontal tab switcher for admin sections.
// Receives tab definitions and current active id from parent state.
// Emits selected tab id back to the parent on click.
import { CalendarDays, Disc3, MessageSquare, Music2, Youtube } from 'lucide-react';

const tabIcons = {
  comments: MessageSquare,
  shows: CalendarDays,
  youtube: Youtube,
  mixes: Music2,
  vinyl: Disc3
};

function AdminTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="tabs-row">
      {tabs.map((tab) => (
        <button key={tab.id} className={`tab-pill ${activeTab === tab.id ? 'is-active' : ''}`} onClick={() => onTabChange(tab.id)}>
          {(() => {
            const Icon = tabIcons[tab.id];
            return Icon ? <Icon aria-hidden="true" size={20} strokeWidth={2} /> : null;
          })()}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default AdminTabs;
