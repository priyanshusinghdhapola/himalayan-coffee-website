"use client";

import { useId, useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { ArrowIcon, buttonClasses } from "./Button";

type WaitlistFormProps = {
  /** Which list the sign-up is for, e.g. "newsletter", "upcoming:kesar-kahwa", "preorder:buransh". */
  list: string;
  cta?: string;
  successMessage?: string;
  className?: string;
};

type Status = "idle" | "loading" | "done" | "error";

export function WaitlistForm({
  list,
  cta = "Join the waitlist",
  successMessage = "Thank you — you're on the list.",
  className,
}: WaitlistFormProps) {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), list, company: data.get("company") }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "Something went wrong. Please try again.");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <p role="status" className={cn("font-display text-xl italic text-gold-bright", className)}>
        {successMessage}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("flex flex-col gap-3 sm:flex-row", className)} noValidate={false}>
      <label htmlFor={`${id}-email`} className="sr-only">
        Email address
      </label>
      <input
        id={`${id}-email`}
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        className="min-w-0 flex-1 rounded-full border border-gold/25 bg-ink/40 px-6 py-3.5 text-sm text-cream placeholder:text-smoke focus:border-gold/70 focus:outline-none"
      />
      {/* Honeypot — real visitors never see or fill this. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] size-px opacity-0" />
      <button type="submit" disabled={status === "loading"} className={buttonClasses("gold")}>
        <span className="relative z-10">{status === "loading" ? "Sending…" : cta}</span>
        <ArrowIcon />
      </button>
      {status === "error" && (
        <p role="alert" className="text-sm text-saffron sm:basis-full">
          {error}
        </p>
      )}
    </form>
  );
}
