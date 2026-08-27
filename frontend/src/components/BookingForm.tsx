"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { postJson } from "@/lib/api";
import type { Departure } from "@/lib/types";

export default function BookingForm({
  tourId,
  tourTitle,
  departures = [],
}: {
  tourId: number;
  tourTitle: string;
  departures?: Departure[];
}) {
  const [state, setState] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setState("submitting");

    const form = new FormData(e.currentTarget);
    const departureId = form.get("departure_id");
    const res = await postJson("/bookings", {
      tour_id: tourId,
      departure_id: departureId ? Number(departureId) : null,
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone") || null,
      country: form.get("country") || null,
      travelers: Number(form.get("travelers") ?? 1),
      preferred_date: form.get("preferred_date") || null,
      message: form.get("message") || null,
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
        <h3 className="mt-3 text-lg font-bold text-slate-900">Request received!</h3>
        <p className="mt-1 text-sm text-slate-600">
          Thank you for your interest in the {tourTitle}. Our travel
          specialists will reply within 24 hours.
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="bf-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
            Full name *
          </label>
          <input id="bf-name" name="name" required maxLength={120} className={inputCls} placeholder="Jane Traveler" />
        </div>
        <div>
          <label htmlFor="bf-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
            Email *
          </label>
          <input id="bf-email" name="email" type="email" required maxLength={190} className={inputCls} placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="bf-phone" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
            Phone / WhatsApp
          </label>
          <input id="bf-phone" name="phone" maxLength={60} className={inputCls} placeholder="+1 555 000 0000" />
        </div>
        <div>
          <label htmlFor="bf-country" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
            Country
          </label>
          <input id="bf-country" name="country" maxLength={90} className={inputCls} placeholder="United States" />
        </div>
        <div>
          <label htmlFor="bf-travelers" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
            Travelers
          </label>
          <input id="bf-travelers" name="travelers" type="number" min={1} max={99} defaultValue={2} className={inputCls} />
        </div>
        {departures.length > 0 ? (
          <div>
            <label htmlFor="bf-departure" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
              Departure
            </label>
            <select id="bf-departure" name="departure_id" className={inputCls} defaultValue="">
              <option value="">Flexible / not sure yet</option>
              {departures.map((d) => (
                <option key={d.id} value={d.id}>
                  {new Date(d.start_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  — {d.seats_left} seats left
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label htmlFor="bf-date" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
              Preferred start date
            </label>
            <input id="bf-date" name="preferred_date" type="date" className={inputCls} />
          </div>
        )}
      </div>
      <div>
        <label htmlFor="bf-message" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
          Tell us about your plans
        </label>
        <textarea
          id="bf-message"
          name="message"
          rows={4}
          maxLength={3000}
          className={inputCls}
          placeholder="Dates, group details, special requests…"
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <button type="submit" disabled={state === "submitting"} className="btn-accent btn-lg w-full">
        {state === "submitting" ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Sending…
          </>
        ) : (
          "Request booking"
        )}
      </button>
      <p className="text-center text-xs text-slate-400">
        No payment now — we confirm availability first, then arrange secure payment.
      </p>
    </form>
  );
}
