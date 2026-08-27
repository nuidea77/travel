"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { RotateCcw, SlidersHorizontal, X } from "lucide-react";
import type { TourFilterOptions } from "@/lib/types";

const FILTER_KEYS = ["type", "category", "destination", "duration"] as const;

export default function TourFilters({ options }: { options: TourFilterOptions }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || searchParams.get(key) === value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const clearAll = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    FILTER_KEYS.forEach((k) => params.delete(k));
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  const hasActive = FILTER_KEYS.some((k) => searchParams.get(k));

  const radio = (key: string, value: string, label: string, count?: number) => {
    const active = searchParams.get(key) === value;
    return (
      <button
        key={value}
        onClick={() => setParam(key, value)}
        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
          active
            ? "bg-primary-600 font-semibold text-white"
            : "text-slate-600 hover:bg-primary-50"
        }`}
      >
        <span>{label}</span>
        {typeof count === "number" && (
          <span
            className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-bold ${
              active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
            }`}
          >
            {count}
          </span>
        )}
      </button>
    );
  };

  const content = (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-slate-900">
          <SlidersHorizontal size={15} className="text-primary-600" /> Filter tours
        </h2>
        {hasActive && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-800"
          >
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>

      <section>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Tour type
        </h3>
        <div className="space-y-1">
          {options.types.map((t) => radio("type", t.value, t.label))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Duration
        </h3>
        <div className="space-y-1">
          {options.durations.map((d) => radio("duration", d.value, d.label))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Theme
        </h3>
        <div className="space-y-1">
          {options.categories.map((c) =>
            radio("category", c.slug, c.name, c.tours_count),
          )}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Destination
        </h3>
        <div className="space-y-1">
          {options.destinations.map((d) =>
            radio("destination", d.slug, d.name, d.tours_count),
          )}
        </div>
      </section>
    </div>
  );

  return (
    <>
      {/* mobile trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="btn-outline btn-md w-full lg:hidden"
      >
        <SlidersHorizontal size={15} /> Filters
        {hasActive && (
          <span className="rounded-full bg-primary-600 px-2 py-0.5 text-[11px] font-bold text-white">
            on
          </span>
        )}
      </button>

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto bg-white p-6">
            <button
              onClick={() => setMobileOpen(false)}
              className="mb-4 ml-auto flex rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              aria-label="Close filters"
            >
              <X size={20} />
            </button>
            {content}
          </div>
        </div>
      )}

      {/* desktop sidebar */}
      <div className="hidden rounded-2xl bg-white p-6 shadow-card lg:block">
        {content}
      </div>
    </>
  );
}
