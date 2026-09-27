"use client";

import { useId, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { ArrowIcon, buttonClasses } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { WaitlistForm } from "@/components/ui/WaitlistForm";
import { formatPrice, grinds, sizes, type Grind, type Product, type Size } from "@/content/products";
import { cn } from "@/lib/cn";

const SHOP_URL = process.env.NEXT_PUBLIC_SHOP_URL?.trim() || "";

function Choice<T extends string>({
  legend,
  options,
  value,
  onChange,
  name,
}: {
  legend: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  name: string;
}) {
  return (
    <fieldset>
      <legend className="eyebrow mb-3 text-[0.6rem] text-mist">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={cn(
              "cursor-pointer rounded-full border px-4 py-2 text-xs tracking-wide transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-gold-bright",
              value === option ? "border-gold bg-gold text-ink" : "border-gold/25 text-parchment hover:border-gold/60",
            )}
          >
            <input type="radio" name={name} value={option} checked={value === option} onChange={() => onChange(option)} className="sr-only" />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * Size + grind + price + Buy. "Buy" goes to the product's checkout link for
 * that size (Stripe Payment Link / Shopify permalink), else NEXT_PUBLIC_SHOP_URL,
 * else opens a pre-order sign-up — the button never dead-ends.
 */
export function PurchasePanel({ product, className }: { product: Product; className?: string }) {
  const id = useId();
  const [size, setSize] = useState<Size>("250g");
  const [grind, setGrind] = useState<Grind>("Whole bean");
  const [preorderOpen, setPreorderOpen] = useState(false);
  const checkout = product.checkout[size] || SHOP_URL;

  return (
    <div className={cn("space-y-6", className)}>
      <Choice legend="Size" name={`${id}-size`} options={sizes} value={size} onChange={setSize} />
      <Choice legend="Grind" name={`${id}-grind`} options={grinds} value={grind} onChange={setGrind} />
      <div className="flex flex-wrap items-center gap-6 pt-2">
        <p className="font-display text-4xl font-light text-cream" aria-live="polite">
          {formatPrice(product.prices[size])}
        </p>
        <Magnetic>
          {checkout ? (
            <a
              href={checkout}
              className={buttonClasses("gold")}
              data-size={size}
              data-grind={grind}
              rel="noopener"
            >
              <span className="relative z-10">Buy {product.name}</span>
              <ArrowIcon />
            </a>
          ) : (
            <button type="button" onClick={() => setPreorderOpen(true)} className={buttonClasses("gold")}>
              <span className="relative z-10">Pre-order {product.name}</span>
              <ArrowIcon />
            </button>
          )}
        </Magnetic>
      </div>
      <p className="text-xs text-smoke">Roasted to order every Monday · Ships within 48 hours · Free shipping over ₹1,500</p>

      <Dialog open={preorderOpen} onClose={() => setPreorderOpen(false)} labelledBy={`${id}-preorder`}>
        <div className="p-8 md:p-12">
          <p className="eyebrow">Pre-order</p>
          <h2 id={`${id}-preorder`} className="mt-3 font-display text-4xl font-light text-cream md:text-5xl">
            {product.name}, <em className="text-gold-bright">{size}</em> · {grind.toLowerCase()}
          </h2>
          <p className="mt-4 max-w-md text-mist">
            Our first roast of {product.name} is being allocated now. Leave your email and we&apos;ll send a private checkout link the
            morning it comes off the roaster.
          </p>
          <WaitlistForm list={`preorder:${product.slug}:${size}:${grind}`} cta="Reserve my bag" className="mt-8" />
        </div>
      </Dialog>
    </div>
  );
}
