import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, Users } from "lucide-react";
import { getDepartures } from "@/lib/api";
import type { Departure } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trip Calendar",
  description:
    "All upcoming small-group departures across Mongolia, month by month. Guaranteed departures marked.",
};

function monthKey(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default async function TripCalendarPage() {
  const departures = await getDepartures();

  const byMonth = new Map<string, Departure[]>();
  for (const departure of departures) {
    const key = monthKey(departure.start_date);
    byMonth.set(key, [...(byMonth.get(key) ?? []), departure]);
  }

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <Image src="/images/naadam-festival.svg" alt="" fill className="object-cover" aria-hidden />
        <div className="absolute inset-0 bg-primary-950/65" />
        <div className="container-site relative py-16 text-center text-white lg:py-20">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl">
            Trip calendar
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-primary-50/90">
            Every scheduled small-group departure, month by month.
            &ldquo;Guaranteed&rdquo; trips run no matter what.
          </p>
        </div>
      </section>

      <section className="section bg-slate-50 !pt-10">
        <div className="container-site max-w-5xl">
          {byMonth.size === 0 && (
            <div className="rounded-2xl bg-white p-14 text-center shadow-card">
              <p className="text-lg font-bold text-slate-800">
                No scheduled departures right now
              </p>
              <p className="mt-1 text-sm text-slate-500">
                All of our tours also run privately on your dates.
              </p>
              <Link href="/tours" className="btn-primary btn-md mt-5">
                Browse tours
              </Link>
            </div>
          )}

          {Array.from(byMonth.entries()).map(([month, list]) => (
            <div key={month} className="mb-10">
              <h2 className="flex items-center gap-2.5 text-xl font-extrabold text-slate-900">
                <CalendarDays size={20} className="text-primary-600" />
                {month}
              </h2>
              <div className="mt-4 space-y-3">
                {list.map((d) => (
                  <div
                    key={d.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-card"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/tours/${d.tour?.slug}`}
                        className="font-extrabold text-slate-900 hover:text-primary-700"
                      >
                        {d.tour?.title}
                      </Link>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1">
                          <CalendarDays size={13} className="text-primary-600" />
                          {formatDate(d.start_date)} → {formatDate(d.end_date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} className="text-primary-600" />
                          {d.tour?.duration_days} days
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={13} className="text-primary-600" />
                          {d.seats_left} seats left
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                          d.status === "guaranteed"
                            ? "bg-primary-100 text-primary-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {d.status === "guaranteed" ? "Guaranteed" : "Open"}
                      </span>
                      <span className="text-lg font-extrabold text-primary-700">
                        ${Number(d.price ?? d.tour?.price_from ?? 0).toLocaleString()}
                      </span>
                      <Link href={`/tours/${d.tour?.slug}#book`} className="btn-primary btn-sm">
                        Book
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
