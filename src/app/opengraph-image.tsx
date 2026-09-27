import { ImageResponse } from "next/og";
import { EMBLEM } from "@/components/brand/emblem-geometry";
import { brand } from "@/content/brand";

export const alt = `${brand.fullName} — ${brand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const { bean, sun } = EMBLEM;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 70% 15%, #3a2a1c 0%, #14100c 55%, #0b0907 100%)",
          color: "#f3ead9",
        }}
      >
        <svg width="190" height="190" viewBox="0 0 120 120" fill="none">
          <path d={EMBLEM.mountains} stroke="#c9a46a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d={EMBLEM.snow} stroke="#c9a46a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={sun.cx} cy={sun.cy} r={sun.r} fill="#c9a46a" />
          {EMBLEM.thin.map((d) => (
            <path key={d} d={d} stroke="#c9a46a" strokeWidth="2.1" />
          ))}
          {EMBLEM.thick.map((d) => (
            <path key={d} d={d} stroke="#c9a46a" strokeWidth="5.4" />
          ))}
          <path d={EMBLEM.serifs} stroke="#c9a46a" strokeWidth="1.8" />
          <path d={EMBLEM.swash} stroke="#c9a46a" strokeWidth="1.3" strokeLinecap="round" />
          <ellipse cx={bean.cx} cy={bean.cy} rx={bean.rx} ry={bean.ry} fill="#c9a46a" transform={`rotate(${bean.rotate} ${bean.cx} ${bean.cy})`} />
        </svg>
        <div style={{ marginTop: 28, fontSize: 104, letterSpacing: 28, paddingLeft: 28 }}>MAHVÉ</div>
        <div style={{ marginTop: 4, fontSize: 22, letterSpacing: 14, color: "#c9a46a" }}>COFFEE</div>
        <div style={{ marginTop: 34, fontSize: 26, letterSpacing: 6, color: "#d9ccb6" }}>
          {`${brand.tagline.toUpperCase()} · ${brand.taglineSecond.toUpperCase()}`}
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 14, display: "flex" }}>
          <div style={{ flex: 1, background: "#a8412c" }} />
          <div style={{ flex: 1, background: "#d98e32" }} />
          <div style={{ flex: 1, background: "#c9a46a" }} />
          <div style={{ flex: 1, background: "#4f6b58" }} />
          <div style={{ flex: 1, background: "#a8412c" }} />
        </div>
      </div>
    ),
    size,
  );
}
