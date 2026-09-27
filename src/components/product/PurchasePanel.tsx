"use client";

import { useId, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { ArrowIcon, buttonClasses } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { WaitlistForm } from "@/components/ui/WaitlistForm";
import { formatPrice, type Product } from "@/content/products";
import { cn } from "@/lib/cn";

const SHOP_URL = process.env.NEXT_PUBLIC_SHOP_URL?.trim() || "";

const listPart = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function Choice({
  legend,
  options,
  value,
  onChange,
  name,
}: {
  legend: string;
  options: readonly string[];
  value: number;
  onChange: (index: number) => void;
  name: string;
}) {
  return (
    <fieldset>
      <legend className="eyebrow mb-3 text-[0.6rem] text-mist">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option, i) => (
          <label
            key={option}
            className={cn(
              "cursor-pointer rounded-full border px-4 py-2 text-xs tracking-wide transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-gold-bright",
              value === i ? "border-gold bg-gold text-ink" : "border-gold/25 text-parchment hover:border-gold/60",
            )}
          >
            <input type="radio" name={name} value={option} checked={value === i} onChange={() => onChange(i)} className="sr-only" />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * Renders only what has been configured in src/content/products.ts:
 * - sizes/prices from `offers`, grind options from `grinds`;
 * - "Buy" only for a verified (non-placeholder) product with a checkout link
 *   (the offer's own, else NEXT_PUBLIC_SHOP_URL);
 * - otherwise "Notify me", which collects an email via /api/waitlist.
 * With nothing configured there is no price, no pickers — just the sign-up.
 */
export function PurchasePanel({ product, className }: { product: Product; className?: string }) {
  const id = useId();
  const [offerIndex, setOfferIndex] = useState(0);
  const [grindIndex, setGrindIndex] = useState(0);
  const [notifyOpen, setNotifyOpen] = useState(false);

  const offer = product.offers[offerIndex];
  const grind = product.grinds[grindIndex];
  const checkout = product.placeholder ? "" : offer?.checkoutUrl || SHOP_URL;
  const selection = [offer?.size, grind].filter(Boolean).join(" · ");
  const list = ["notify", product.slug, ...(offer ? [listPart(offer.size)] : []), ...(grind ? [listPart(grind)] : [])].join(":");

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {product.offers.length > 1 && (
        <Choice legend="Size" name={`${id}-size`} options={product.offers.map((o) => o.size)} value={offerIndex} onChange={setOfferIndex} />
      )}
      {product.grinds.length > 0 && (
        <Choice legend="Grind" name={`${id}-grind`} options={product.grinds} value={grindIndex} onChange={setGrindIndex} />
      )}

      <div className="flex flex-wrap items-center gap-6">
        {offer ? (
          <p className="font-display text-4xl font-light text-cream" aria-live="polite">
            {formatPrice(offer.price)}
            {product.offers.length === 1 && <span className="ml-3 font-sans text-sm text-mist">{offer.size}</span>}
          </p>
        ) : (
          <p className="text-sm text-mist">Ordering isn&apos;t open yet.</p>
        )}
        <Magnetic>
          {checkout ? (
            <a href={checkout} className={buttonClasses("gold")} rel="noopener">
              <span className="relative z-10">Buy {product.name}</span>
              <ArrowIcon />
            </a>
          ) : (
            <button type="button" onClick={() => setNotifyOpen(true)} className={buttonClasses("gold")}>
              <span className="relative z-10">Notify me</span>
              <ArrowIcon />
            </button>
          )}
        </Magnetic>
      </div>

      <Dialog open={notifyOpen} onClose={() => setNotifyOpen(false)} labelledBy={`${id}-notify`}>
        <div className="p-8 md:p-12">
          <p className="eyebrow">Notify me</p>
          <h2 id={`${id}-notify`} className="mt-3 font-display text-4xl font-light text-cream md:text-5xl">
            {product.name}
            {selection && <em className="ml-3 text-2xl text-gold-bright md:text-3xl">{selection}</em>}
          </h2>
          <p className="mt-4 max-w-md text-mist">
            Leave your email and we&apos;ll let you know when {product.name} is available to order.
          </p>
          <WaitlistForm key={list} list={list} cta="Notify me" className="mt-8" />
        </div>
      </Dialog>
    </div>
  );
}
