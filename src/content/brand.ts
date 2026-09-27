/**
 * Brand-level copy and settings.
 *
 * Verified from your logo: the name "Mahvé Coffee" and the lines "Rooted in
 * the Hills" / "Brewed for the Soul". Everything else is either empty until
 * you supply it, or explicitly flagged `placeholder: true` — which shows a
 * visible "Placeholder" label on the site until you set it to false.
 */

export const brand = {
  name: "Mahvé",
  fullName: "Mahvé Coffee",
  tagline: "Rooted in the Hills",
  taglineSecond: "Brewed for the Soul",
  /** Hindi for "hills / mountains" — a decorative Pahari accent echoing the tagline. */
  devanagari: "पहाड़",
  /** Used for SEO and social previews. Built only from the logo's own words — no business claims. */
  description: "Mahvé Coffee — Rooted in the Hills. Brewed for the Soul.",
} as const;

/**
 * VERIFIED BUSINESS DETAILS — intentionally empty.
 * Nothing here is published until you fill it in: the footer's contact
 * column and the Organization structured data render only the fields that
 * are set. Use real, confirmed details only.
 */
export const contact: {
  /** General enquiries, e.g. "hello@<your-domain>". */
  email: string | null;
  /** Trade / wholesale enquiries. */
  wholesaleEmail: string | null;
  /** Address or location line, exactly as it should appear publicly. */
  address: string | null;
  /** Full profile URLs, e.g. { label: "Instagram", href: "https://www.instagram.com/<handle>" }. */
  socials: { label: string; href: string }[];
} = {
  email: null,
  wholesaleEmail: null,
  address: null,
  socials: [],
};

export const navLinks = [
  { label: "Story", href: "/#story" },
  { label: "Collection", href: "/#collection" },
  { label: "Craft", href: "/#craft" },
  { label: "Upcoming", href: "/#upcoming" },
] as const;

/**
 * Scroll-scrubbed hero chapters, timed against the hero film's four shots.
 * Written to describe the imagery only — no claims about sourcing or process.
 */
export const heroChapters = [
  {
    numeral: "I",
    title: "Above the clouds",
    body: "It begins at first light, where the snow line meets the sky.",
  },
  {
    numeral: "II",
    title: "Where the road ends",
    body: "Down through deodar forest and terraced hills, to the villages below.",
  },
  {
    numeral: "III",
    title: "Fire & brass",
    body: "Embers, brass and the patience of the fire.",
  },
  {
    numeral: "IV",
    title: "Brewed for the soul",
    body: "A cup that carries the mountain in it. Warm, patient, unhurried.",
  },
] as const;

/** Scrolling ribbon — the logo's own words only. */
export const marqueeWords = ["Mahvé Coffee", "Rooted in the Hills", "Brewed for the Soul"] as const;

export type Stat = { value: number; suffix: string; label: string };

export const story: {
  /** Shows a "Placeholder" label on the section. Set to false once the text below is verified. */
  placeholder: boolean;
  eyebrow: string;
  statement: string;
  paragraphs: string[];
  plateCaption: string;
  /** Verified figures only (e.g. growing altitude, batch size). Empty = the stats panel is not shown. */
  stats: Stat[];
} = {
  placeholder: true,
  eyebrow: "Our Story",
  statement: "We believe the finest coffee grows where the air is thin, the nights are cold, and time moves slowly.",
  paragraphs: [
    // PLACEHOLDER — sourcing regions, grower relationships and process are drafts, not facts.
    "Mahvé was born in the pahad — the hills. We work with smallholder growers across the eastern Himalayan foothills of Nagaland, Arunachal Pradesh and Meghalaya, where arabica ripens slowly at altitude and draws its sweetness from cold nights and monsoon mist.",
    "Every lot is cupped, chosen and roasted in small batches, then packed in sleeves patterned after the hand-loomed shawls of Kullu. Coffee with a sense of place — the patience of the hills in every cup.",
  ],
  plateCaption: "The Mahvé mark — Himalayan peaks, a rising sun, and a single bean held in the valley of the M.",
  stats: [],
};

export const footer = {
  newsletterBody: "Leave your email to hear from Mahvé.",
  legal: `© ${new Date().getFullYear()} Mahvé Coffee. All rights reserved.`,
  signoff: "Rooted in the hills. Brewed for the soul.",
} as const;
