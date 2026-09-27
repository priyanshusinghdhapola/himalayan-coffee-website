/**
 * Brand-level copy and settings. Everything marked PLACEHOLDER is written to
 * be launch-quality but must be checked against your real sourcing, contact
 * details and legal entity before going live.
 */

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const brand = {
  name: "Mahvé",
  fullName: "Mahvé Coffee",
  tagline: "Rooted in the Hills",
  taglineSecond: "Brewed for the Soul",
  /** Hindi: "hill coffee" — used as a quiet Pahari accent in the UI. */
  devanagari: "पहाड़ी कॉफ़ी",
  description:
    "Mahvé is a Himalayan specialty coffee house. Small-lot arabica from the eastern Himalayan foothills, roasted slow in the hills and brewed for the soul.",
  // PLACEHOLDER contact + social details
  email: "hello@mahve.coffee",
  wholesaleEmail: "wholesale@mahve.coffee",
  roastery: "Roastery & tasting room — Dharamshala, Himachal Pradesh",
  instagram: "https://www.instagram.com/",
  founded: 2026,
} as const;

export const navLinks = [
  { label: "Story", href: "/#story" },
  { label: "Collection", href: "/#collection" },
  { label: "Craft", href: "/#craft" },
  { label: "Upcoming", href: "/#upcoming" },
] as const;

/** Scroll-scrubbed hero chapters — timed against the hero video's four shots. */
export const heroChapters = [
  {
    numeral: "I",
    title: "Above the clouds",
    body: "It begins at first light, where the snow line meets the sky and the air is thin enough to slow everything down — even a coffee cherry.",
  },
  {
    numeral: "II",
    title: "Where the road ends",
    body: "Down through deodar and terraced hills, to villages where coffee is still picked by hand, one ripe cherry at a time.",
  },
  {
    numeral: "III",
    title: "Fire & brass",
    body: "Roasted slow in small batches, turned by hand, and ground only in the moment before it is poured.",
  },
  {
    numeral: "IV",
    title: "Brewed for the soul",
    body: "A cup that carries the mountain in it. Warm, patient, unhurried.",
  },
] as const;

export const marqueeWords = [
  "Nagaland",
  "Arunachal Pradesh",
  "Meghalaya",
  "1,650 m",
  "Hand-picked",
  "Sun-dried on bamboo",
  "Slow-roasted",
  "Brewed for the soul",
] as const;

export const story = {
  eyebrow: "Our Story",
  statement:
    "We believe the finest coffee grows where the air is thin, the nights are cold, and time moves slowly.",
  paragraphs: [
    // PLACEHOLDER sourcing — replace regions/partners with your actual supply chain.
    "Mahvé was born in the pahad — the hills. We work with smallholder growers across the eastern Himalayan foothills of Nagaland, Arunachal Pradesh and Meghalaya, where arabica ripens slowly at altitude and draws its sweetness from cold nights and monsoon mist.",
    "Every lot is cupped, chosen and roasted in small batches, then packed in sleeves patterned after the hand-loomed shawls of Kullu. Coffee with a sense of place — the patience of the hills in every cup.",
  ],
  plateCaption: "The Mahvé mark — Himalayan peaks, a rising sun, and a single bean held in the valley of the M.",
  stats: [
    { value: 1650, suffix: " m", label: "Average growing altitude" },
    { value: 72, suffix: " h", label: "Slow, cool fermentation" },
    { value: 12, suffix: " kg", label: "Largest batch we roast" },
    { value: 48, suffix: " h", label: "From roaster to your door" },
  ],
} as const;

export const footer = {
  newsletterBody: "One email a month. New lots, brew notes and first access to every drop.",
  legal: `© ${new Date().getFullYear()} Mahvé Coffee. All rights reserved.`,
  signoff: "Rooted in the hills. Brewed for the soul.",
} as const;
