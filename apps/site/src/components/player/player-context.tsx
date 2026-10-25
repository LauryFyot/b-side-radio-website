import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { getRadioStreamUrl } from '@/lib/radio';

const ENABLE_AUTOPLAY = false;

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
  const autoplayAttemptedRef = useRef(false);
  const firstGesturePendingRef = useRef(true);
  const playRequestRef = useRef(0);
  const [source, setSource] = useState<Source>({ kind: "live" });
  const [playing, setPlaying] = useState(false);

  const play = useCallback(async () => {
    const el = audioRef.current;
    if (!el) return false;
    const request = ++playRequestRef.current;

    const streamUrl = getRadioStreamUrl();
    if (el.getAttribute("src") !== streamUrl) {
      el.src = streamUrl;
      el.load();
    }

    try {
      await el.play();
      if (request !== playRequestRef.current) return false;
      firstGesturePendingRef.current = false;
      setPlaying(true);
      return true;
    } catch {
      if (request === playRequestRef.current) setPlaying(false);
      return false;
    }
  }, []);

  useEffect(() => {
    if (ENABLE_AUTOPLAY && !autoplayAttemptedRef.current) {
      autoplayAttemptedRef.current = true;
      void play();
    }

    const onUserGesture = (event: MouseEvent) => {
      if (!firstGesturePendingRef.current) return;
      firstGesturePendingRef.current = false;
      const target = event.target;
      if (target instanceof Element && target.closest('#player-toggle-hero, #player-toggle-bar, [data-clarity-label="mix-play"], audio')) return;
      void play();
    };

    window.addEventListener("click", onUserGesture, { once: true });

    return () => {
      window.removeEventListener("click", onUserGesture);
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
      firstGesturePendingRef.current = false;
      if (source.kind !== "live") {
        setSource({ kind: "live" });
        void play();
        return;
      }
      if (playing) {
        playRequestRef.current += 1;
        el.pause();
        setPlaying(false);
      } else {
        void play();
      }
    },
    playTrack: (t) => {
      const el = audioRef.current;
      if (!el) return;
      firstGesturePendingRef.current = false;
      playRequestRef.current += 1;
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