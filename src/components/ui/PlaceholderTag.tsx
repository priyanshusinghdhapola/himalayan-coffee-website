import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Visible marker for draft content that hasn't been verified. Rendered
 * wherever a content record has `placeholder: true`; it disappears as soon
 * as that flag is set to false in src/content/.
 */
export function PlaceholderTag({ children = "Placeholder", className }: { children?: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full border border-dashed border-saffron/70 bg-saffron/10 px-3 py-1",
        "font-sans text-[0.65rem] font-semibold uppercase leading-snug tracking-[0.14em] text-saffron",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-saffron" />
      {children}
    </span>
  );
}
