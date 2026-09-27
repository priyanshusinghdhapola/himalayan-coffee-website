/**
 * Vector redraw of the Mahvé mark, refined for the web: Himalayan ridge with a
 * snow line and rising sun, a Didone "M" whose valley cradles a single coffee
 * bean, and the Pahari rosette + drop (from Himachali wood carving) hanging on
 * the right, as in the original signage. Plain data so it can be reused by the
 * React component, the favicon and the preloader draw-on animation.
 */
export const EMBLEM = {
  viewBox: "0 0 120 120",
  mountains: "M12 46L29 30L36 36L50 20L60 9L70 21L80 31L88 25L108 46",
  snow: "M53.2 17.6L57 20.4L60 16.6L63 20.4L66.8 17.6",
  sun: { cx: 92, cy: 13.5, r: 4.2 },
  /** Hairline strokes of the M. */
  thin: ["M34 56V96", "M60 95L86 56"],
  /** Shaded (thick) strokes of the M. */
  // The diagonal starts/ends inset so its butt caps tuck under the serif and
  // the stem instead of poking out as notches.
  thick: ["M35.2 57.8L59.4 94.2", "M86 56V96"],
  serifs: "M28.5 56H38M82 56H91.5M28.5 96H39.5M80.5 96H91.5",
  swash: "M34 96C42 105 66 107 97 99",
  bean: { cx: 60, cy: 67.5, rx: 5.4, ry: 8.4, rotate: -14 },
  beanCrease: "M60 59.6C56.8 64.2 63.2 70.8 60 75.4",
  rosette: { cx: 101, cy: 63, petalRx: 1.45, petalRy: 3.5, petalOffset: 3.8, core: 1.5 },
  rosetteStem: "M101 70.5V85",
  drop: "M101 86.4L103.3 90L101 93.6L98.7 90Z",
} as const;

export const ROSETTE_PETALS = [0, 45, 90, 135, 180, 225, 270, 315] as const;
