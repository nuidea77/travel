import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  Check,
  Clock,
  MapPin,
  Quote,
  Star,
  Users,
  X,
} from "lucide-react";
import { getTour } from "@/lib/api";
import ItineraryAccordion from "@/components/ItineraryAccordion";
import BookingForm from "@/components/BookingForm";
import TourCard from "@/components/TourCard";
import SectionHeading from "@/components/SectionHeading";

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

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function TourDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const tour = await getTour(params.slug);
  if (!tour) notFound();

  const departures = tour.departures ?? [];

  return (
    <>
      {/* hero */}
      <section className="relative isolate overflow-hidden">
        <Image
          src={tour.image ?? "/images/hero-steppe.svg"}
          alt={tour.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/85 via-primary-950/40 to-primary-950/30" />
        <div className="container-site relative pb-14 pt-24 text-white lg:pb-20 lg:pt-32">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                tour.type === "join" ? "bg-primary-500" : "bg-slate-700"
              }`}
            >
              {tour.type === "join" ? "Join a group" : "Private tour"}
            </span>
            {tour.is_best_seller && (
              <span className="rounded-full bg-accent-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-950">
                Best seller
              </span>
            )}
            {tour.categories?.map((c) => (
              <Link
                key={c.id}
                href={`/tours?category=${c.slug}`}
                className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide backdrop-blur hover:bg-white/25"
              >
                {c.name}
              </Link>
            ))}
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight lg:text-5xl">
            {tour.title}
          </h1>
          <p className="mt-3 max-w-2xl text-primary-50/90">{tour.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold">
            <span className="flex items-center gap-1.5">
              <Clock size={16} className="text-accent-400" />
              {tour.duration_days} {tour.duration_days === 1 ? "day" : "days"}
            </span>
            <span className="flex items-center gap-1.5">
              <Star size={16} className="fill-accent-400 text-accent-400" />
              {Number(tour.rating).toFixed(1)} · {tour.reviews_count} reviews
            </span>
            {tour.destinations && tour.destinations.length > 0 && (
              <span className="flex items-center gap-1.5">
                <MapPin size={16} className="text-accent-400" />
                {tour.destinations.map((d) => d.name).join(" · ")}
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="container-site section grid gap-12 !pt-12 lg:grid-cols-[1fr_380px]">
        {/* ── main column ── */}
        <div className="min-w-0">
          {/* overview */}
          <section id="overview">
            <h2 className="text-2xl font-extrabold text-slate-900">Overview</h2>
            <div className="prose-site mt-4 whitespace-pre-line">{tour.overview}</div>
            {tour.highlights && (
              <div className="mt-6 rounded-2xl bg-primary-50 p-6">
                <h3 className="font-extrabold text-slate-900">Trip highlights</h3>
                <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {tour.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-slate-700">
                      <Check size={16} className="mt-0.5 shrink-0 text-primary-600" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* itinerary */}
          {tour.itinerary_days && tour.itinerary_days.length > 0 && (
            <section id="itinerary" className="mt-12">
              <h2 className="text-2xl font-extrabold text-slate-900">
                Day-by-day itinerary
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                B = breakfast · L = lunch · D = dinner
              </p>
              <div className="mt-5">
                <ItineraryAccordion days={tour.itinerary_days} />
              </div>
            </section>
          )}

          {/* pricing */}
          {tour.prices && tour.prices.length > 0 && (
            <section id="prices" className="mt-12">
              <h2 className="text-2xl font-extrabold text-slate-900">Prices</h2>
              <p className="mt-1 text-sm text-slate-500">
                Per person, based on the size of your party. Larger groups
                travel cheaper.
              </p>
              <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full min-w-[420px] text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      <th className="px-5 py-3.5">Group size</th>
                      <th className="px-5 py-3.5">Price per person</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tour.prices.map((tier) => (
                      <tr key={tier.id} className="border-t border-slate-100">
                        <td className="px-5 py-3.5 font-semibold text-slate-800">
                          <Users size={14} className="mr-2 inline text-primary-600" />
                          {tier.min_people}–{tier.max_people} travelers
                        </td>
                        <td className="px-5 py-3.5 text-lg font-extrabold text-primary-700">
                          ${Number(tier.price).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* departures */}
          {departures.length > 0 && (
            <section id="departures" className="mt-12">
              <h2 className="text-2xl font-extrabold text-slate-900">
                Upcoming departures
              </h2>
              <div className="mt-5 space-y-3">
                {departures.map((d) => (
                  <div
                    key={d.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <CalendarDays size={18} className="text-primary-600" />
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {formatDate(d.start_date)} → {formatDate(d.end_date)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {d.seats_left} of {d.seats_total} seats left
                        </p>
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
                      <span className="font-extrabold text-primary-700">
                        ${Number(d.price ?? tour.price_from).toLocaleString()}
                      </span>
                      <a href="#book" className="btn-primary btn-sm">
                        Book
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* included / excluded */}
          <section id="included" className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-primary-100 bg-primary-50/50 p-6">
              <h2 className="text-lg font-extrabold text-slate-900">What&apos;s included</h2>
              <ul className="mt-4 space-y-2.5">
                {(tour.included ?? []).map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check size={16} className="mt-0.5 shrink-0 text-primary-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-extrabold text-slate-900">Not included</h2>
              <ul className="mt-4 space-y-2.5">
                {(tour.excluded ?? []).map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <X size={16} className="mt-0.5 shrink-0 text-slate-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* good to know */}
          {tour.good_to_know && tour.good_to_know.length > 0 && (
            <section id="good-to-know" className="mt-12">
              <h2 className="text-2xl font-extrabold text-slate-900">Good to know</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {tour.good_to_know.map((item) => (
                  <div key={item.title} className="rounded-2xl bg-slate-50 p-5">
                    <h3 className="font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* reviews */}
          {tour.testimonials && tour.testimonials.length > 0 && (
            <section id="reviews" className="mt-12">
              <h2 className="text-2xl font-extrabold text-slate-900">
                Reviews from this tour
              </h2>
              <div className="mt-5 space-y-5">
                {tour.testimonials.map((t) => (
                  <figure key={t.id} className="rounded-2xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between gap-4">
                      <figcaption>
                        <p className="font-bold text-slate-900">{t.name}</p>
                        <p className="text-xs text-slate-500">{t.country}</p>
                      </figcaption>
                      <div className="flex gap-0.5">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} size={14} className="fill-accent-400 text-accent-400" />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 font-bold text-slate-800">{t.title}</p>
                    <blockquote className="mt-1 flex gap-2 text-sm leading-relaxed text-slate-600">
                      <Quote size={16} className="mt-0.5 shrink-0 text-primary-300" />
                      {t.body}
                    </blockquote>
                  </figure>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ── sidebar ── */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div id="book" className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card">
            <p className="text-sm text-slate-500">
              From{" "}
              <span className="text-3xl font-extrabold text-primary-700">
                ${Number(tour.price_from).toLocaleString()}
              </span>{" "}
              /person
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {tour.duration_days}-day {tour.type === "join" ? "small group" : "private"} tour ·
              free cancellation up to 30 days before departure
            </p>
            <div className="mt-6">
              <BookingForm
                tourId={tour.id}
                tourTitle={tour.title}
                departures={departures}
              />
            </div>
          </div>
        </aside>
      </div>

      {/* related */}
      {tour.related && tour.related.length > 0 && (
        <section className="section bg-slate-50">
          <div className="container-site">
            <SectionHeading
              eyebrow="Keep exploring"
              title="You may also like"
            />
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {tour.related.map((t) => (
                <TourCard key={t.id} tour={t} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
