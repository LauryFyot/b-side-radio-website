import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { getRadioStreamUrl } from '@/lib/radio';

type Source = { kind: "live" } | { kind: "track"; id: string; title: string; artist: string; src: string };

type PlayerState = {
  source: Source;
  playing: boolean;
  toggleLive: () => void;
  playTrack: (t: { id: string; title: string; artist: string; src: string }) => void;
  isCurrent: (id: string) => boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  setPlaying: (v: boolean) => void;
};

const Ctx = createContext<PlayerState | null>(null);

// Controls the persistent audio element used by the live stream and track previews.
export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [source, setSource] = useState<Source>({ kind: "live" });
  const [playing, setPlaying] = useState(false);

  const play = useCallback(async () => {
    const el = audioRef.current;
    if (!el) return;

    el.src = getRadioStreamUrl();
    el.load();

    try {
      await el.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }, []);

  useEffect(() => {
    void play();

    const onUserGesture = () => {
      void play();
    };

    window.addEventListener("pointerdown", onUserGesture, { once: true });
    window.addEventListener("touchstart", onUserGesture, { once: true });
    window.addEventListener("keydown", onUserGesture, { once: true });

    return () => {
      window.removeEventListener("pointerdown", onUserGesture);
      window.removeEventListener("touchstart", onUserGesture);
      window.removeEventListener("keydown", onUserGesture);
    };
  }, [play]);

  const value = useMemo<PlayerState>(() => ({
    source,
    playing,
    setPlaying,
    audioRef,
    isCurrent: (id) => source.kind === "track" && source.id === id,
    toggleLive: () => {
      const el = audioRef.current;
      if (!el) return;
      if (source.kind !== "live") {
        setSource({ kind: "live" });
        el.src = getRadioStreamUrl();
        el.load();
        void play();
        return;
      }
      if (playing) {
        el.pause();
        setPlaying(false);
      } else {
        el.src = getRadioStreamUrl();
        el.load();
        void play();
      }
    },
    playTrack: (t) => {
      const el = audioRef.current;
      if (!el) return;
      el.pause();
      setSource({ kind: "live" });
      setPlaying(false);
    },
  }), [source, playing, play]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePlayer() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
  return ctx;
}