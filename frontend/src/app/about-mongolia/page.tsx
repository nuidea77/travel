import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { getHome, getPage } from "@/lib/api";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Mongolia",
  description:
    "The essential country guide: history, nomadic culture, landscapes and the destinations that define Mongolia.",
};

export default async function AboutMongoliaPage() {
  const [page, home] = await Promise.all([getPage("about-mongolia"), getHome()]);
  if (!page) notFound();

  return (
    <>
      <PageHero title={page.title} subtitle={page.subtitle} image={page.image} />
      <section className="section !pt-12">
        <div className="container-site">
          <div
            className="prose-site mx-auto max-w-3xl"
            dangerouslySetInnerHTML={{ __html: page.body }}
          />
        </div>
      </section>

      <section id="destinations" className="section bg-slate-50">
        <div className="container-site">
          <SectionHeading
            eyebrow="Where to go"
            title="Destinations"
            lead="Ten regions, ten different Mongolias. Tap any of them to see the tours that visit."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {home.destinations.map((dest) => (
              <Link
                key={dest.id}
                href={`/tours?destination=${dest.slug}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={dest.image ?? "/images/hero-steppe.svg"}
                    alt={dest.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="img-zoom object-cover"
                  />
                  {dest.region && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-700">
                      {dest.region}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="flex items-center gap-1.5 font-extrabold text-slate-900 group-hover:text-primary-700">
                    <MapPin size={15} className="text-primary-600" />
                    {dest.name}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-slate-600">
                    {dest.description}
                  </p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-wide text-primary-600">
                    {dest.tours_count ?? 0} tours →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
