import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Clock, Star } from "lucide-react";
import type { Tour } from "@/lib/types";

export default function TourCard({ tour }: { tour: Tour }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover">
      <Link
        href={`/tours/${tour.slug}`}
        className="relative block aspect-[3/2] overflow-hidden"
      >
        <Image
          src={tour.image ?? "/images/hero-steppe.svg"}
          alt={tour.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="img-zoom object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
        <div className="absolute left-3 top-3 flex gap-2">
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm ${
              tour.type === "join" ? "bg-primary-600" : "bg-slate-800"
            }`}
          >
            {tour.type === "join" ? "Join in" : "Private"}
          </span>
          {tour.is_best_seller && (
            <span className="rounded-full bg-accent-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-950 shadow-sm">
              Best seller
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-3 text-xs font-bold text-white drop-shadow">
          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            {tour.duration_days} {tour.duration_days === 1 ? "day" : "days"}
          </span>
          <span className="flex items-center gap-1">
            <Star size={13} className="fill-accent-400 text-accent-400" />
            {Number(tour.rating).toFixed(1)}
            <span className="font-semibold text-white/70">({tour.reviews_count})</span>
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-semibold leading-snug text-slate-900">
          <Link href={`/tours/${tour.slug}`} className="transition-colors hover:text-primary-700">
            {tour.title}
          </Link>
        </h3>

        {tour.highlights && (
          <ul className="mt-3 space-y-1.5">
            {tour.highlights.slice(0, 3).map((h) => (
              <li
                key={h}
                className="flex items-start gap-2 text-[13px] leading-snug text-slate-600"
              >
                <Check size={14} className="mt-0.5 shrink-0 text-primary-500" />
                {h}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-4">
          <p className="pt-1 text-sm text-slate-500">
            From{" "}
            <span className="text-xl font-extrabold text-primary-700">
              ${Number(tour.price_from).toLocaleString()}
            </span>
            <span className="text-xs"> /person</span>
          </p>
          <Link href={`/tours/${tour.slug}`} className="btn-primary btn-sm">
            Discover
            <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
