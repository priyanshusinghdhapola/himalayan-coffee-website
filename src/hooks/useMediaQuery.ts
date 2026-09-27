"use client";

import { useSyncExternalStore } from "react";

/** SSR-safe media query subscription (server snapshot = `serverDefault`). */
export function useMediaQuery(query: string, serverDefault = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverDefault,
  );
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

type NetworkInformationLike = { saveData?: boolean; addEventListener?: (t: string, cb: () => void) => void; removeEventListener?: (t: string, cb: () => void) => void };

function connection(): NetworkInformationLike | undefined {
  return (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
}

/** True when the visitor has Data Saver / Low Data Mode switched on. */
export function useSaveData(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const c = connection();
      c?.addEventListener?.("change", onChange);
      return () => c?.removeEventListener?.("change", onChange);
    },
    () => connection()?.saveData === true,
    () => false,
  );
}

export function prefersSaveData(): boolean {
  return typeof navigator !== "undefined" && connection()?.saveData === true;
}
