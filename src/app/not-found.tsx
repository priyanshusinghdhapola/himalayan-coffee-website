import { HimalayaRidges } from "@/components/brand/HimalayaRidges";
import { TransitionLink } from "@/components/providers/PageTransition";
import { ArrowIcon, buttonClasses } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 text-center">
      <HimalayaRidges id="nf" palette="dawn" className="absolute inset-x-0 bottom-0 h-[60%] w-full opacity-80" />
      <div className="relative">
        <p className="eyebrow">404 · Off the trail</p>
        <h1 className="mt-6 font-display text-6xl font-light text-cream md:text-8xl">
          This path leads <em className="text-gold-bright">nowhere</em>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-mist">Even the best trekkers take a wrong turn. The way back down is this way.</p>
        <TransitionLink href="/" className={buttonClasses("gold", "mt-10")}>
          <span className="relative z-10">Return to the hills</span>
          <ArrowIcon />
        </TransitionLink>
      </div>
    </section>
  );
}
