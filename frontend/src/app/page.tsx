import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CalendarDays,
  Compass,
  MapPin,
  ThumbsUp,
  Users,
} from "lucide-react";
import { getHome, getSettings } from "@/lib/api";
import TourCard from "@/components/TourCard";
import ToursCarousel from "@/components/ToursCarousel";
import TestimonialMasonry from "@/components/TestimonialMasonry";
import AwardBadge from "@/components/AwardBadge";
import Reveal from "@/components/Reveal";
import { formatDate } from "@/components/BlogCard";

export const dynamic = "force-dynamic";

const STAT_ICONS = [CalendarDays, Users, ThumbsUp, Award, Compass, MapPin];

const MOSAIC: { image: string; label: string }[] = [
  { image: "/images/hero-steppe.svg", label: "Amazing" },
  { image: "/images/altai-peaks.svg", label: "Adventure" },
  { image: "/images/kharkhorin.svg", label: "Established" },
  { image: "/images/eagle-hunter.svg", label: "History" },
  { image: "/images/nomad-life.svg", label: "Authentic" },
  { image: "/images/naadam-festival.svg", label: "Unforgettable" },
  { image: "/images/horse-trek.svg", label: "Friendly" },
];

export default async function HomePage() {
  const [home, settings] = await Promise.all([getHome(), getSettings()]);

  const stats = [
    ...settings.stats,
    { value: "Local", label: "Travel experts" },
  ].slice(0, 6);

  const [featuredPost, ...miniPosts] = home.latest_posts;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-ink">
        <Image
          src="/images/gobi-dunes.svg"
          alt="Gobi desert dunes"
          fill
          priority
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/65" />
        <div className="container-site relative py-28 text-center text-white lg:py-36">
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.15] tracking-tight drop-shadow sm:text-5xl">
            Experience Mongolia with Trusted Local Experts Since{" "}
            {settings.founded_year}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/85 sm:text-lg">
            {settings.tagline} — crafted by trusted local experts since{" "}
            {settings.founded_year}.
          </p>
          <div className="mt-9">
            <Link href="/contact" className="btn-primary btn-lg">
              Start Planning Your Journey
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Mongolia ─────────────────────────────────────── */}
      <section className="section">
        <div className="container-site">
          <Reveal>
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
                Why Mongolia in {new Date().getFullYear()}
              </h2>
              <p className="mt-4 leading-relaxed text-slate-500">
                Vast open landscapes. Nomadic culture. Genuine human connection.
                Mongolia is one of the few places left where travelers can truly
                disconnect from the modern world and experience authentic
                adventure beyond the beaten path — from the Gobi Desert to
                remote steppe landscapes, designed around real people, not
                crowds.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="relative overflow-hidden rounded-2xl">
              <div className="relative aspect-[16/10] sm:aspect-[21/9]">
                <Image
                  src="/images/moto-adventure.svg"
                  alt="Travelers crossing the dunes"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/25" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
                <div className="grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
                  {stats.map((stat, i) => {
                    const Icon = STAT_ICONS[i % STAT_ICONS.length];
                    return (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-white/25 bg-white/10 p-4 text-center text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:p-5"
                      >
                        <Icon size={20} className="mx-auto opacity-90" />
                        <p className="mt-2 text-xl font-extrabold sm:text-2xl">{stat.value}</p>
                        <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-white/80">
                          {stat.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Choose your experience ───────────────────────────── */}
      <section className="section !pt-0">
        <div className="container-site">
          <Reveal>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
                Choose Your Mongolia Experience
              </h2>
              <p className="mt-3 text-slate-500">
                Private journeys and curated small-group experiences across Mongolia.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                label: "Private",
                href: "/tours?type=private",
                image: "/images/khustai-horses.svg",
                alt: "Private tour at dusk in Khustai",
              },
              {
                label: "Join a Group",
                href: "/tours?type=join",
                image: "/images/naadam-festival.svg",
                alt: "Small group at the Naadam festival",
              },
            ].map((card, i) => (
              <Reveal key={card.label} delay={i * 120}>
                <Link
                  href={card.href}
                  className="group relative block overflow-hidden rounded-2xl"
                >
                  <div className="relative aspect-[16/9]">
                    <Image src={card.image} alt={card.alt} fill className="img-zoom object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-6">
                    <span className="text-2xl font-extrabold text-white drop-shadow">
                      {card.label}
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/80 text-white transition-all group-hover:bg-white group-hover:text-slate-900">
                      <ArrowRight size={18} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Award band ───────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <Image src="/images/nomad-life.svg" alt="" fill className="object-cover" aria-hidden />
        <div className="absolute inset-0 bg-black/55" />
        <div className="container-site relative flex flex-col items-center gap-5 py-16 text-center text-white">
          <AwardBadge size={104} />
          <p className="max-w-xl text-sm font-semibold leading-relaxed text-white/90">
            We have been helping people the world over to enjoy unforgettable
            adventures in our homeland — and we do it all with expertise and
            passion.
          </p>
        </div>
      </section>

      {/* ── Top tours ────────────────────────────────────────── */}
      <section className="section">
        <div className="container-site">
          <Reveal>
            <ToursCarousel
              heading="Our Top Tours"
              lead="Take a look at our most popular tours."
            >
              {home.featured_tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </ToursCarousel>
          </Reveal>
          <div className="mt-10 text-center">
            <Link href="/tours" className="btn-outline btn-lg">
              View All Mongolia Tours
            </Link>
          </div>
        </div>
      </section>

      {/* ── Travel guide ─────────────────────────────────────── */}
      <section className="section bg-blush">
        <div className="container-site">
          <Reveal>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
                  Your Mongolia Travel Guide
                </h2>
                <p className="mt-2 text-slate-500">
                  Articles &amp; tips to plan every step of your trip.
                </p>
              </div>
              <Link href="/blogs" className="btn-outline btn-md">
                See more blogs
              </Link>
            </div>

            <div className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4">
              {home.post_categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/blogs?category=${cat.slug}`}
                  className={`shrink-0 rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                    i === 0
                      ? "bg-primary-700 text-white"
                      : "bg-white text-slate-600 shadow-sm hover:bg-primary-50 hover:text-primary-700"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </Reveal>

          {featuredPost && (
            <div className="grid gap-6 lg:grid-cols-2">
              <Reveal>
                <Link
                  href={`/blogs/${featuredPost.slug}`}
                  className="group relative block h-full min-h-[340px] overflow-hidden rounded-2xl lg:min-h-[460px]"
                >
                  <Image
                    src={featuredPost.image ?? "/images/hero-steppe.svg"}
                    alt={featuredPost.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="img-zoom object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  {featuredPost.category && (
                    <span className="absolute left-5 top-5 rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-800">
                      {featuredPost.category.name}
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="max-w-xl text-2xl font-extrabold leading-snug text-white">
                      {featuredPost.title}
                    </h3>
                    <span className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-white">
                      Read more
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/70 transition-colors group-hover:bg-white group-hover:text-slate-900">
                        <ArrowRight size={13} />
                      </span>
                    </span>
                  </div>
                </Link>
              </Reveal>

              <div className="flex flex-col gap-4">
                {miniPosts.map((post, i) => (
                  <Reveal key={post.id} delay={i * 80}>
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="group flex gap-4 rounded-2xl bg-white p-3.5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                    >
                      <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl sm:h-[104px] sm:w-40">
                        <Image
                          src={post.image ?? "/images/hero-steppe.svg"}
                          alt=""
                          fill
                          sizes="160px"
                          className="img-zoom object-cover"
                        />
                      </div>
                      <div className="min-w-0 py-1">
                        {post.category && (
                          <span className="rounded border border-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            {post.category.name}
                          </span>
                        )}
                        <h3 className="mt-1.5 line-clamp-2 text-[15px] font-extrabold leading-snug text-slate-900 group-hover:text-primary-700">
                          {post.title}
                        </h3>
                        <p className="mt-1.5 flex items-center gap-2 text-xs font-bold text-primary-700">
                          Read <ArrowRight size={12} />
                          <span className="font-normal text-slate-400">
                            · {formatDate(post.published_at)}
                          </span>
                        </p>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Why travel with us (mosaic) ──────────────────────── */}
      <section className="section">
        <div className="container-site">
          <Reveal>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
                Why travel with us
              </h2>
              <p className="mt-3 text-slate-500">
                Here are reasons you should go with {settings.site_name} Travel.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {MOSAIC.slice(0, 4).map((tile, i) => (
              <Reveal key={tile.label} delay={i * 70}>
                <MosaicTile {...tile} />
              </Reveal>
            ))}
            <Reveal delay={80} className="col-span-2">
              <div className="flex h-40 items-center justify-center rounded-xl bg-primary-700 p-6 text-center md:h-44">
                <p className="text-lg font-extrabold leading-snug text-white">
                  Professional &amp; knowledgeable — a local team guiding
                  travelers since {settings.founded_year}.
                </p>
              </div>
            </Reveal>
            {MOSAIC.slice(4, 6).map((tile, i) => (
              <Reveal key={tile.label} delay={i * 70}>
                <MosaicTile {...tile} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="section bg-blush">
        <div className="container-site">
          <Reveal>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
                Feedback from our beloved customers
              </h2>
              <p className="mt-3 text-slate-500">
                Here are reasons you should go with {settings.site_name} Travel.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <TestimonialMasonry testimonials={home.testimonials} />
          </Reveal>
        </div>
      </section>
    </>
  );
}

function MosaicTile({ image, label }: { image: string; label: string }) {
  return (
    <div className="group relative h-40 overflow-hidden rounded-xl md:h-44">
      <Image src={image} alt={label} fill sizes="(max-width: 768px) 50vw, 25vw" className="img-zoom object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
      <span className="absolute bottom-3 left-3 rounded-md bg-white/95 px-2.5 py-1 text-xs font-extrabold text-slate-800">
        {label}
      </span>
    </div>
  );
}
