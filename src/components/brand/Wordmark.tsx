import { cn } from "@/lib/cn";

type WordmarkProps = {
  className?: string;
  withCoffee?: boolean;
};

/** "MAHVÉ" set in Cinzel like the signage, with the ruled "COFFEE" sub-line. */
export function Wordmark({ className, withCoffee = false }: WordmarkProps) {
  return (
    <span className={cn("inline-flex flex-col items-center leading-none", className)}>
      <span className="font-caps font-medium tracking-[0.2em]">MAHVÉ</span>
      {withCoffee && (
        <span className="mt-[0.45em] flex items-center gap-[0.6em] font-caps text-[0.32em] tracking-[0.55em] text-gold/80">
          <span aria-hidden className="h-px w-[2.2em] bg-current opacity-60" />
          COFFEE
          <span aria-hidden className="h-px w-[2.2em] bg-current opacity-60" />
        </span>
      )}
    </span>
  );
}
