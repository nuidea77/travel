"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={15}
          className={
            i < count ? "fill-accent-400 text-accent-400" : "text-slate-200"
          }
        />
      ))}
    </div>
  );
}

export default function TestimonialCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    update();
    const el = trackRef.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: "smooth" });
  };

  if (testimonials.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2"
      >
        {testimonials.map((t) => (
          <figure
            key={t.id}
            className="flex w-[88%] shrink-0 snap-start flex-col rounded-2xl bg-white p-6 shadow-card sm:w-[46%] lg:w-[31.5%]"
          >
            <Quote size={26} className="text-primary-200" aria-hidden />
            <figcaption className="mt-3">
              <Stars count={t.rating} />
              <p className="mt-2 font-bold text-slate-900">{t.title}</p>
            </figcaption>
            <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
              “{t.body}”
            </blockquote>
            <div className="mt-5 border-t border-slate-100 pt-4 text-sm">
              <p className="font-bold text-slate-800">{t.name}</p>
              <p className="text-xs text-slate-500">
                {t.country}
                {t.tour && (
                  <>
                    {" · "}
                    <Link
                      href={`/tours/${t.tour.slug}`}
                      className="text-primary-600 hover:underline"
                    >
                      {t.tour.title}
                    </Link>
                  </>
                )}
              </p>
            </div>
          </figure>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={() => scrollBy(-1)}
          disabled={!canPrev}
          aria-label="Previous reviews"
          className="rounded-full border-2 border-primary-600 p-2.5 text-primary-700 transition-colors hover:bg-primary-50 disabled:border-slate-200 disabled:text-slate-300"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => scrollBy(1)}
          disabled={!canNext}
          aria-label="Next reviews"
          className="rounded-full border-2 border-primary-600 p-2.5 text-primary-700 transition-colors hover:bg-primary-50 disabled:border-slate-200 disabled:text-slate-300"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
