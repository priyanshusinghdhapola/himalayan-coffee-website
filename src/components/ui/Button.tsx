import { cn } from "@/lib/cn";

type Variant = "gold" | "outline" | "ghost";

/**
 * Pill button styles with a brass "fill sweep" on hover. Returned as classes
 * so the same look applies to <button>, <a> and TransitionLink. Wrap the label
 * in <span className="relative z-10"> so it sits above the sweep.
 */
export function buttonClasses(variant: Variant = "outline", className?: string) {
  return cn(
    "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-3.5",
    "font-caps text-[0.7rem] tracking-[0.28em] uppercase transition-colors duration-500 ease-expo",
    "before:absolute before:inset-0 before:origin-right before:scale-x-0 before:rounded-full before:transition-transform before:duration-700 before:ease-expo",
    "hover:before:origin-left hover:before:scale-x-100 focus-visible:before:origin-left focus-visible:before:scale-x-100",
    "disabled:pointer-events-none disabled:opacity-50",
    variant === "gold" && "bg-gold text-ink before:bg-cream",
    variant === "outline" && "border border-gold/45 text-cream before:bg-gold hover:text-ink focus-visible:text-ink",
    variant === "ghost" && "px-0 py-2 text-gold before:hidden hover:text-gold-bright",
    className,
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden
      className={cn("relative z-10 size-3.5 transition-transform duration-500 ease-expo group-hover:translate-x-1", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 10h13M11 5l5 5-5 5" />
    </svg>
  );
}
