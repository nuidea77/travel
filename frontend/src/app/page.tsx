import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Calendar,
  Compass,
  Handshake,
  Heart,
  Landmark,
  Lightbulb,
  MapPin,
  Mountain,
  Newspaper,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Tent,
  Users,
  Info,
} from "lucide-react";
import { getHome, getSettings } from "@/lib/api";
import SectionHeading from "@/components/SectionHeading";
import TourCard from "@/components/TourCard";
import BlogCard from "@/components/BlogCard";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

const GUIDE_ICONS: Record<string, typeof Lightbulb> = {
  "travel-tips": Lightbulb,
  "places-to-visit": MapPin,
  "culture-history": Landmark,
  "things-to-know": Info,
  "news-events": Newspaper,
};

const WHY_US = [
  { icon: Sparkles, title: "Amazing", body: "Landscapes that reset your sense of scale — and itineraries built to meet them slowly." },
  { icon: Award, title: "Established", body: "Guiding travelers since 2004 with a 2025 Travellers' Choice award on the wall." },
  { icon: Landmark, title: "History", body: "From Karakorum's ruins to living shamanic tradition, our guides tell the full story." },
  { icon: ShieldCheck, title: "Professional", body: "Licensed guides, maintained vehicles, real insurance and honest logistics." },
  { icon: Tent, title: "Authentic", body: "Herder families we've partnered with for decades — never staged, always genuine." },
  { icon: Mountain, title: "Adventure", body: "Dunes, glaciers, horse treks and river fords, calibrated to your comfort level." },
  { icon: Heart, title: "Unforgettable", body: "18,000+ travelers hosted; most of our bookings arrive by word of mouth." },
  { icon: Handshake, title: "Friendly", body: "A small local team that answers within a day and remembers your name." },
];

