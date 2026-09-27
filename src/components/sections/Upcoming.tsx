import { HimalayaRidges } from "@/components/brand/HimalayaRidges";
import { HiggsfieldBackgroundLoop, type LoopSource } from "@/components/higgsfield/HiggsfieldBackgroundLoop";
import { mediaSrc, type MediaAvailability } from "@/lib/media";
import { UpcomingContent } from "./UpcomingContent";

/** Drifting valley mist over the ridges — the loop's stand-in until U1 exists. */
function MistFallback() {
  return (
    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0e1216 0%, #1b2227 45%, #0b0907 100%)" }}>
      <HimalayaRidges id="upcoming-fb" palette="mist" className="absolute inset-x-0 bottom-0 h-[75%] w-full" />
      <div
        className="absolute -inset-x-1/4 bottom-[18%] h-[40%] animate-drift opacity-70 blur-2xl"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(223,230,232,0.18), transparent 70%)" }}
      />
      <div
        className="absolute -inset-x-1/4 bottom-[4%] h-[35%] animate-drift-slow opacity-60 blur-3xl"
        style={{ background: "radial-gradient(45% 50% at 40% 50%, rgba(223,230,232,0.14), transparent 70%)" }}
      />
    </div>
  );
}

export function Upcoming({ media }: { media: MediaAvailability }) {
  const available = Boolean(media.U1 && media.U1P);
  const landscape: LoopSource[] = [
    ...(media.U1W ? [{ src: mediaSrc("U1W"), type: 'video/webm; codecs="vp9"' }] : []),
    { src: mediaSrc("U1"), type: "video/mp4" },
  ];
  const portrait: LoopSource[] | undefined = media.U1M ? [{ src: mediaSrc("U1M"), type: "video/mp4" }] : undefined;

  return (
    <section id="upcoming" aria-labelledby="upcoming-title" className="relative bg-ink">
      {/* The loop stays pinned (CSS sticky, no JS) while the glass UI scrolls over it. */}
      <div className="sticky top-0 -mb-[100svh] h-svh w-full overflow-hidden">
        <HiggsfieldBackgroundLoop
          available={available}
          poster={media.U1P ? mediaSrc("U1P") : undefined}
          sources={{ landscape, portrait }}
          fallback={<MistFallback />}
          className="absolute inset-0"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink via-ink/45 to-ink" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(11,9,7,0.65)_100%)]" />
      </div>
      <UpcomingContent media={media} />
    </section>
  );
}
