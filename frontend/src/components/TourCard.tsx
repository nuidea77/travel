import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Tour } from "@/lib/types";

/** Diagonal photo-collage header, in the style of the reference design. */
function SlicedImage({ image, alt }: { image: string; alt: string }) {
  const slices = [
    { clip: "polygon(0 0, 39% 0, 26% 100%, 0 100%)", pos: "left center" },
    { clip: "polygon(41% 0, 73% 0, 60% 100%, 28% 100%)", pos: "center center" },
    { clip: "polygon(75% 0, 100% 0, 100% 100%, 62% 100%)", pos: "right center" },
  ];
  return (
    <div className="relative aspect-[16/9] overflow-hidden bg-white">
      {slices.map((slice, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{ clipPath: slice.clip }}
        >
          <Image
            src={image}
            alt={i === 0 ? alt : ""}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="img-zoom object-cover"
            style={{ objectPosition: slice.pos, transform: `scale(${1.06 + i * 0.06})` }}
          />
        </div>
      ))}
    </div>
  );
}

export default function TourCard({ tour }: { tour: Tour }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <Link href={`/tours/${tour.slug}`} className="relative block">
        <SlicedImage image={tour.image ?? "/images/hero-steppe.svg"} alt={tour.title} />
        <span className="absolute left-3 top-3 rounded-md bg-white px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-sm">
          {tour.type === "join" ? "Join in" : "Private"}
        </span>
        {tour.is_best_seller && (
          <span className="absolute left-3 top-10 rounded-md bg-primary-700 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
            Best seller
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <h3 className="text-lg font-extrabold leading-snug text-slate-900">
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
                <span className="mt-[7px] h-[3px] w-2.5 shrink-0 rounded-full bg-primary-600" aria-hidden />
                {h}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <p className="pt-0.5 text-[13px] font-semibold text-slate-700">
            {tour.duration_days} {tour.duration_days === 1 ? "day" : "days"}
            <span className="mx-1.5 text-slate-300">·</span>
            from {Number(tour.price_from).toLocaleString()} USD
          </p>
          <Link
            href={`/tours/${tour.slug}`}
            className="flex items-center gap-2 text-sm font-bold text-primary-700 transition-colors hover:text-primary-900"
          >
            Discover
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-primary-300 transition-all group-hover:border-primary-700 group-hover:bg-primary-700 group-hover:text-white">
              <ArrowRight size={13} />
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
