<script setup lang="ts">
import {
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  CalendarDays,
  ShieldCheck,
  Wallet,
} from "lucide-vue-next";
import { formatDate, getHome, useSettings } from "~/composables/useApi";
import { socialPaths } from "~/utils/social-icons";

const settings = useSettings();

const { data: home } = await useAsyncData("home", () => getHome());

// hero destinations for the mosaic: hand-picked photogenic places first,
// topped up with the most-toured ones
const MOSAIC_PICKS = ["khuvsgul-lake", "khongor-sand-dunes", "the-tsaatan-tribe", "bayanzag"];
const mosaic = computed(() => {
  const all = (home.value?.destinations ?? []).filter((d) => d.image);
  const picked = MOSAIC_PICKS.map((slug) => all.find((d) => d.slug === slug)).filter(
    (d): d is NonNullable<typeof d> => !!d,
  );
  for (const d of [...all].sort((a, b) => (b.tours_count ?? 0) - (a.tours_count ?? 0))) {
    if (picked.length >= 4) break;
    if (!picked.includes(d)) picked.push(d);
  }
  return picked.slice(0, 4);
});

const featuredPost = computed(() => home.value?.latest_posts[0]);
const miniPosts = computed(() => home.value?.latest_posts.slice(1) ?? []);

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Safe traveling",
    body: "Experienced drivers on every track, satellite-checked routes and a local team on call around the clock.",
  },
  {
    icon: Wallet,
    title: "Fair local prices",
    body: "You book directly with the operator in Ulaanbaatar — no middlemen, free cancellation up to 30 days out.",
  },
  {
    icon: BedDouble,
    title: "Comfort accommodation",
    body: "Hand-picked ger camps, family ger stays and expedition tents with honest meals three times a day.",
  },
];

const EXPERIENCE_MINIS = [
  { label: "Private", href: "/tours?type=private", image: "/images/tours/the-magnificent-mongolia-tour.jpg" },
  { label: "Join a group", href: "/tours?type=join", image: "/images/tours/the-nomadic-adventure-tour.jpg" },
];

const heroBlurbs = computed(() => [
  {
    icon: CalendarDays,
    text: `Guaranteed small-group departures and tailor-made private journeys all year round.`,
  },
  {
    icon: ShieldCheck,
    text: `A local crew guiding travelers across all five regions since ${settings.value.founded_year}.`,
  },
]);
</script>

