import type { MediaId } from "@/lib/media";

export type ReleaseStatus = "Concept" | "In development" | "Final tastings" | "Limited drop";

export type Release = {
  slug: string;
  kind: "blend" | "object";
  name: string;
  devanagari?: string;
  status: ReleaseStatus;
  window: string;
  short: string;
  description: string;
  details: { label: string; value: string }[];
  notes?: string[];
  image: MediaId;
};

/** Hero countdown in the Upcoming section. PLACEHOLDER date & product. */
export const nextDrop = {
  slug: "kesar-kahwa",
  name: "Kesar Kahwa — Festive Edition",
  date: "2026-11-01T10:00:00+05:30",
};

export const upcomingIntro = {
  eyebrow: "Coming down the mountain",
  title: "Upcoming releases",
  body: "Concept blends and objects in development at the Mahvé roastery. Allocations are small and always go to the waitlist first.",
};

export const releases: Release[] = [
  {
    slug: "kesar-kahwa",
    kind: "blend",
    name: "Kesar Kahwa",
    devanagari: "केसर कहवा",
    status: "Final tastings",
    window: "Festive 2026",
    short: "A coffee-kahwa ritual: light-roast arabica with saffron, green cardamom and almond.",
    description:
      "Inspired by the kahwa poured for guests across the western Himalaya. A light, washed Naga coffee layered with a whisper of Kashmiri saffron, bruised green cardamom and slivered almond — brewed like tea, served in brass.",
    details: [
      { label: "Base", value: "Washed arabica, Nagaland" },
      { label: "Botanicals", value: "Saffron, cardamom, almond" },
      { label: "Format", value: "150 g gift tin · 10 cups" },
    ],
    notes: ["Saffron", "Cardamom", "Almond", "Honey"],
    image: "U4",
  },
  {
    slug: "kinnaur-apple-cask",
    kind: "blend",
    name: "Kinnaur Apple Cask",
    status: "In development",
    window: "Winter 2026",
    short: "Green coffee rested in casks of apple wood from the high orchards of Kinnaur.",
    description:
      "Kinnaur's apples grow on terraces cut into the Sutlej gorge, in thin air and hard sun. We rest green coffee in casks built from old orchard wood for six weeks before roasting — a slow, sweet infusion of baked fruit and spice.",
    details: [
      { label: "Resting", value: "6 weeks in apple-wood casks" },
      { label: "Roast", value: "Medium" },
      { label: "Lot size", value: "300 bags, numbered" },
    ],
    notes: ["Baked apple", "Cinnamon bark", "Brown sugar"],
    image: "U2",
  },
  {
    slug: "bugyal-reserve",
    kind: "blend",
    name: "Bugyal Reserve",
    devanagari: "बुग्याल",
    status: "Concept",
    window: "Spring 2027",
    short: "A single micro-lot from our highest partner farm, named for the alpine meadows of the hills.",
    description:
      "Bugyals are the high meadows that bloom for a few short weeks after the snow melts. This reserve follows one family's highest terrace through an experimental 120-hour cold fermentation. If it cups the way we hope, there will only ever be a few hundred bags.",
    details: [
      { label: "Altitude", value: "1,900 m" },
      { label: "Process", value: "120 h cold fermentation" },
      { label: "Availability", value: "Waitlist only" },
    ],
    notes: ["Wildflower honey", "Bergamot", "Lychee"],
    image: "U3",
  },
  {
    slug: "brass-dripper",
    kind: "object",
    name: "The Brass Dripper",
    status: "In development",
    window: "Winter 2026",
    short: "A hand-beaten brass pour-over cone, made with metalsmiths in Chamba.",
    description:
      "Chamba's metalsmiths have beaten brass into temple vessels for centuries. Together we are shaping a single-cup dripper that holds heat like a lota and develops a patina that is yours alone.",
    details: [
      { label: "Material", value: "Hand-beaten brass, food-safe tin lining" },
      { label: "Fits", value: "Size 02 cone filters" },
      { label: "Edition", value: "Numbered, first run of 200" },
    ],
    image: "U5",
  },
  {
    slug: "kullu-brew-kit",
    kind: "object",
    name: "Kullu Weave Brew Kit",
    status: "Concept",
    window: "Spring 2027",
    short: "A travel brew set wrapped in hand-loomed Kullu-pattern wool.",
    description:
      "Grinder, dripper, two cups and a week of coffee, rolled into a hand-loomed wool wrap woven in the Kullu valley in our border pattern. Made for trekkers, road trips and the long way home.",
    details: [
      { label: "Wrap", value: "Hand-loomed Kullu wool" },
      { label: "Includes", value: "Hand grinder, dripper, 2 enamel cups" },
      { label: "Weight", value: "1.1 kg" },
    ],
    image: "U6",
  },
  {
    slug: "deodar-slate-set",
    kind: "object",
    name: "Deodar & Slate Set",
    status: "Concept",
    window: "2027",
    short: "A hand-carved deodar scoop and a Himalayan slate serving board.",
    description:
      "Offcuts of fallen deodar, carved by hand into a two-dose scoop, paired with a slab of the grey slate that roofs the old houses of the Kangra valley.",
    details: [
      { label: "Scoop", value: "Fallen deodar, oil finish" },
      { label: "Board", value: "Kangra slate, 30 × 15 cm" },
      { label: "Edition", value: "Made to order" },
    ],
    image: "U7",
  },
];
