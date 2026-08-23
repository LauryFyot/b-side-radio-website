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
    <div className="mt-[18px] flex min-w-0 flex-nowrap gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => (
        <button key={tab.id} className={`inline-flex shrink-0 cursor-pointer items-center gap-2.5 rounded-full border border-admin-line bg-white px-[13px] py-2 font-medium text-sm ${activeTab === tab.id ? '!border-admin-red !bg-admin-red !text-white' : ''}`} onClick={() => onTabChange(tab.id)}>
          {(() => {
            const Icon = tabIcons[tab.id];
            return Icon ? <Icon aria-hidden="true" size={16} strokeWidth={2} /> : null;
          })()}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default AdminTabs;
