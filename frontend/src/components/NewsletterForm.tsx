"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { postJson } from "@/lib/api";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "done">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("submitting");
    const res = await postJson("/contact", {
      name: "Newsletter subscriber",
      email,
      subject: "Newsletter signup",
      message: `Please add ${email} to the newsletter list.`,
    });
    setState(res.ok ? "done" : "idle");
  }

  if (state === "done") {
    return (
      <p className="flex items-center gap-2 text-sm font-semibold text-primary-200">
        <CheckCircle2 size={17} className="text-accent-400" />
        You&apos;re on the list — see you on the steppe!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="w-full rounded-full border border-primary-700 bg-primary-900/70 px-5 py-2.5 text-sm text-white placeholder:text-primary-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
      />
      <button
        type="submit"
        disabled={state === "submitting"}
        className="btn-accent btn-md shrink-0"
        aria-label="Subscribe"
      >
        {state === "submitting" ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            <Send size={15} /> Subscribe
          </>
        )}
      </button>
    </form>
  );
}
