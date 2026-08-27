import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPage, getSettings } from "@/lib/api";
import PageHero from "@/components/PageHero";
import HelpCard from "@/components/HelpCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Car Rental",
  description:
    "Land Cruisers, UAZ vans and minibuses with professional drivers for your own Mongolian expedition.",
};

export default async function CarRentalPage() {
  const [page, settings] = await Promise.all([getPage("car-rental"), getSettings()]);
  if (!page) notFound();

  return (
    <>
      <PageHero title={page.title} subtitle={page.subtitle} image={page.image} />
      <section className="section !pt-12">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_360px]">
          <div>
            <div
              className="prose-site max-w-3xl"
              dangerouslySetInnerHTML={{ __html: page.body }}
            />
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact" className="btn-primary btn-md">
                Request a quote
              </Link>
              <Link href="/tours" className="btn-outline btn-md">
                Or take a guided tour
              </Link>
            </div>
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <HelpCard settings={settings} />
          </aside>
        </div>
      </section>
    </>
  );
}
