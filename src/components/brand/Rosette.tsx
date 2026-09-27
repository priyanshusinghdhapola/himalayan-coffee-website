import { cn } from "@/lib/cn";
import { ROSETTE_PETALS } from "./emblem-geometry";

/** The eight-petal Pahari rosette from the mark — used as a bullet / divider. */
export function Rosette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={cn("inline-block size-3 text-gold", className)}>
      <g fill="currentColor">
        {ROSETTE_PETALS.map((angle) => (
          <ellipse key={angle} cx={8} cy={3.6} rx={1.5} ry={3.1} transform={`rotate(${angle} 8 8)`} />
        ))}
      </g>
      <circle cx={8} cy={8} r={1.4} fill="var(--emblem-cut, #0b0907)" />
    </svg>
  );
}
