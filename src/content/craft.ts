import type { MediaId } from "@/lib/media";

export const craftIntro = {
  /** Shows a "Placeholder" label on the section. Set to false once the steps below describe your real process. */
  placeholder: true,
  eyebrow: "From ridge to cup",
  title: "Slow by design",
  body: "Four steps, none of them hurried. The hills set the pace — we simply follow it.",
};

// PLACEHOLDER — the process steps below (hand-picking, drying, batch size,
// packing time) are drafts, not verified facts.
export const craftSteps: {
  index: string;
  title: string;
  body: string;
  image: MediaId;
  layout: "hero" | "wide" | "small";
}[] = [
  {
    index: "01",
    title: "Picked at first light",
    body: "Only the ripest red cherries, picked by hand in several passes through each terrace as they ripen.",
    image: "C1",
    layout: "hero",
  },
  {
    index: "02",
    title: "Dried on bamboo",
    body: "Raised bamboo beds in cold mountain air — turned by hand for up to three weeks.",
    image: "C2",
    layout: "wide",
  },
  {
    index: "03",
    title: "Roasted slow",
    body: "Twelve-kilo batches, with a profile written for every lot.",
    image: "C3",
    layout: "small",
  },
  {
    index: "04",
    title: "Brewed with care",
    body: "Packed within 48 hours of roasting, with a recipe on every bag.",
    image: "C4",
    layout: "small",
  },
];
