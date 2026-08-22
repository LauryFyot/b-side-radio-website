// Left navigation panel for admin tools.
// Also displays now-playing radio metadata fetched from the stream API.
// Polls periodically to keep song title, artist, and live state updated.
import { useEffect, useState } from 'react';
import { BarChart3, LayoutDashboard, LogOut, Music2, Radio, Settings } from 'lucide-react';
import { fetchNowPlayingInfo } from '../lib/radioStreamApi';

function AdminSidebar({ onLogout }) {
  const [nowPlaying, setNowPlaying] = useState({
    title: 'Loading now playing...',
    artist: '',
    isLive: false
  });

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
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-icon" aria-hidden="true">
          <Music2 size={22} strokeWidth={2.4} />
        </span>
        <span>B-Side</span>
      </div>
      <div className="side-group">
        <p className="side-label">GENERAL</p>
        <button className="side-link">
          <LayoutDashboard aria-hidden="true" size={20} />
          <span>Dashboard</span>
        </button>
        <button className="side-link active">
          <Radio aria-hidden="true" size={20} />
          <span>Website edition</span>
        </button>
        <button className="side-link">
          <BarChart3 aria-hidden="true" size={20} />
          <span>Radio stats</span>
        </button>
      </div>
      <div className="side-group">
        <p className="side-label">TOOLS</p>
        <button className="side-link">
          <Settings aria-hidden="true" size={20} />
          <span>Settings</span>
        </button>
        <button className="side-link" onClick={onLogout}>
          <LogOut aria-hidden="true" size={20} />
          <span>Log out</span>
        </button>
      </div>
      <div className="onair-card">
        <p className="onair-label">ON AIR</p>
        <p className="onair-title">{nowPlaying.title}</p>
        {nowPlaying.artist && <p className="onair-artist">{nowPlaying.artist}</p>}
        <p className="onair-live">{nowPlaying.isLive ? 'Live now' : 'Auto DJ'}</p>
      </div>
    </aside>
  );
}

export default AdminSidebar;
