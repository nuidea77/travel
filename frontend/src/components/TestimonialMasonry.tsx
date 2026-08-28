"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";

const FLAGS: Record<string, string> = {
  "united kingdom": "🇬🇧",
  "united states": "🇺🇸",
  italy: "🇮🇹",
  germany: "🇩🇪",
  japan: "🇯🇵",
  ireland: "🇮🇪",
  france: "🇫🇷",
  australia: "🇦🇺",
  sweden: "🇸🇪",
  canada: "🇨🇦",
  netherlands: "🇳🇱",
  spain: "🇪🇸",
};

const AVATAR_COLORS = [
  "bg-primary-700",
  "bg-slate-700",
  "bg-amber-700",
  "bg-emerald-800",
  "bg-cyan-800",
  "bg-rose-800",
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export default function TestimonialMasonry({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? testimonials : testimonials.slice(0, 6);

  if (testimonials.length === 0) return null;

  return (
    <div>
      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
        {visible.map((t, i) => (
          <figure
            key={t.id}
            className="break-inside-avoid rounded-xl bg-white p-6 shadow-card"
          >
            <span className="font-serif text-5xl leading-none text-primary-700" aria-hidden>
              “
            </span>
            <blockquote className="-mt-3 text-sm leading-relaxed text-slate-600">
              {t.body}
            </blockquote>
            <div className="mt-4 flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
              {Array.from({ length: t.rating }).map((_, s) => (
                <Star key={s} size={14} className="fill-accent-400 text-accent-400" />
              ))}
            </div>
            <figcaption className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                aria-hidden
              >
                {initials(t.name)}
              </span>
              <div className="min-w-0 text-sm">
                <p className="truncate font-bold text-slate-800">{t.name}</p>
                <p className="truncate text-xs text-slate-500">
                  {FLAGS[t.country.toLowerCase()] ?? "🌍"} {t.country}
                </p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
      {testimonials.length > 6 && (
        <div className="mt-4 text-center">
          <button onClick={() => setExpanded((v) => !v)} className="btn-outline btn-md">
            {expanded ? "Show fewer reviews" : "See more reviews"}
          </button>
        </div>
      )}
    </div>
  );
}
