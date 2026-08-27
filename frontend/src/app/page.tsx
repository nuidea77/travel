import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Compass,
  Handshake,
  Heart,
  Landmark,
  Lightbulb,
  Map,
  MapPin,
  Mountain,
  Newspaper,
  ShieldCheck,
  Sparkles,
  Tent,
  Users,
  Info,
} from "lucide-react";
import { getHome, getSettings } from "@/lib/api";
import SectionHeading from "@/components/SectionHeading";
import TourCard from "@/components/TourCard";
import BlogCard from "@/components/BlogCard";
import TestimonialCarousel from "@/components/TestimonialCarousel";

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
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/70 via-primary-950/30 to-primary-950/70" />
        <div className="container-site relative py-28 text-center text-white lg:py-40">
          <p className="mx-auto mb-4 w-fit rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur">
            Est. {settings.founded_year} · Ulaanbaatar, Mongolia
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            The land of the eternal blue sky is calling
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-primary-50/90 sm:text-lg">
            {settings.tagline} — crafted by a local team that has guided
            18,000+ travelers across the steppe.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link href="/tours" className="btn-accent btn-lg">
              <Compass size={18} /> Explore tours
            </Link>
            <Link href="/contact" className="btn btn-lg border-2 border-white/70 text-white hover:bg-white/10">
              Plan a custom trip
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────── */}
      {settings.stats.length > 0 && (
        <section className="border-b border-slate-100 bg-white">
          <div className="container-site grid grid-cols-2 gap-6 py-10 sm:grid-cols-3 lg:grid-cols-5">
            {settings.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold text-primary-700">{stat.value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Why Mongolia now ─────────────────────────────────── */}
      <section className="section bg-slate-50">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div>
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
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card">
            <Image
              src="/images/nomad-life.svg"
              alt="Nomadic camp with gers, yaks and horses"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Private vs group ─────────────────────────────────── */}
      <section className="section">
        <div className="container-site">
          <SectionHeading
            eyebrow="Two ways to travel"
            title="Private journey or small group — your call"
            lead="Every itinerary on this site runs both ways. Join a scheduled small group and share the campfire, or take the same route privately on your own dates."
          />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="group relative overflow-hidden rounded-3xl shadow-card">
              <div className="relative aspect-[16/9]">
                <Image src="/images/horse-trek.svg" alt="Private tour riders at dusk" fill className="img-zoom object-cover" />
              </div>
              <div className="p-7">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-slate-800 p-2.5 text-white"><Map size={20} /></span>
                  <h3 className="text-xl font-extrabold text-slate-900">Private & tailor-made</h3>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li>• Your dates, your pace, your route — we design around you</li>
                  <li>• Dedicated guide, driver and vehicle for your party only</li>
                  <li>• From honeymoon gers to family logistics with car seats</li>
                </ul>
                <Link href="/tours?type=private" className="btn-primary btn-md mt-6">
                  Browse private tours
                </Link>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-3xl shadow-card">
              <div className="relative aspect-[16/9]">
                <Image src="/images/naadam-festival.svg" alt="Group tour at Naadam festival" fill className="img-zoom object-cover" />
              </div>
              <div className="p-7">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-primary-600 p-2.5 text-white"><Users size={20} /></span>
                  <h3 className="text-xl font-extrabold text-slate-900">Join a group</h3>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li>• Guaranteed departures, capped at 16 travelers</li>
                  <li>• The best per-person prices on our classic routes</li>
                  <li>• Arrive solo, leave with friends on five continents</li>
                </ul>
                <Link href="/tours?type=join" className="btn-primary btn-md mt-6">
                  See group departures
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured tours ───────────────────────────────────── */}
      <section className="section bg-slate-50">
        <div className="container-site">
          <SectionHeading
            eyebrow="Most popular"
            title="Featured tours"
            lead="The journeys travelers book most — each one refined over dozens of departures."
          />
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {home.featured_tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/tours" className="btn-outline btn-lg">
              View all {home.featured_tours.length > 0 ? "tours" : "our tours"}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="section">
        <div className="container-site">
          <SectionHeading
            eyebrow="Guest stories"
            title="What travelers say"
            lead="Unedited words from recent guests — country by country, campfire by campfire."
          />
          <TestimonialCarousel testimonials={home.testimonials} />
        </div>
      </section>

      {/* ── Travel guide ─────────────────────────────────────── */}
      <section className="section bg-primary-950 text-white">
        <div className="container-site">
          <div className="mb-10 max-w-2xl lg:mb-14">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary-300">
              Know before you go
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
              Your Mongolia travel guide
            </h2>
            <p className="mt-4 text-primary-100/80">
              Visas, packing, festivals, food and ger etiquette — everything we
              tell our own guests, published for everyone.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {home.post_categories.map((cat) => {
              const Icon = GUIDE_ICONS[cat.slug] ?? Lightbulb;
              return (
                <Link
                  key={cat.id}
                  href={`/blogs?category=${cat.slug}`}
                  className="group rounded-2xl bg-primary-900/60 p-6 text-center transition-colors hover:bg-primary-800"
                >
                  <Icon size={28} className="mx-auto text-accent-400" />
                  <p className="mt-3 text-sm font-bold">{cat.name}</p>
                  <p className="mt-1 text-xs text-primary-300">
                    {cat.posts_count ?? 0} articles
                  </p>
                </Link>
              );
            })}
          </div>
          {home.latest_posts.length > 0 && (
            <div className="mt-12 grid gap-7 lg:grid-cols-3">
              {home.latest_posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Why choose us ────────────────────────────────────── */}
      <section className="section">
        <div className="container-site">
          <SectionHeading
            eyebrow="Why travel with us"
            title="Eight reasons travelers keep coming back"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_US.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-100 p-6 transition-shadow hover:shadow-card">
                <item.icon size={26} className="text-primary-600" />
                <h3 className="mt-3 font-extrabold text-slate-900">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA band ─────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <Image src="/images/gobi-dunes.svg" alt="" fill className="object-cover" aria-hidden />
        <div className="absolute inset-0 bg-primary-950/70" />
        <div className="container-site relative py-20 text-center text-white">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight lg:text-4xl">
            Tell us your dates — we&apos;ll draft your Mongolia in 24 hours
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-50/85">
            A real itinerary with real prices from a real human in Ulaanbaatar.
            No obligation, no spam, no pressure.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-accent btn-lg">
              Start planning
            </Link>
            <Link href="/trip-calendar" className="btn btn-lg border-2 border-white/70 text-white hover:bg-white/10">
              See departure calendar
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
