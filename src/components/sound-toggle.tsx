"use client";

import { Volume2, VolumeX } from "lucide-react";

import { TOGGLE_SRC, useSound } from "@/components/sound-provider";

export function SoundToggle() {
  const { muted, toggleMuted } = useSound();

  function handleClick() {
    // Play directly (bypassing the muted gate playHover/playClick use) only
    // when turning sound ON — confirms it now works. Muting shouldn't play
    // anything, since the point is to go quiet.
    if (muted) new Audio(TOGGLE_SRC).play().catch(() => {});
    toggleMuted();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={!muted}
      aria-label={muted ? "Unmute sound" : "Mute sound"}
      className="flex size-8 items-center justify-center border border-border/60 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
    >
      {muted ? (
        <VolumeX className="size-3.5" aria-hidden="true" />
      ) : (
        <Volume2 className="size-3.5" aria-hidden="true" />
      )}
    </button>
  );
}
