"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { postJson } from "@/lib/api";

export default function ContactForm({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setState("submitting");

    const form = new FormData(e.currentTarget);
    const res = await postJson("/contact", {
      name: form.get("name"),
      email: form.get("email"),
      subject: form.get("subject") || null,
      message: form.get("message"),
    });

    if (res.ok) {
      setState("done");
    } else {
      setState("idle");
      setError(res.message);
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl bg-primary-50 p-8 text-center">
        <CheckCircle2 size={40} className="mx-auto text-primary-600" />
        <h3 className="mt-3 text-lg font-bold text-slate-900">Message sent!</h3>
        <p className="mt-1 text-sm text-slate-600">
          We will get back to you within one business day.
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <div>
          <label htmlFor="cf-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
            Full name *
          </label>
          <input id="cf-name" name="name" required maxLength={120} className={inputCls} placeholder="Jane Traveler" />
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
            Email *
          </label>
          <input id="cf-email" name="email" type="email" required maxLength={190} className={inputCls} placeholder="you@example.com" />
        </div>
      </div>
      {!compact && (
        <div>
          <label htmlFor="cf-subject" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
            Subject
          </label>
          <input id="cf-subject" name="subject" maxLength={190} className={inputCls} placeholder="Planning a trip in July…" />
        </div>
      )}
      <div>
        <label htmlFor="cf-message" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
          {compact ? "Your travel plans *" : "Message *"}
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={compact ? 3 : 5}
          required
          maxLength={5000}
          className={inputCls}
          placeholder="Tell us where you want to go, when, and with whom…"
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className={`btn-primary w-full ${compact ? "btn-md" : "btn-lg"}`}
      >
        {state === "submitting" ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Sending…
          </>
        ) : compact ? (
          "Let's go"
        ) : (
          "Send message"
        )}
      </button>
    </form>
  );
}
