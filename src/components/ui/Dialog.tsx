"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  className?: string;
};

/**
 * Native <dialog> (focus trap, Esc, top layer for free) styled as glass.
 * Smooth scroll is paused while open; the dialog itself scrolls natively.
 */
export function Dialog({ open, onClose, labelledBy, children, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      lenis?.stop();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, lenis]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      data-lenis-prevent
      onClose={() => {
        lenis?.start();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        "glass m-auto max-h-[88svh] w-[min(94vw,760px)] overflow-y-auto overscroll-contain rounded-[28px] p-0 text-cream",
        "translate-y-0 opacity-100 transition-[opacity,translate] duration-500 ease-expo starting:open:translate-y-6 starting:open:opacity-0",
        className,
      )}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full border border-gold/30 bg-ink/50 text-cream transition-colors hover:border-gold hover:text-gold-bright"
      >
        <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M5 5l10 10M15 5L5 15" />
        </svg>
      </button>
      {children}
    </dialog>
  );
}
