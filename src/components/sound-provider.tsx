"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const HOVER_SRC = "/sounds/hover.ogg";
const CLICK_SRC = "/sounds/click.ogg";
const TOGGLE_SRC = "/sounds/toggle.ogg";
/** Drop a looping ambient track here (CC0/royalty-free — see
 * TASK-sound-and-boot.md) and it starts automatically on the first user
 * gesture, respecting mute state. Missing file fails silently (onError). */
const AMBIENT_SRC = "/sounds/ambient.mp3";
const STORAGE_KEY = "blessed-moon-sound-muted";

interface SoundContextValue {
  muted: boolean;
  toggleMuted: () => void;
  playHover: () => void;
  playClick: () => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

function playClip(src: string, muted: boolean) {
  if (muted) return;
  const audio = new Audio(src);
  audio.volume = 0.35;
  audio.play().catch(() => {});
}

/**
 * Sound is opt-in, not opt-on-by-default — defaults muted, persisted to
 * localStorage once the user toggles it via SoundToggle. UI blips
 * (hover/click) play directly since they're triggered by a real user
 * gesture; the ambient loop additionally waits for the first gesture before
 * attempting playback at all, per browser autoplay policy.
 */
export function SoundProvider({ children }: { children: React.ReactNode }) {
  // Always starts `true` on both server and client's first render (SSR has
  // no access to localStorage), then a mount-only effect below corrects it
  // from the stored value if different. A lazy useState(() =>
  // localStorage...) initializer looks tempting here and avoids an
  // eslint-disable, but it's wrong: it makes the client's first render
  // depend on client-only data the server rendered without, which is
  // exactly what causes a hydration mismatch — confirmed via a real
  // aria-pressed/aria-label/icon mismatch in the browser once this had
  // actually been toggled in a prior session.
  const [muted, setMuted] = useState(true);
  const mutedRef = useRef(muted);
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const ambientStarted = useRef(false);
  const ambientAvailable = useRef(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    // This correction must happen post-mount, not during render — see the
    // comment on `muted` above — to avoid a hydration mismatch against the
    // server's fixed default.
    if (stored !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMuted(stored === "true");
    }
  }, []);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  // Runs once: sets up the ambient element and a one-shot gesture listener.
  // Reads mutedRef.current (not the muted prop) so the listener — created
  // once at mount — always sees the current mute state when the gesture
  // actually fires, rather than whatever it was at mount time.
  useEffect(() => {
    const audio = new Audio(AMBIENT_SRC);
    audio.loop = true;
    audio.volume = 0.18;
    audio.onerror = () => {
      ambientAvailable.current = false;
    };
    ambientRef.current = audio;

    function tryStartAmbient() {
      if (ambientStarted.current || !ambientAvailable.current) return;
      ambientStarted.current = true;
      if (!mutedRef.current) audio.play().catch(() => {});
      window.removeEventListener("pointerdown", tryStartAmbient);
      window.removeEventListener("keydown", tryStartAmbient);
    }
    window.addEventListener("pointerdown", tryStartAmbient, { once: true });
    window.addEventListener("keydown", tryStartAmbient, { once: true });

    return () => {
      audio.pause();
      window.removeEventListener("pointerdown", tryStartAmbient);
      window.removeEventListener("keydown", tryStartAmbient);
    };
  }, []);

  useEffect(() => {
    const audio = ambientRef.current;
    if (!audio || !ambientStarted.current) return;
    if (muted) audio.pause();
    else audio.play().catch(() => {});
  }, [muted]);

  const toggleMuted = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      window.localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  const playHover = useCallback(() => playClip(HOVER_SRC, muted), [muted]);
  const playClick = useCallback(() => playClip(CLICK_SRC, muted), [muted]);

  return (
    <SoundContext.Provider value={{ muted, toggleMuted, playHover, playClick }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within SoundProvider");
  return ctx;
}

export { TOGGLE_SRC };
