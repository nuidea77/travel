"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Check, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import type { TourFilterOptions } from "@/lib/types";

const FILTER_KEYS = ["type", "category", "destination", "duration"] as const;

export default function TourFilters({ options }: { options: TourFilterOptions }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchParams.get(key) === value) {
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

  const checkbox = (key: string, value: string, label: string) => {
    const active = searchParams.get(key) === value;
    return (
      <button
        key={value}
        onClick={() => setParam(key, value)}
        className="flex w-full items-center gap-2.5 py-[7px] text-left text-sm text-slate-700 transition-colors hover:text-primary-700"
      >
        <span
          className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
            active
              ? "border-primary-700 bg-primary-700 text-white"
              : "border-slate-300 bg-white"
          }`}
          aria-hidden
        >
          {active && <Check size={12} strokeWidth={3.5} />}
        </span>
        <span className={active ? "font-bold text-primary-800" : ""}>{label}</span>
      </button>
    );
  };

  const box = (title: string, body: React.ReactNode, tint = false) => (
    <section className={`rounded-xl p-5 ${tint ? "bg-amber-50" : "bg-slate-50"}`}>
      <h3 className="mb-2 text-[15px] font-extrabold text-slate-900">{title}</h3>
      {body}
    </section>
  );

  const content = (
    <div className="space-y-4">
      {hasActive && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 text-xs font-bold text-primary-700 hover:text-primary-900"
        >
          <RotateCcw size={12} /> Reset all filters
        </button>
      )}
      {box(
        "Tour type",
        <div>{options.types.map((t) => checkbox("type", t.value, t.label))}</div>,
        true,
      )}
      {box(
        "Theme",
        <div>{options.categories.map((c) => checkbox("category", c.slug, c.name))}</div>,
      )}
      {box(
        "Duration",
        <div>{options.durations.map((d) => checkbox("duration", d.value, d.label))}</div>,
      )}
      {box(
        "Destination",
        <div>{options.destinations.map((d) => checkbox("destination", d.slug, d.name))}</div>,
      )}
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
          <span className="rounded-full bg-primary-700 px-2 py-0.5 text-[11px] font-bold text-white">
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
          <div className="absolute inset-y-0 right-0 w-[85%] max-w-sm overflow-y-auto bg-white p-6">
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
      <div className="hidden lg:block">{content}</div>
    </>
  );
}