export default async function HomePage() {
  const [home, settings] = await Promise.all([getHome(), getSettings()]);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <Image
          src="/images/hero-steppe.svg"
          alt="Mongolian steppe with gers and riders"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/60 via-primary-900/15 to-primary-950/70" />

        <div className="container-site relative pb-36 pt-24 text-center text-white lg:pb-44 lg:pt-32">
          <p className="mx-auto mb-5 w-fit rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] backdrop-blur">
            Est. {settings.founded_year} · Ulaanbaatar, Mongolia
          </p>
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-semibold leading-[1.12] tracking-tight drop-shadow-sm sm:text-5xl lg:text-[4.2rem]">
            The land of the{" "}
            <em className="italic text-accent-300">eternal blue sky</em>
            <br className="hidden sm:block" /> is calling
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-primary-50/90 sm:text-lg">
            {settings.tagline} — crafted by a local team that has guided
            18,000+ travelers across the steppe.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link href="/tours" className="btn-accent btn-lg">
              <Compass size={18} /> Explore tours
            </Link>
            <Link
              href="/contact"
              className="btn btn-lg border-2 border-white/70 text-white backdrop-blur-sm hover:bg-white/10"
            >
              Plan a custom trip
            </Link>
          </div>

          {/* trip finder */}
          <form
            action="/tours"
            method="get"
            className="mx-auto mt-12 grid w-full max-w-3xl grid-cols-1 gap-2 rounded-3xl border border-white/20 bg-white/10 p-2.5 backdrop-blur-md sm:grid-cols-[1fr_1fr_1fr_auto] sm:rounded-full"
          >
            <label className="sr-only" htmlFor="hero-dest">Destination</label>
            <select
              id="hero-dest"
              name="destination"
              className="w-full rounded-full border-0 bg-white px-5 py-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-accent-400"
              defaultValue=""
            >
              <option value="">Anywhere in Mongolia</option>
              {home.destinations.map((d) => (
                <option key={d.id} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="hero-cat">Travel style</label>
            <select
              id="hero-cat"
              name="category"
              className="w-full rounded-full border-0 bg-white px-5 py-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-accent-400"
              defaultValue=""
            >
              <option value="">Any travel style</option>
              {home.categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="hero-dur">Duration</label>
            <select
              id="hero-dur"
              name="duration"
              className="w-full rounded-full border-0 bg-white px-5 py-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-accent-400"
              defaultValue=""
            >
              <option value="">Any duration</option>
              <option value="1">1 day</option>
              <option value="2-3">2–3 days</option>
              <option value="4-7">4–7 days</option>
              <option value="8+">8+ days</option>
            </select>
            <button type="submit" className="btn-accent btn-md sm:px-6">
              <Search size={16} />
              <span className="sm:hidden lg:inline">Find tours</span>
            </button>
          </form>
        </div>
      </section>

      {/* ── Floating stats ───────────────────────────────────── */}
      {settings.stats.length > 0 && (
        <section className="relative z-10 -mt-20 lg:-mt-24">
          <div className="container-site">
            <Reveal>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 rounded-3xl bg-white px-6 py-9 shadow-card-hover sm:grid-cols-3 lg:grid-cols-5">
                {settings.stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="font-display text-3xl font-semibold text-primary-700 lg:text-4xl">
                      {stat.value}
                    </p>
                    <p className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── Why Mongolia now ─────────────────────────────────── */}
      <section className="section">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Why Mongolia, why now"
              title="Disconnect from the modern world. Reconnect with everything else."
            />
            <div className="prose-site -mt-6 lg:-mt-10">
              <p>
                Mongolia is the world&apos;s least crowded country — a place where
                the horizon is the only fence and hospitality is a
                three-thousand-year-old institution. One day here holds a camel
                trek at dawn, a monastery at noon and a herder&apos;s ger at
                nightfall, with nothing between them but sky.
              </p>
              <p>
                Travel is opening fast: visa-free entry for 60+ nationalities,
                new flight connections, and infrastructure that finally matches
                the wilderness. The steppe, meanwhile, hasn&apos;t changed at all.
                That balance won&apos;t last forever — come while it holds.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/about-mongolia" className="btn-primary btn-md">
                About Mongolia
              </Link>
              <Link href="/blogs/best-time-to-visit-mongolia" className="btn-outline btn-md">
                Best time to visit
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card-hover">
                <Image
                  src="/images/nomad-life.svg"
                  alt="Nomadic camp with gers, yaks and horses"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-4 flex animate-float-slow items-center gap-3 rounded-2xl bg-white p-4 pr-6 shadow-card-hover sm:-left-8">
                <span className="rounded-xl bg-accent-100 p-2.5 text-accent-600">
                  <Star size={20} className="fill-accent-500 text-accent-500" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-slate-900">4.9 / 5 average rating</p>
                  <p className="text-xs text-slate-500">from 1,300+ verified reviews</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Private vs group ─────────────────────────────────── */}
      <section className="section bg-slate-50">
        <div className="container-site">
          <Reveal>
            <SectionHeading
              eyebrow="Two ways to travel"
              title="Private journey or small group — your call"
              lead="Every itinerary on this site runs both ways. Join a scheduled small group and share the campfire, or take the same route privately on your own dates."
            />
          </Reveal>
          <div className="grid gap-8 lg:grid-cols-2">
            {[
              {
                img: "/images/horse-trek.svg",
                alt: "Private tour riders at dusk",
                icon: Compass,
                iconBg: "bg-slate-800",
                title: "Private & tailor-made",
                items: [
                  "Your dates, your pace, your route — we design around you",
                  "Dedicated guide, driver and vehicle for your party only",
                  "From honeymoon gers to family logistics with car seats",
                ],
                href: "/tours?type=private",
                cta: "Browse private tours",
              },
              {
                img: "/images/naadam-festival.svg",
                alt: "Group tour at Naadam festival",
                icon: Users,
                iconBg: "bg-primary-600",
                title: "Join a group",
                items: [
                  "Guaranteed departures, capped at 16 travelers",
                  "The best per-person prices on our classic routes",
                  "Arrive solo, leave with friends on five continents",
                ],
                href: "/tours?type=join",
                cta: "See group departures",
              },
            ].map((card, i) => (
              <Reveal key={card.title} delay={i * 120}>
                <div className="group h-full overflow-hidden rounded-3xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                  <div className="relative aspect-[16/8] overflow-hidden">
                    <Image src={card.img} alt={card.alt} fill className="img-zoom object-cover" />
                  </div>
                  <div className="p-7">
                    <div className="flex items-center gap-3">
                      <span className={`rounded-xl p-2.5 text-white ${card.iconBg}`}>
                        <card.icon size={20} />
                      </span>
                      <h3 className="font-display text-2xl font-semibold text-slate-900">
                        {card.title}
                      </h3>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm text-slate-600">
                      {card.items.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                    <Link href={card.href} className="btn-primary btn-md mt-6">
                      {card.cta}
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured tours ───────────────────────────────────── */}
      <section className="section">
        <div className="container-site">
          <Reveal>
            <SectionHeading
              eyebrow="Most popular"
              title="Featured tours"
              lead="The journeys travelers book most — each one refined over dozens of departures."
            />
          </Reveal>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {home.featured_tours.map((tour, i) => (
              <Reveal key={tour.id} delay={(i % 3) * 100}>
                <TourCard tour={tour} />
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/tours" className="btn-outline btn-lg">
              View all tours
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="section bg-slate-50">
        <div className="container-site">
          <Reveal>
            <SectionHeading
              eyebrow="Guest stories"
              title="What travelers say"
              lead="Unedited words from recent guests — country by country, campfire by campfire."
            />
          </Reveal>
          <Reveal delay={100}>
            <TestimonialCarousel testimonials={home.testimonials} />
          </Reveal>
        </div>
      </section>

      {/* ── Travel guide ─────────────────────────────────────── */}
      <section className="section relative isolate overflow-hidden bg-primary-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #7fd7cd 1px, transparent 0)",
            backgroundSize: "34px 34px",
          }}
          aria-hidden
        />
        <div className="container-site relative">
          <Reveal>
            <SectionHeading
              light
              eyebrow="Know before you go"
              title="Your Mongolia travel guide"
              lead="Visas, packing, festivals, food and ger etiquette — everything we tell our own guests, published for everyone."
              align="left"
            />
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {home.post_categories.map((cat, i) => {
              const Icon = GUIDE_ICONS[cat.slug] ?? Lightbulb;
              return (
                <Reveal key={cat.id} delay={i * 70}>
                  <Link
                    href={`/blogs?category=${cat.slug}`}
                    className="group block h-full rounded-2xl bg-primary-900/60 p-6 text-center ring-1 ring-primary-800/60 transition-all duration-300 hover:-translate-y-1 hover:bg-primary-800 hover:ring-primary-600"
                  >
                    <Icon size={28} className="mx-auto text-accent-400 transition-transform duration-300 group-hover:scale-110" />
                    <p className="mt-3 text-sm font-bold">{cat.name}</p>
                    <p className="mt-1 text-xs text-primary-300">
                      {cat.posts_count ?? 0} articles
                    </p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
          {home.latest_posts.length > 0 && (
            <div className="mt-12 grid gap-7 lg:grid-cols-3">
              {home.latest_posts.map((post, i) => (
                <Reveal key={post.id} delay={i * 100}>
                  <BlogCard post={post} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Why choose us ────────────────────────────────────── */}
      <section className="section">
        <div className="container-site">
          <Reveal>
            <SectionHeading
              eyebrow="Why travel with us"
              title="Eight reasons travelers keep coming back"
            />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_US.map((item, i) => (
              <Reveal key={item.title} delay={(i % 4) * 80}>
                <div className="group h-full rounded-2xl border border-slate-100 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-100 hover:shadow-card">
                  <span className="inline-flex rounded-xl bg-primary-50 p-2.5 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                    <item.icon size={22} />
                  </span>
                  <h3 className="mt-3.5 font-display text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA band ─────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <Image src="/images/gobi-dunes.svg" alt="" fill className="object-cover" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/75 to-primary-950/60" />
        <div className="container-site relative py-24 text-center text-white">
          <Reveal>
            <p className="mx-auto mb-3 flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-accent-300">
              <Calendar size={14} /> Free itinerary draft, within 24 hours
            </p>
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight lg:text-[2.8rem] lg:leading-tight">
              Tell us your dates — we&apos;ll draft your Mongolia
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-50/85">
              A real itinerary with real prices from a real human in Ulaanbaatar.
              No obligation, no spam, no pressure.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-accent btn-lg">
                Start planning
              </Link>
              <Link
                href="/trip-calendar"
                className="btn btn-lg border-2 border-white/70 text-white backdrop-blur-sm hover:bg-white/10"
              >
                See departure calendar
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
