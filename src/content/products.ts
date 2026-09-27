import type { MediaId } from "@/lib/media";

/**
 * A size you actually sell. Price is in CURRENCY below. checkoutUrl is the
 * real payment page for this size (Stripe Payment Link, Shopify cart
 * permalink, Razorpay page…); without one, the button collects a sign-up.
 */
export type Offer = { size: string; price: number; checkoutUrl?: string };

/** Currency used to display the prices you add. Confirm before adding offers. */
export const CURRENCY = "INR";

export type Product = {
  slug: string;
  index: string;
  /**
   * PLACEHOLDER flag. While true, the site labels this coffee as a
   * placeholder, keeps its page out of search results and the sitemap, and
   * emits no Product structured data. Set to false only once every detail
   * below is verified.
   */
  placeholder: boolean;
  name: string;
  /** Devanagari spelling — shown as a Pahari accent next to the name. */
  devanagari: string;
  /** What the name means (a fact about the word, not the coffee). */
  meaning: string;
  roast: string;
  /** 1 (lightest) – 5 (darkest). */
  roastLevel: 1 | 2 | 3 | 4 | 5;
  process: string;
  origin: string;
  altitude: string;
  varietal: string;
  harvest: string;
  notes: string[];
  headline: string;
  description: string;
  profile: { acidity: number; sweetness: number; body: number; finish: number };
  brew: { method: string; recipe: string }[];
  /** Verified sizes and prices only. Empty = no price shown; the button becomes "Notify me". */
  offers: Offer[];
  /** Grind options you actually offer. Empty = no grind selector. */
  grinds: string[];
  accent: string;
  pack: MediaId;
  scene: MediaId;
};

// PLACEHOLDER LINEUP — names are Pahari words; every origin, altitude, varietal,
// process, harvest window, tasting note, score and recipe below is a draft,
// not a fact. Replace per coffee, then set placeholder: false.
export const products: Product[] = [
  {
    slug: "buransh",
    index: "01",
    placeholder: true,
    name: "Buransh",
    devanagari: "बुरांश",
    meaning: "The crimson rhododendron that blooms across the hills each spring.",
    roast: "Light roast",
    roastLevel: 1,
    process: "Washed",
    origin: "Kohima district, Nagaland",
    altitude: "1,600 – 1,800 m",
    varietal: "S795 & Typica",
    harvest: "December – February",
    notes: ["Rhododendron blossom", "White peach", "Jasmine tea", "Wild honey"],
    headline: "Our brightest cup — floral, luminous, alive.",
    description:
      "Grown on the highest ridges we source from, washed in cold spring water and dried slowly on raised bamboo beds. A delicate, tea-like coffee with a lingering honeyed finish. Best as a pour-over, never with milk.",
    profile: { acidity: 8, sweetness: 7, body: 3, finish: 7 },
    brew: [
      { method: "V60 pour-over", recipe: "15 g · 250 ml · 93 °C · 2:45" },
      { method: "Chemex", recipe: "30 g · 480 ml · 94 °C · 4:30" },
    ],
    offers: [],
    grinds: [],
    accent: "#b6453f",
    pack: "P1",
    scene: "P1S",
  },
  {
    slug: "kafal",
    index: "02",
    placeholder: true,
    name: "Kafal",
    devanagari: "काफल",
    meaning: "The wild Himalayan bayberry children pick along forest trails in May.",
    roast: "Light–medium roast",
    roastLevel: 2,
    process: "Natural · 72 h anaerobic",
    origin: "West Kameng, Arunachal Pradesh",
    altitude: "1,500 – 1,700 m",
    varietal: "SL-9 & Catimor",
    harvest: "November – January",
    notes: ["Wild berry", "Hibiscus", "Cacao nib", "Red wine"],
    headline: "Wild, jammy, unmistakably fruit-forward.",
    description:
      "Whole cherries sealed and fermented cool for seventy-two hours before drying in the sun. The result is dense with red fruit and a winey depth that rounds into cacao as it cools. A cup for the curious.",
    profile: { acidity: 7, sweetness: 8, body: 5, finish: 8 },
    brew: [
      { method: "AeroPress", recipe: "16 g · 230 ml · 90 °C · 1:45" },
      { method: "V60 pour-over", recipe: "15 g · 240 ml · 92 °C · 2:40" },
    ],
    offers: [],
    grinds: [],
    accent: "#7a2e3a",
    pack: "P2",
    scene: "P2S",
  },
  {
    slug: "deodar",
    index: "03",
    placeholder: true,
    name: "Deodar",
    devanagari: "देवदार",
    meaning: "The Himalayan cedar — the “timber of the gods”.",
    roast: "Medium–dark roast",
    roastLevel: 4,
    process: "Honey",
    origin: "East Khasi Hills, Meghalaya",
    altitude: "1,200 – 1,400 m",
    varietal: "Chandragiri & S795",
    harvest: "December – March",
    notes: ["Dark jaggery", "Toasted walnut", "Cedar smoke", "Dark chocolate"],
    headline: "Deep and resinous, like the forest it is named for.",
    description:
      "Honey-processed for weight and sweetness, then roasted long and low until the sugars turn to gur and bittersweet chocolate. Built for milk, moka pots and long winter evenings by the bukhari.",
    profile: { acidity: 3, sweetness: 7, body: 9, finish: 8 },
    brew: [
      { method: "Moka pot", recipe: "18 g · fine-medium · off the boil" },
      { method: "French press", recipe: "30 g · 500 ml · 94 °C · 4:00" },
    ],
    offers: [],
    grinds: [],
    accent: "#4f6b58",
    pack: "P3",
    scene: "P3S",
  },
  {
    slug: "dhauladhar",
    index: "04",
    placeholder: true,
    name: "Dhauladhar",
    devanagari: "धौलाधार",
    meaning: "“The white ridge” that watches over the Kangra valley.",
    roast: "Medium roast · House espresso",
    roastLevel: 3,
    process: "Washed & natural blend",
    origin: "Nagaland × Baba Budangiri, Chikmagalur",
    altitude: "1,200 – 1,800 m",
    varietal: "S795, SLN 9 & Typica",
    harvest: "Rotating seasonal lots",
    notes: ["Pahari honey", "Roasted almond", "Orange peel", "Milk chocolate"],
    headline: "Our everyday espresso — balanced, sweet, endlessly repeatable.",
    description:
      "A washed Naga lot for clarity meets a natural from the hills where coffee first came to India. Syrupy as espresso, generous under milk, and forgiving enough for every grinder in the house.",
    profile: { acidity: 5, sweetness: 8, body: 7, finish: 7 },
    brew: [
      { method: "Espresso", recipe: "18 g in · 38 g out · 28 s · 93 °C" },
      { method: "Flat white", recipe: "Double shot · 120 ml silky milk" },
    ],
    offers: [],
    grinds: [],
    accent: "#c9a46a",
    pack: "P4",
    scene: "P4S",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: CURRENCY, maximumFractionDigits: 0 }).format(amount);
}
