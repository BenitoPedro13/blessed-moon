"use client";

import { useSyncExternalStore } from "react";

function subscribe(notify: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}
const snapshot = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverSnapshot = () => false;

/** Match the server on hydration, then follow the browser's actual preference. */
export function usePageReducedMotion() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
