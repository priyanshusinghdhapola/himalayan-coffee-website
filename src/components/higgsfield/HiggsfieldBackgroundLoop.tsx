"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useMediaQuery, usePrefersReducedMotion, useSaveData } from "@/hooks/useMediaQuery";
import { PORTRAIT_QUERY } from "./HiggsfieldCanvas";

export type LoopSource = { src: string; type: string };

type HiggsfieldBackgroundLoopProps = {
  /** Ordered by preference — list WebM/VP9 before MP4/H.264. */
  sources: { landscape: LoopSource[]; portrait?: LoopSource[] };
  poster?: string;
  /** Whether the files exist (checked on the server at build time). */
  available: boolean;
  /** Rendered instead of poster + video when the loop isn't available. */
  fallback?: ReactNode;
  className?: string;
};

/**
 * Cinematic background loop for a Higgsfield clip.
 *
 * - Sources are only attached once the section is ~1 viewport away, so the
 *   MP4 never competes with the hero sequence for bandwidth.
 * - Plays only while on screen and pauses off-screen to free the decoder.
 * - Fades in over its poster once real frames are playing (no black flash).
 * - Reduced motion or Data Saver: the poster alone, never the video.
 */
export function HiggsfieldBackgroundLoop({ sources, poster, available, fallback, className }: HiggsfieldBackgroundLoopProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const saveData = useSaveData();
  const portrait = useMediaQuery(PORTRAIT_QUERY);
  const allowVideo = available && !reducedMotion && !saveData;
  const list = portrait && sources.portrait?.length ? sources.portrait : sources.landscape;

  useEffect(() => {
    const el = wrapRef.current;
    if (!allowVideo || !el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [allowVideo]);

  useEffect(() => {
    const el = wrapRef.current;
    const video = videoRef.current;
    if (!near || !allowVideo || !el || !video) return;
    // iOS only autoplays when muted is set as a property before play().
    video.muted = true;
    video.defaultMuted = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.02 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      video.pause();
    };
  }, [near, allowVideo, portrait]);

  return (
    <div ref={wrapRef} aria-hidden className={cn("relative overflow-hidden bg-ink", className)}>
      {available && poster ? (
        <Image src={poster} alt="" fill sizes="100vw" className="object-cover" />
      ) : (
        fallback
      )}
      {allowVideo && near && (
        <video
          key={portrait ? "portrait" : "landscape"}
          ref={videoRef}
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-[1400ms] ease-out",
            playing ? "opacity-100" : "opacity-0",
          )}
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          disablePictureInPicture
          disableRemotePlayback
          onPlaying={() => setPlaying(true)}
        >
          {list.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
      )}
    </div>
  );
}
