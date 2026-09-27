"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

const subscribe = (tick: () => void) => {
  const id = window.setInterval(tick, 1000);
  return () => window.clearInterval(id);
};
const getNow = (): number | null => Math.floor(Date.now() / 1000);
const getServerNow = (): number | null => null;

const pad = (n: number) => String(n).padStart(2, "0");

/** Live countdown. Renders dashes on the server and during hydration, so there's no mismatch. */
export function Countdown({ to, className }: { to: string; className?: string }) {
  const now = useSyncExternalStore(subscribe, getNow, getServerNow);
  const target = Math.floor(new Date(to).getTime() / 1000);
  const left = now === null ? null : Math.max(0, target - now);

  const parts =
    left === null
      ? [["––", "Days"], ["––", "Hrs"], ["––", "Min"], ["––", "Sec"]]
      : [
          [pad(Math.floor(left / 86400)), "Days"],
          [pad(Math.floor((left % 86400) / 3600)), "Hrs"],
          [pad(Math.floor((left % 3600) / 60)), "Min"],
          [pad(left % 60), "Sec"],
        ];

  return (
    <div className={cn("flex items-end gap-3 sm:gap-5", className)} role="timer" aria-live="off">
      {parts.map(([value, label], i) => (
        <div key={label} className="flex items-end gap-3 sm:gap-5">
          <div className="flex flex-col items-center">
            <span className="font-display text-4xl font-light tabular-nums text-cream sm:text-5xl">{value}</span>
            <span className="eyebrow mt-1 text-[0.55rem] text-mist">{label}</span>
          </div>
          {i < parts.length - 1 && <span className="pb-6 font-display text-3xl text-gold/50">:</span>}
        </div>
      ))}
    </div>
  );
}
