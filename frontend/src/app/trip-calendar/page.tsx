import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getDepartures } from "@/lib/api";
import type { Departure } from "@/lib/types";
import Breadcrumb from "@/components/Breadcrumb";

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

function anchorFor(month: string) {
  return month.toLowerCase().replace(/\s+/g, "-");
}

function formatShort(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });
}

export default async function TripCalendarPage() {
  const departures = await getDepartures();

  const byMonth = new Map<string, Departure[]>();
  for (const departure of departures) {
    const key = monthKey(departure.start_date);
    byMonth.set(key, [...(byMonth.get(key) ?? []), departure]);
  }
  const months = Array.from(byMonth.keys());
  const seasonYear = departures[0]
    ? new Date(departures[0].start_date).getFullYear()
    : new Date().getFullYear();

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink">
        <Image src="/images/gobi-dunes.svg" alt="" fill className="object-cover opacity-90" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/65" />
        <div className="container-site relative py-16 text-white lg:py-24">
          <Breadcrumb light items={[{ label: "Trip Calendar" }]} />
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Welcome to Trip Calendar {seasonYear}!
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-white/85">
            We have been developing tours for small groups since 2004. Here are
            the details of our small group tours with guaranteed departure
            dates — the best option for those who are eager to see all of
            Mongolia&apos;s most popular places at a reasonable price.
          </p>
        </div>
      </section>

      {/* month tabs */}
      {months.length > 0 && (
        <nav
          aria-label="Months"
          className="sticky top-[61px] z-30 border-b border-slate-200 bg-white"
        >
          <div className="container-site no-scrollbar flex gap-6 overflow-x-auto">
            {months.map((month) => (
              <a
                key={month}
                href={`#${anchorFor(month)}`}
                className="shrink-0 border-b-[3px] border-transparent py-3.5 text-sm font-bold text-slate-600 transition-colors hover:border-primary-700 hover:text-primary-700"
              >
                {month.split(" ")[0]}
                <span className="ml-1 text-xs font-semibold text-slate-400">
                  {month.split(" ")[1]}
                </span>
              </a>
            ))}
          </div>
        </nav>
      )}

      <section className="section !pt-10">
        <div className="container-site">
          {months.length === 0 && (
            <div className="rounded-xl bg-slate-50 p-14 text-center">
              <p className="text-lg font-extrabold text-slate-800">
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

          {months.map((month) => (
            <div key={month} id={anchorFor(month)} className="mb-12 scroll-mt-36">
              <h2 className="mb-4 text-2xl font-extrabold text-slate-900">{month}</h2>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[760px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      <th className="px-5 py-3.5">Date</th>
                      <th className="px-5 py-3.5">Tour</th>
                      <th className="px-5 py-3.5">Duration</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5">Tour info</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {byMonth.get(month)!.map((d) => (
                      <tr key={d.id} className="align-top transition-colors hover:bg-blush/50">
                        <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-700">
                          {formatShort(d.start_date)} – {formatShort(d.end_date)}
                        </td>
                        <td className="px-5 py-4">
                          <Link
                            href={`/tours/${d.tour?.slug}#book`}
                            className="font-bold text-primary-700 hover:text-primary-900 hover:underline"
                          >
                            {d.tour?.title}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                          {d.tour?.duration_days} days
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <span
                            className={`font-bold ${
                              d.status === "guaranteed" ? "text-wa-700" : "text-slate-600"
                            }`}
                          >
                            {d.status === "guaranteed"
                              ? `${d.seats_left} seats left`
                              : "Bookings open"}
                          </span>
                        </td>
                        <td className="max-w-md px-5 py-4 text-[13px] leading-relaxed text-slate-500">
                          {d.tour?.excerpt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