<template>
  <div>
    <!-- ── Hero ─────────────────────────────────────────────── -->
    <section class="relative isolate flex min-h-[92vh] flex-col overflow-hidden bg-ink">
      <img
        :src="settings.hero_image || '/images/hero.jpg'"
        alt="Mongolian landscape"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />

      <div class="container-site relative flex flex-1 flex-col justify-center pb-16 pt-36">
        <Reveal>
          <span class="inline-flex w-fit items-center rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur">
            {{ settings.logo_tagline ?? "Feel the experience" }}
          </span>
          <h1 class="mt-6 max-w-3xl text-5xl font-extrabold leading-[1.04] tracking-tight text-white drop-shadow sm:text-6xl lg:text-7xl">
            {{ settings.hero_title || "Explore The Majestic Mongolia Landscape Now" }}
          </h1>
          <div class="mt-10">
            <NuxtLink to="/tours" class="btn-light btn-lg !gap-3">
              Get started <ArrowRight :size="17" />
            </NuxtLink>
          </div>
        </Reveal>

        <!-- hero blurbs -->
        <div class="mt-auto grid gap-6 pt-20 sm:grid-cols-2 lg:max-w-3xl">
          <div v-for="blurb in heroBlurbs" :key="blurb.text" class="flex items-start gap-3.5 text-white">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur">
              <component :is="blurb.icon" :size="17" />
            </span>
            <p class="text-sm leading-relaxed text-white/85">{{ blurb.text }}</p>
          </div>
        </div>
      </div>

      <!-- right rail: socials + scroll -->
      <div class="absolute bottom-10 right-7 hidden flex-col items-center gap-6 lg:flex">
        <div class="flex flex-col gap-3">
          <a
            v-for="(url, key) in settings.socials"
            :key="key"
            :href="url"
            target="_blank"
            rel="noreferrer"
            :aria-label="String(key)"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white hover:text-ink"
          >
            <svg
              v-if="socialPaths[String(key)]"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path v-for="(d, i) in socialPaths[String(key)]" :key="i" :d="d" />
            </svg>
          </a>
        </div>
        <div class="flex flex-col items-center gap-3 text-white/80">
          <span class="text-[10px] font-bold uppercase tracking-[0.3em] [writing-mode:vertical-rl]">Scroll</span>
          <span class="h-14 w-px animate-pulse bg-white/50" />
        </div>
      </div>
    </section>

    <!-- ── Destination mosaic ───────────────────────────────── -->
    <section class="section">
      <div class="container-site">
        <Reveal>
          <div class="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Top destinations</p>
              <h2 class="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
                Where Will You Go Next?
              </h2>
            </div>
            <NuxtLink to="/about-mongolia#destinations" class="btn-dark btn-md">All destinations</NuxtLink>
          </div>
        </Reveal>

        <div v-if="mosaic.length >= 4" class="grid gap-5 lg:grid-cols-5">
          <Reveal class="lg:col-span-2">
            <NuxtLink
              :to="`/tours?destination=${mosaic[0]!.slug}`"
              class="group relative block h-72 overflow-hidden rounded-2xl sm:h-96 lg:h-full lg:min-h-[540px]"
            >
              <img :src="mosaic[0]!.image!" :alt="mosaic[0]!.name" class="img-zoom absolute inset-0 h-full w-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6">
                <div>
                  <h3 class="text-2xl font-extrabold text-white drop-shadow">{{ mosaic[0]!.name }}</h3>
                  <p class="mt-1 text-sm font-semibold text-white/75">{{ mosaic[0]!.region }} Mongolia</p>
                </div>
                <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/70 text-white transition-all group-hover:bg-white group-hover:text-ink">
                  <ArrowUpRight :size="18" />
                </span>
              </div>
            </NuxtLink>
          </Reveal>

          <div class="grid gap-5 sm:grid-cols-2 lg:col-span-3">
            <Reveal v-for="(dest, i) in mosaic.slice(1, 3)" :key="dest.id" :delay="80 + i * 80">
              <NuxtLink
                :to="`/tours?destination=${dest.slug}`"
                class="group relative block h-56 overflow-hidden rounded-2xl sm:h-64"
              >
                <img :src="dest.image!" :alt="dest.name" class="img-zoom absolute inset-0 h-full w-full object-cover" loading="lazy" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                  <div>
                    <h3 class="text-lg font-extrabold text-white drop-shadow">{{ dest.name }}</h3>
                    <p class="mt-0.5 text-xs font-semibold text-white/75">{{ dest.region }} Mongolia</p>
                  </div>
                  <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/70 text-white transition-all group-hover:bg-white group-hover:text-ink">
                    <ArrowUpRight :size="16" />
                  </span>
                </div>
              </NuxtLink>
            </Reveal>

            <Reveal :delay="240" class="sm:col-span-2">
              <NuxtLink
                :to="`/tours?destination=${mosaic[3]!.slug}`"
                class="group relative block h-60 overflow-hidden rounded-2xl sm:h-[252px]"
              >
                <img :src="mosaic[3]!.image!" :alt="mosaic[3]!.name" class="img-zoom absolute inset-0 h-full w-full object-cover" loading="lazy" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6">
                  <div>
                    <h3 class="text-xl font-extrabold text-white drop-shadow">{{ mosaic[3]!.name }}</h3>
                    <p class="mt-0.5 text-xs font-semibold text-white/75">{{ mosaic[3]!.region }} Mongolia</p>
                  </div>
                  <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/70 text-white transition-all group-hover:bg-white group-hover:text-ink">
                    <ArrowUpRight :size="16" />
                  </span>
                </div>
              </NuxtLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Experience the new adventure ─────────────────────── -->
    <section class="section !pt-4">
      <div class="container-site grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <p class="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Why travel with us</p>
          <h2 class="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 lg:text-5xl">
            Experience The<br />New Adventure
          </h2>
          <p class="mt-5 max-w-lg leading-relaxed text-slate-500">
            {{ settings.tagline }}. From the Gobi dunes to the taiga of the
            Tsaatan reindeer herders — real journeys, run by the people who
            live here.
          </p>

          <div class="mt-9 space-y-7">
            <div v-for="feature in FEATURES" :key="feature.title" class="flex items-start gap-5">
              <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                <component :is="feature.icon" :size="19" />
              </span>
              <div>
                <h3 class="text-lg font-extrabold text-slate-900">{{ feature.title }}</h3>
                <p class="mt-1 max-w-md text-sm leading-relaxed text-slate-500">{{ feature.body }}</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal :delay="120">
          <div class="relative">
            <div class="relative aspect-[4/5] overflow-hidden rounded-3xl sm:aspect-[5/5.4]">
              <img
                src="/images/tours/horseback-adventure-tour.jpg"
                alt="Horse trek through the Mongolian heartland"
                class="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            </div>
            <div class="absolute inset-x-5 bottom-5 grid grid-cols-2 gap-4">
              <NuxtLink
                v-for="mini in EXPERIENCE_MINIS"
                :key="mini.label"
                :to="mini.href"
                class="group relative block h-24 overflow-hidden rounded-xl ring-1 ring-white/40 sm:h-28"
              >
                <img :src="mini.image" :alt="mini.label" class="img-zoom absolute inset-0 h-full w-full object-cover" loading="lazy" />
                <div class="absolute inset-0 bg-black/35 transition-colors group-hover:bg-black/20" />
                <div class="absolute inset-0 flex items-center justify-center gap-2">
                  <span class="text-sm font-extrabold text-white drop-shadow">{{ mini.label }}</span>
                  <span class="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink">
                    <ArrowUpRight :size="13" />
                  </span>
                </div>
              </NuxtLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    <!-- ── Top tours ────────────────────────────────────────── -->
    <section class="section bg-slate-50">
      <div class="container-site">
        <Reveal>
          <ToursCarousel label="Most popular" heading="Our Top Tours" lead="Guaranteed group departures and best-loved journeys.">
            <TourCard v-for="tour in home?.featured_tours ?? []" :key="tour.id" :tour="tour" />
          </ToursCarousel>
        </Reveal>
        <div class="mt-10 text-center">
          <NuxtLink to="/tours" class="btn-dark btn-lg">View All Mongolia Tours</NuxtLink>
        </div>
      </div>
    </section>

    <!-- ── Discover band ────────────────────────────────────── -->
    <section class="bg-ink py-20 text-white lg:py-24">
      <div class="container-site">
        <div class="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 class="text-3xl font-extrabold leading-tight tracking-tight lg:text-5xl">
              Discover A Mesmerizing Nature Landscape &amp; Stunning Culture
            </h2>
          </Reveal>
          <Reveal :delay="100">
            <div class="flex items-start gap-8">
              <div>
                <p class="leading-relaxed text-white/70">
                  Steppe without fences, hospitality without appointments.
                  Mongolia rewards the curious — and {{ settings.site_name }}
                  has been opening its doors to the world since
                  {{ settings.founded_year }}.
                </p>
                <NuxtLink to="/about-mongolia" class="btn-light btn-md mt-7">Learn more</NuxtLink>
              </div>
              <AwardBadge :size="92" class="hidden shrink-0 sm:block" />
            </div>
          </Reveal>
        </div>

        <Reveal :delay="150">
          <dl class="mt-14 grid grid-cols-2 gap-6 border-t border-white/10 pt-10 sm:grid-cols-4">
            <div v-for="stat in settings.stats.slice(0, 4)" :key="stat.label">
              <dt class="text-xs font-bold uppercase tracking-wider text-white/50">{{ stat.label }}</dt>
              <dd class="mt-1 text-3xl font-extrabold">{{ stat.value }}</dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>

    <!-- ── Travel guide ─────────────────────────────────────── -->
    <section class="section">
      <div class="container-site">
        <Reveal>
          <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Travel guide</p>
              <h2 class="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
                Plan Every Step Of Your Trip
              </h2>
            </div>
            <NuxtLink to="/blogs" class="btn-dark btn-md">See more blogs</NuxtLink>
          </div>

          <div class="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4">
            <NuxtLink
              v-for="(cat, i) in home?.post_categories ?? []"
              :key="cat.id"
              :to="`/blogs?category=${cat.slug}`"
              class="shrink-0 rounded-full border px-5 py-2 text-sm font-bold transition-colors"
              :class="
                i === 0
                  ? 'border-ink bg-ink text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-ink hover:text-ink'
              "
            >
              {{ cat.name }}
            </NuxtLink>
          </div>
        </Reveal>

        <div v-if="featuredPost" class="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <NuxtLink
              :to="`/blogs/${featuredPost.slug}`"
              class="group relative block h-full min-h-[340px] overflow-hidden rounded-2xl lg:min-h-[460px]"
            >
              <img
                :src="featuredPost.image ?? '/images/hero.jpg'"
                :alt="featuredPost.title"
                class="img-zoom absolute inset-0 h-full w-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
              <span
                v-if="featuredPost.category"
                class="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-slate-800"
              >
                {{ featuredPost.category.name }}
              </span>
              <div class="absolute inset-x-0 bottom-0 p-6">
                <h3 class="max-w-xl text-2xl font-extrabold leading-snug text-white">
                  {{ featuredPost.title }}
                </h3>
                <span class="mt-3 inline-flex items-center gap-2 text-sm font-bold text-white">
                  Read more
                  <span class="flex h-7 w-7 items-center justify-center rounded-full border border-white/70 transition-colors group-hover:bg-white group-hover:text-slate-900">
                    <ArrowRight :size="13" />
                  </span>
                </span>
              </div>
            </NuxtLink>
          </Reveal>

          <div class="flex flex-col gap-4">
            <Reveal v-for="(post, i) in miniPosts" :key="post.id" :delay="i * 80">
              <NuxtLink
                :to="`/blogs/${post.slug}`"
                class="group flex gap-4 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div class="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl sm:h-[104px] sm:w-40">
                  <img :src="post.image ?? '/images/hero.jpg'" alt="" class="img-zoom absolute inset-0 h-full w-full object-cover" loading="lazy" />
                </div>
                <div class="min-w-0 py-1">
                  <span
                    v-if="post.category"
                    class="rounded-full border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500"
                  >
                    {{ post.category.name }}
                  </span>
                  <h3 class="mt-1.5 line-clamp-2 text-[15px] font-extrabold leading-snug text-slate-900 group-hover:text-primary-700">
                    {{ post.title }}
                  </h3>
                  <p class="mt-1.5 flex items-center gap-2 text-xs font-bold text-slate-900">
                    Read <ArrowRight :size="12" />
                    <span class="font-normal text-slate-400">· {{ formatDate(post.published_at) }}</span>
                  </p>
                </div>
              </NuxtLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Testimonials ─────────────────────────────────────── -->
    <section class="section bg-slate-50">
      <div class="container-site">
        <Reveal>
          <div class="mx-auto mb-10 max-w-2xl text-center">
            <p class="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Reviews</p>
            <h2 class="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
              Feedback From Our Beloved Customers
            </h2>
          </div>
        </Reveal>
        <Reveal :delay="100">
          <TestimonialMasonry :testimonials="home?.testimonials ?? []" />
        </Reveal>
      </div>
    </section>
  </div>
</template>
