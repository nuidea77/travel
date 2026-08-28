import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BedDouble,
  Bus,
  CalendarClock,
  Check,
  Clock,
  MapPin,
  ShieldCheck,
  Star,
  Sun,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { getTour } from "@/lib/api";
import ItineraryAccordion from "@/components/ItineraryAccordion";
import BookingForm from "@/components/BookingForm";
import TourCard from "@/components/TourCard";
import TestimonialMasonry from "@/components/TestimonialMasonry";
import Breadcrumb from "@/components/Breadcrumb";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const tour = await getTour(params.slug);
  if (!tour) return { title: "Tour not found" };
  return { title: tour.title, description: tour.excerpt };
}

function formatRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const sm = s.toLocaleDateString("en-US", { month: "short" });
  const em = e.toLocaleDateString("en-US", { month: "short" });
  return `${s.getFullYear()} ${sm} ${s.getDate()} – ${sm === em && s.getFullYear() === e.getFullYear() ? "" : `${em} `}${e.getDate()}`;
}

const GOOD_TO_KNOW_ICONS = [Sun, BedDouble, UtensilsCrossed, Bus, ShieldCheck];

export default async function TourDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const tour = await getTour(params.slug);
  if (!tour) notFound();

  const departures = tour.departures ?? [];

  const TABS = [
    ["#overview", "Overview"],
    ["#itinerary", "Itinerary"],
    ["#price-date", "Price & Date"],
    ["#included", "What's included"],
    ["#good-to-know", "Good to know"],
    ["#reviews", "Reviews"],
  ].filter(
    ([href]) =>
      href !== "#reviews" || (tour.testimonials && tour.testimonials.length > 0),
  );

  return (
    <>
      {/* hero */}
      <section className="relative isolate overflow-hidden bg-ink">
        <Image
          src={tour.image ?? "/images/hero-steppe.svg"}
          alt={tour.title}
          fill
          priority
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/40" />
        <div className="container-site relative pb-12 pt-10 text-white lg:pb-16 lg:pt-14">
          <Breadcrumb
            light
            items={[{ label: "Tours", href: "/tours" }, { label: tour.title }]}
          />
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-white px-2.5 py-1 text-[11px] font-bold text-slate-800">
              {tour.type === "join" ? "Join in" : "Private"}
            </span>
            {tour.is_best_seller && (
              <span className="rounded-md bg-primary-700 px-2.5 py-1 text-[11px] font-bold text-white">
                Best seller
              </span>
            )}
          </div>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight lg:text-[3.2rem]">
            {tour.title}
          </h1>
          <p className="mt-3 max-w-2xl text-white/85">{tour.excerpt}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold">
            <span className="flex items-center gap-1.5">
              <Clock size={15} className="text-accent-400" />
              {tour.duration_days} {tour.duration_days === 1 ? "day" : "days"}
            </span>
            <span className="flex items-center gap-1.5">
              <Star size={15} className="fill-accent-400 text-accent-400" />
              {Number(tour.rating).toFixed(1)} · {tour.reviews_count} reviews
            </span>
            {tour.destinations && tour.destinations.length > 0 && (
              <span className="flex items-center gap-1.5">
                <MapPin size={15} className="text-accent-400" />
                {tour.destinations.map((d) => d.name).join(" · ")}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* tab nav */}
      <nav
        aria-label="Tour sections"
        className="sticky top-[61px] z-30 border-b border-slate-200 bg-white"
      >
        <div className="container-site no-scrollbar flex items-center gap-6 overflow-x-auto">
          {TABS.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="relative shrink-0 border-b-[3px] border-transparent py-3.5 text-sm font-bold text-slate-600 transition-colors hover:border-primary-700 hover:text-primary-700"
            >
              {label}
            </a>
          ))}
          <a
            href="#book"
            className="btn-primary btn-sm my-2 ml-auto hidden shrink-0 sm:inline-flex"
          >
            Book now
          </a>
        </div>
      </nav>

      <div className="container-site grid gap-10 py-12 lg:grid-cols-[1fr_330px]">
        {/* ── main column ── */}
        <div className="min-w-0">
          {/* overview */}
          <section id="overview" className="scroll-mt-32">
            <div className="prose-site whitespace-pre-line">{tour.overview}</div>
            {tour.highlights && (
              <div className="mt-6 rounded-xl bg-blush p-6">
                <h2 className="text-lg font-extrabold text-slate-900">What we expect</h2>
                <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {tour.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-slate-700">
                      <Check size={16} className="mt-0.5 shrink-0 text-primary-700" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* itinerary */}
          {tour.itinerary_days && tour.itinerary_days.length > 0 && (
            <section id="itinerary" className="mt-12 scroll-mt-32">
              <h2 className="text-2xl font-extrabold text-slate-900">Itinerary</h2>
              <p className="mb-5 mt-1 text-sm text-slate-500">
                Day by day tour plan with highlights, distances and activities.
              </p>
              <ItineraryAccordion days={tour.itinerary_days} />
            </section>
          )}

          {/* price & date */}
          <section id="price-date" className="mt-12 scroll-mt-32">
            <h2 className="text-2xl font-extrabold text-slate-900">Price &amp; Date</h2>
            <p className="mb-5 mt-1 text-sm text-slate-500">
              Tour cost, departure dates, and price differences.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {tour.prices && tour.prices.length > 0 && (
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="font-extrabold text-slate-900">Pax based price</h3>
                  <div className="mt-4 divide-y divide-slate-100">
                    {tour.prices.map((tier) => (
                      <div key={tier.id} className="flex items-center justify-between py-3">
                        <span className="text-sm font-semibold text-slate-600">
                          Pax {tier.min_people}–{tier.max_people}
                        </span>
                        <span className="text-lg font-extrabold text-primary-700">
                          {Number(tier.price).toLocaleString()} USD
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-slate-400">
                    Per person, depending on group size. Larger groups travel cheaper.
                  </p>
                </div>
              )}
              <div className="rounded-xl border border-slate-200 p-6">
                <h3 className="font-extrabold text-slate-900">Tour schedule</h3>
                {departures.length > 0 ? (
                  <>
                    <div className="mt-4 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
                      {departures.map((d) => (
                        <div
                          key={d.id}
                          className="flex items-center justify-between border-b border-slate-100 py-2.5"
                        >
                          <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <CalendarClock size={14} className="shrink-0 text-primary-700" />
                            {formatRange(d.start_date, d.end_date)}
                          </span>
                          <span
                            className={`text-[11px] font-bold ${
                              d.status === "guaranteed" ? "text-wa-700" : "text-slate-400"
                            }`}
                          >
                            {d.status === "guaranteed"
                              ? `${d.seats_left} seats left`
                              : "Open"}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-slate-400">
                      If any of the listed group dates do not fit your schedule,{" "}
                      <Link href="/contact" className="font-bold text-primary-700 hover:underline">
                        contact us
                      </Link>{" "}
                      for your own private booking.
                    </p>
                  </>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">
                    This tour runs privately on your dates —{" "}
                    <Link href="/contact" className="font-bold text-primary-700 hover:underline">
                      tell us when you want to travel
                    </Link>
                    .
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* included / excluded */}
          <section id="included" className="mt-12 scroll-mt-32">
            <h2 className="text-2xl font-extrabold text-slate-900">What&apos;s included</h2>
            <p className="mb-5 mt-1 text-sm text-slate-500">
              Accommodation, transport, meals, guide and full service inclusions.
            </p>
            <div className="space-y-5">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
                <h3 className="font-extrabold text-emerald-900">Services included</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(tour.included ?? []).map((item) => (
                    <span
                      key={item}
                      className="flex items-center gap-1.5 rounded-md border border-emerald-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700"
                    >
                      <Check size={13} className="shrink-0 text-emerald-600" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-6">
                <h3 className="font-extrabold text-primary-900">Services not included</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(tour.excluded ?? []).map((item) => (
                    <span
                      key={item}
                      className="flex items-center gap-1.5 rounded-md border border-primary-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700"
                    >
                      <X size={13} className="shrink-0 text-primary-600" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* good to know */}
          {tour.good_to_know && tour.good_to_know.length > 0 && (
            <section id="good-to-know" className="mt-12 scroll-mt-32">
              <h2 className="text-2xl font-extrabold text-slate-900">Good to know</h2>
              <p className="mb-5 mt-1 text-sm text-slate-500">
                Important tips, weather, packing advice, and local travel notes.
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                {tour.good_to_know.map((item, i) => {
                  const Icon = GOOD_TO_KNOW_ICONS[i % GOOD_TO_KNOW_ICONS.length];
                  return (
                    <div key={item.title} className="rounded-xl bg-slate-50 p-6">
                      <Icon size={22} className="text-primary-700" />
                      <h3 className="mt-3 font-extrabold text-slate-900">{item.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                        {item.body}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* reviews */}
          {tour.testimonials && tour.testimonials.length > 0 && (
            <section id="reviews" className="mt-12 scroll-mt-32">
              <h2 className="text-2xl font-extrabold text-slate-900">Reviews</h2>
              <p className="mb-5 mt-1 text-sm text-slate-500">
                Genuine traveler feedback from this experience in Mongolia.
              </p>
              <TestimonialMasonry testimonials={tour.testimonials} />
            </section>
          )}

          {/* booking */}
          <section id="book" className="mt-12 scroll-mt-32">
            <div className="rounded-xl border border-slate-200 p-6 lg:p-8">
              <h2 className="text-2xl font-extrabold text-slate-900">Book this tour</h2>
              <p className="mb-6 mt-1 text-sm text-slate-500">
                No payment now — we confirm availability first, then arrange
                secure payment.
              </p>
              <BookingForm
                tourId={tour.id}
                tourTitle={tour.title}
                departures={departures}
              />
            </div>
          </section>
        </div>

        {/* ── sidebar ── */}
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="overflow-hidden rounded-xl border border-slate-200 shadow-card">
            <div className="bg-blush px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">From</p>
              <p className="text-3xl font-extrabold text-primary-700">
                {Number(tour.price_from).toLocaleString()} USD
                <span className="text-sm font-semibold text-slate-500"> /person</span>
              </p>
            </div>
            <div className="space-y-2.5 p-6">
              <a href="#book" className="btn-primary btn-md w-full">
                Book now
              </a>
              <Link href="/contact" className="btn-outline btn-md w-full">
                Inquire now
              </Link>
              <ul className="space-y-2 pt-3 text-[13px] text-slate-600">
                <li className="flex items-start gap-2">
                  <Check size={14} className="mt-0.5 shrink-0 text-wa-700" />
                  Free cancellation up to 30 days before departure
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="mt-0.5 shrink-0 text-wa-700" />
                  {tour.duration_days}-day {tour.type === "join" ? "small group" : "private"} tour
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="mt-0.5 shrink-0 text-wa-700" />
                  Local team, replies within 24 hours
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* related */}
      {tour.related && tour.related.length > 0 && (
        <section className="section bg-slate-50">
          <div className="container-site">
            <Reveal>
              <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-slate-900">
                Related tours
              </h2>
            </Reveal>
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {tour.related.map((t, i) => (
                <Reveal key={t.id} delay={i * 90}>
                  <TourCard tour={t} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
