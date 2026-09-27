import type { Product } from "@/content/products";
import { cn } from "@/lib/cn";

const PROFILE_LABELS: Array<[keyof Product["profile"], string]> = [
  ["acidity", "Acidity"],
  ["sweetness", "Sweetness"],
  ["body", "Body"],
  ["finish", "Finish"],
];

export function FlavorProfile({ profile, className }: { profile: Product["profile"]; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-2 gap-x-8 gap-y-4", className)}>
      {PROFILE_LABELS.map(([key, label]) => (
        <div key={key}>
          <div className="flex items-baseline justify-between">
            <dt className="eyebrow text-[0.6rem] text-mist">{label}</dt>
            <dd className="font-display text-lg text-cream">{profile[key]}/10</dd>
          </div>
          <div aria-hidden className="mt-2 h-px w-full bg-gold/15">
            <div className="h-px bg-gold transition-[width] duration-1000 ease-expo" style={{ width: `${profile[key] * 10}%` }} />
          </div>
        </div>
      ))}
    </dl>
  );
}

export function RoastMeter({ level, className }: { level: Product["roastLevel"]; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="eyebrow text-[0.6rem] text-mist">Roast</span>
      <div className="flex gap-1.5" role="img" aria-label={`Roast level ${level} of 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={cn("h-2 w-6 rounded-full transition-colors duration-700", n <= level ? "bg-gold" : "bg-gold/15")}
            style={n <= level ? { opacity: 0.45 + n * 0.11 } : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export function SpecList({ product, className }: { product: Product; className?: string }) {
  const rows = [
    ["Origin", product.origin],
    ["Altitude", product.altitude],
    ["Varietal", product.varietal],
    ["Process", product.process],
    ["Harvest", product.harvest],
  ];
  return (
    <dl className={cn("divide-y divide-gold/10 border-y border-gold/10", className)}>
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-baseline justify-between gap-6 py-3">
          <dt className="eyebrow text-[0.6rem] text-mist">{label}</dt>
          <dd className="text-right text-sm text-cream">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function NoteChips({ notes, className }: { notes: readonly string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)} aria-label="Tasting notes">
      {notes.map((note) => (
        <li key={note} className="rounded-full border border-gold/25 bg-gold/5 px-3.5 py-1.5 text-xs tracking-wide text-parchment">
          {note}
        </li>
      ))}
    </ul>
  );
}
