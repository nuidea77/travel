"use client";

import { useState } from "react";
import { BedDouble, ChevronDown, Route } from "lucide-react";
import type { ItineraryDay } from "@/lib/types";

function mealsLabel(meals: string | null): string {
  if (!meals) return "—";
  const map: Record<string, string> = { B: "Breakfast", L: "Lunch", D: "Dinner" };
  return meals
    .split("+")
    .map((m) => map[m.trim()] ?? m.trim())
    .join(" · ");
}

export default function ItineraryAccordion({ days }: { days: ItineraryDay[] }) {
  const [open, setOpen] = useState<number | null>(1);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      {days.map((day) => {
        const isOpen = open === day.day_number;
        return (
          <div key={day.id} className="border-b border-slate-100 last:border-b-0">
            <button
              className={`flex w-full items-center gap-4 px-5 py-4 text-left transition-colors ${
                isOpen ? "bg-primary-50/50" : "hover:bg-slate-50"
              }`}
              onClick={() => setOpen(isOpen ? null : day.day_number)}
              aria-expanded={isOpen}
            >
              <span className="w-14 shrink-0 text-sm font-extrabold text-primary-700">
                Day {day.day_number}
              </span>
              <span className="flex-1 text-[15px] font-bold text-slate-900">
                {day.title}
              </span>
              <span className="hidden shrink-0 text-xs font-semibold text-slate-400 md:block">
                {mealsLabel(day.meals)}
              </span>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all ${
                  isOpen
                    ? "border-primary-700 bg-primary-700 text-white"
                    : "border-slate-300 text-slate-400"
                }`}
              >
                <ChevronDown
                  size={14}
                  className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </span>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 md:pl-[76px]">
                <p className="text-sm leading-relaxed text-slate-600">
                  {day.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
                  <span className="md:hidden">Meals: {mealsLabel(day.meals)}</span>
                  {day.accommodation && (
                    <span className="flex items-center gap-1.5">
                      <BedDouble size={13} className="text-primary-700" />
                      {day.accommodation}
                    </span>
                  )}
                  {day.distance && (
                    <span className="flex items-center gap-1.5">
                      <Route size={13} className="text-primary-700" />
                      {day.distance}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
