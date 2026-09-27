import { cn } from "@/lib/cn";
import { EMBLEM, ROSETTE_PETALS } from "./emblem-geometry";

type EmblemProps = {
  className?: string;
  /** Accessible name. Ignored when `decorative`. */
  title?: string;
  decorative?: boolean;
};

/**
 * Stroke paths carry `data-draw` + pathLength=1 so any parent can animate a
 * draw-on with `strokeDashoffset: 1 → 0`; filled details carry `data-fade`.
 * The bean crease uses --emblem-cut so it reads as a cut-out on any surface.
 */
export function Emblem({ className, title = "Mahvé Coffee", decorative = false }: EmblemProps) {
  const { bean, rosette, sun } = EMBLEM;
  return (
    <svg
      viewBox={EMBLEM.viewBox}
      fill="none"
      className={cn("text-gold", className)}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : title}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path data-draw d={EMBLEM.mountains} strokeWidth={2} pathLength={1} />
        <path data-draw d={EMBLEM.snow} strokeWidth={1.2} pathLength={1} />
      </g>
      <circle data-fade cx={sun.cx} cy={sun.cy} r={sun.r} fill="currentColor" />

      <g stroke="currentColor">
        {EMBLEM.thin.map((d) => (
          <path key={d} data-draw d={d} strokeWidth={2.1} pathLength={1} />
        ))}
        {EMBLEM.thick.map((d) => (
          <path key={d} data-draw d={d} strokeWidth={5.4} pathLength={1} />
        ))}
        <path data-draw d={EMBLEM.serifs} strokeWidth={1.8} pathLength={1} />
        <path data-draw d={EMBLEM.swash} strokeWidth={1.3} strokeLinecap="round" pathLength={1} />
      </g>

      <g data-fade transform={`rotate(${bean.rotate} ${bean.cx} ${bean.cy})`}>
        <ellipse cx={bean.cx} cy={bean.cy} rx={bean.rx} ry={bean.ry} fill="currentColor" />
        <path d={EMBLEM.beanCrease} stroke="var(--emblem-cut, #0b0907)" strokeWidth={1.3} strokeLinecap="round" />
      </g>

      <g data-fade fill="currentColor">
        {ROSETTE_PETALS.map((angle) => (
          <ellipse
            key={angle}
            cx={rosette.cx}
            cy={rosette.cy - rosette.petalOffset}
            rx={rosette.petalRx}
            ry={rosette.petalRy}
            transform={`rotate(${angle} ${rosette.cx} ${rosette.cy})`}
          />
        ))}
        <circle cx={rosette.cx} cy={rosette.cy} r={rosette.core} fill="var(--emblem-cut, #0b0907)" />
        <path d={EMBLEM.rosetteStem} stroke="currentColor" strokeWidth={1} />
        <path d={EMBLEM.drop} />
      </g>
    </svg>
  );
}
