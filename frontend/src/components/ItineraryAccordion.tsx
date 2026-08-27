"use client";

import { useState } from "react";
import { BedDouble, ChevronDown, Route, UtensilsCrossed } from "lucide-react";
import type { ItineraryDay } from "@/lib/types";

export default function ItineraryAccordion({ days }: { days: ItineraryDay[] }) {
  const [open, setOpen] = useState<number | null>(1);

  return (
    <div className="space-y-3">
      {days.map((day) => {
        const isOpen = open === day.day_number;
        return (
          <div
            key={day.id}
            className={`overflow-hidden rounded-2xl border transition-colors ${
              isOpen ? "border-primary-200 bg-primary-50/40" : "border-slate-200 bg-white"
            }`}
          >
            <button
              className="flex w-full items-center gap-4 px-5 py-4 text-left"
              onClick={() => setOpen(isOpen ? null : day.day_number)}
              aria-expanded={isOpen}
            >
              <span
                className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl text-white ${
                  isOpen ? "bg-primary-600" : "bg-slate-400"
                }`}
              >
                <span className="text-[9px] font-bold uppercase leading-none">Day</span>
                <span className="text-base font-extrabold leading-tight">
                  {day.day_number}
                </span>
              </span>
              <span className="flex-1 text-[15px] font-bold text-slate-900">
                {day.title}
              </span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-slate-400 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pl-[80px]">
                <p className="text-sm leading-relaxed text-slate-600">
                  {day.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
                  {day.meals && (
                    <span className="flex items-center gap-1.5">
                      <UtensilsCrossed size={13} className="text-primary-600" />
                      Meals: {day.meals}
                    </span>
                  )}
                  {day.accommodation && (
                    <span className="flex items-center gap-1.5">
                      <BedDouble size={13} className="text-primary-600" />
                      {day.accommodation}
                    </span>
                  )}
                  {day.distance && (
                    <span className="flex items-center gap-1.5">
                      <Route size={13} className="text-primary-600" />
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
