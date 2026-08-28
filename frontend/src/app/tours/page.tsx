import type { Metadata } from "next";
import Image from "next/image";
import { getSettings, getTourFilters, getTours } from "@/lib/api";
import TourCard from "@/components/TourCard";
import TourFilters from "@/components/TourFilters";
import ToursToolbar from "@/components/ToursToolbar";
import Pagination from "@/components/Pagination";
import HelpCard from "@/components/HelpCard";
import Breadcrumb from "@/components/Breadcrumb";
import AwardBadge from "@/components/AwardBadge";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mongolia Tours",
  description:
    "Small group and private tours across Mongolia — the Gobi, Naadam, Khuvsgul, the Altai and beyond. Filter by theme, duration and destination.",
};

type SearchParams = Record<string, string | string[] | undefined>;

export default async function ToursPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = new URLSearchParams();
  for (const key of ["type", "category", "destination", "duration", "search", "sort", "page"]) {
    const value = searchParams[key];
    if (typeof value === "string" && value) params.set(key, value);
  }

  const [tours, filters, settings] = await Promise.all([
    getTours(params),
    getTourFilters(),
    getSettings(),
  ]);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink">
        <Image src="/images/hero-steppe.svg" alt="" fill className="object-cover opacity-90" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/60" />
        <div className="container-site relative py-16 text-white lg:py-24">
          <Breadcrumb light items={[{ label: "Tours" }]} />
          <div className="mt-6 flex items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                Mongolia Tours
              </h1>
              <p className="mt-4 leading-relaxed text-white/85">
                {settings.site_name} provides a large number of tours and
                packages, all of them designed with the utmost consideration
                into what travelers like you want most out of their trip.
              </p>
            </div>
            <div className="hidden shrink-0 md:block">
              <AwardBadge size={88} />
            </div>
          </div>
        </div>
      </section>

      <section className="section !pt-10">
        <div className="container-site grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <ToursToolbar total={tours.total} />
            {tours.data.length === 0 ? (
              <div className="mt-8 rounded-xl bg-slate-50 p-14 text-center">
                <p className="text-lg font-extrabold text-slate-800">
                  No tours match those filters
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Try removing a filter — or tell us what you&apos;re looking for
                  and we&apos;ll design it privately.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-7 sm:grid-cols-2">
                {tours.data.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            )}
            <Pagination
              currentPage={tours.current_page}
              lastPage={tours.last_page}
              basePath="/tours"
              searchParams={searchParams}
            />
          </div>

          <aside className="space-y-4">
            <TourFilters options={filters} />
            <HelpCard settings={settings} />
          </aside>
        </div>
      </section>
    </>
  );
}
