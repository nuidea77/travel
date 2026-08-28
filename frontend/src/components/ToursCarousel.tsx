"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Horizontal card rail with arrow controls (children are the slides). */
export default function ToursCarousel({
  children,
  heading,
  lead,
}: {
  children: React.ReactNode[];
  heading: string;
  lead?: string;
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
    el.scrollBy({ left: dir * (el.clientWidth * 0.9), behavior: "smooth" });
  };

  const arrowCls =
    "rounded-full border border-slate-300 p-2.5 text-slate-700 transition-all hover:border-primary-700 hover:text-primary-700 disabled:border-slate-200 disabled:text-slate-300";

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
            {heading}
          </h2>
          {lead && <p className="mt-2 text-slate-500">{lead}</p>}
        </div>
        <div className="hidden shrink-0 gap-2.5 sm:flex">
          <button onClick={() => scrollBy(-1)} disabled={!canPrev} aria-label="Previous" className={arrowCls}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => scrollBy(1)} disabled={!canNext} aria-label="Next" className={arrowCls}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div
        ref={trackRef}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-4 pb-2"
      >
        {children.map((child, i) => (
          <div key={i} className="w-[86%] shrink-0 snap-start sm:w-[46%] lg:w-[31.5%] xl:w-[23.5%]">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
