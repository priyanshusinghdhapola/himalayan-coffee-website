import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Register once, client-side only. Every component imports GSAP from here so
// plugin registration can never be skipped by an import-order accident.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  // Mobile URL bars resize the viewport while scrolling; refreshing on every
  // one of those would make pinned/scrubbed sections jump.
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.defaults({ ease: "power3.out" });
}

export const EASE_EXPO = "expo.out";
export const EASE_INOUT = "expo.inOut";

export { gsap, ScrollTrigger, SplitText, useGSAP };
