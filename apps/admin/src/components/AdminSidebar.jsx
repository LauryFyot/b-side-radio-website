// Left navigation panel for admin tools.
// Also displays now-playing radio metadata fetched from the stream API.
// Polls periodically to keep song title, artist, and live state updated.
import { useEffect, useState } from 'react';
import { BarChart3, LayoutDashboard, LogOut, Music2, Radio, Settings } from 'lucide-react';
import { fetchNowPlayingInfo } from '../lib/radioStreamApi';
import ConfirmPopup from './popups/ConfirmPopup';

function AdminSidebar({ onLogout }) {
  const [nowPlaying, setNowPlaying] = useState({
    title: 'Loading now playing...',
    artist: '',
    isLive: false
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchNowPlaying() {
      try {
        const info = await fetchNowPlayingInfo();

        if (!cancelled) {
          setNowPlaying({
            title: info.title,
            artist: info.artist,
            isLive: info.isLive
          });
        }
      } catch (error) {
        if (!cancelled) {
          setNowPlaying({
            title: 'Now playing unavailable',
            artist: '',
            isLive: false
          });
        }
      }
    }

    fetchNowPlaying();
    const intervalId = setInterval(fetchNowPlaying, 20000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <aside className="m-3 flex flex-col gap-5 rounded-[var(--admin-shell-radius)] bg-admin-sidebar p-[22px_16px] text-white max-[1080px]:border-b max-[1080px]:border-[#2e2830]">
      <div className="flex items-center gap-2.5 font-['Space_Grotesk'] text-[34px] font-bold tracking-[-0.03em]">
        <span className="inline-grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full bg-admin-red" aria-hidden="true">
          <Music2 size={22} strokeWidth={2.4} />
        </span>
        <span>B-Side</span>
      </div>
      <div className="flex flex-col gap-2">
        <p className="m-0 text-[11px] tracking-[0.12em] text-[#8f8990]">GENERAL</p>
        <button className="flex items-center gap-3 rounded-full border-0 bg-transparent px-3 py-2 text-left text-sm text-[#d6d1d7] hover:bg-[#221c20] hover:text-white [&>svg]:shrink-0 [&>svg]:text-[#aaa3ad]">
          <LayoutDashboard aria-hidden="true" size={20} />
          <span>Dashboard</span>
        </button>
        <button className="flex items-center gap-3 rounded-full border-0 bg-[#221c20] px-3 py-2 text-left text-sm text-white [&>svg]:shrink-0 [&>svg]:text-[#aaa3ad]">
          <Radio aria-hidden="true" size={20} />
          <span>Website edition</span>
        </button>
        <button className="flex items-center gap-3 rounded-full border-0 bg-transparent px-3 py-2 text-left text-sm text-[#d6d1d7] hover:bg-[#221c20] hover:text-white [&>svg]:shrink-0 [&>svg]:text-[#aaa3ad]">
          <BarChart3 aria-hidden="true" size={20} />
          <span>Radio stats</span>
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <p className="m-0 text-[11px] tracking-[0.12em] text-[#8f8990]">TOOLS</p>
        <button className="flex items-center gap-3 rounded-full border-0 bg-transparent px-3 py-2 text-left text-sm text-[#d6d1d7] hover:bg-[#221c20] hover:text-white [&>svg]:shrink-0 [&>svg]:text-[#aaa3ad]">
          <Settings aria-hidden="true" size={20} />
          <span>Settings</span>
        </button>
        <button className="flex items-center gap-3 rounded-full border-0 bg-transparent px-3 py-2 text-left text-sm text-[#d6d1d7] hover:bg-[#221c20] hover:text-white [&>svg]:shrink-0 [&>svg]:text-[#aaa3ad]" onClick={() => setShowLogoutConfirm(true)}>
          <LogOut aria-hidden="true" size={20} />
          <span>Log out</span>
        </button>
      </div>
      <div className="mt-auto rounded-2xl border border-[#2f2830] bg-[#171317] p-3.5">
        <p className="m-0 text-[11px] text-[#8f8990]">ON AIR</p>
        <p className="mb-0 mt-2 font-bold">{nowPlaying.title}</p>
        {nowPlaying.artist && <p className="mb-1 mt-0 text-xs text-[#ada6b2]">{nowPlaying.artist}</p>}
        <p className="m-0 text-[13px] text-[#ff625f]">{nowPlaying.isLive ? 'Live now' : 'Auto DJ'}</p>
      </div>

      <ConfirmPopup
        open={showLogoutConfirm}
        title="Log out?"
        description="You will be signed out of the admin workspace."
        cancelLabel="Cancel"
        confirmLabel="Log out"
        variant="neutral"
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          setShowLogoutConfirm(false);
          onLogout();
        }}
      />
    </aside>
  );
}

export default AdminSidebar;
