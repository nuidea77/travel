import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPage, getSettings } from "@/lib/api";
import PageHero from "@/components/PageHero";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
  description: "A local Mongolian team guiding travelers across the steppe since 2004.",
};

export default async function AboutUsPage() {
  const [page, settings] = await Promise.all([getPage("about-us"), getSettings()]);
  if (!page) notFound();

  return (
    <>
      <PageHero title={page.title} subtitle={page.subtitle} image={page.image} />
      <section className="section !pt-12">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_320px]">
          <div
            className="prose-site max-w-3xl"
            dangerouslySetInnerHTML={{ __html: page.body }}
          />
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {settings.stats.length > 0 && (
              <div className="rounded-2xl bg-primary-50 p-6">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  At a glance
                </h2>
                <dl className="mt-4 space-y-4">
                  {settings.stats.map((stat) => (
                    <div key={stat.label} className="flex items-baseline justify-between gap-3">
                      <dt className="text-sm text-slate-600">{stat.label}</dt>
                      <dd className="text-xl font-extrabold text-primary-700">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            <div className="rounded-2xl border border-slate-200 p-6 text-center">
              <h2 className="font-extrabold text-slate-900">Meet us on the steppe</h2>
              <p className="mt-1.5 text-sm text-slate-600">
                The best introduction is a journey together.
              </p>
              <Link href="/tours" className="btn-primary btn-md mt-4 w-full">
                Browse tours
              </Link>
              <Link href="/contact" className="btn-outline btn-md mt-2.5 w-full">
                Talk to the team
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
