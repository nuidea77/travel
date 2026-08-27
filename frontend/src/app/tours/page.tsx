import type { Metadata } from "next";
import Image from "next/image";
import { getSettings, getTourFilters, getTours } from "@/lib/api";
import TourCard from "@/components/TourCard";
import TourFilters from "@/components/TourFilters";
import ToursToolbar from "@/components/ToursToolbar";
import Pagination from "@/components/Pagination";
import HelpCard from "@/components/HelpCard";

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
      <section className="relative isolate overflow-hidden">
        <Image src="/images/altai-peaks.svg" alt="" fill className="object-cover" aria-hidden />
        <div className="absolute inset-0 bg-primary-950/65" />
        <div className="container-site relative py-16 text-center text-white lg:py-20">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl">
            Mongolia tours
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-primary-50/90">
            Every route below runs as a small group departure or a private
            journey on your dates — filter to find yours.
          </p>
        </div>
      </section>

      <section className="section !pt-10 bg-slate-50">
        <div className="container-site grid gap-8 lg:grid-cols-[290px_1fr]">
          <aside className="space-y-6">
            <TourFilters options={filters} />
            <div className="hidden lg:block">
              <HelpCard settings={settings} />
            </div>
          </aside>

          <div>
            <ToursToolbar total={tours.total} />
            {tours.data.length === 0 ? (
              <div className="mt-8 rounded-2xl bg-white p-14 text-center shadow-card">
                <p className="text-lg font-bold text-slate-800">
                  No tours match those filters
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Try removing a filter — or tell us what you&apos;re looking for
                  and we&apos;ll design it privately.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
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
        </div>
      </section>
    </>
  );
}
