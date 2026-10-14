<script setup lang="ts">
import {
  ArrowRight,
  Award,
  CalendarDays,
  Compass,
  MapPin,
  ThumbsUp,
  Users,
} from "lucide-vue-next";
import { formatDate, getHome, useSettings } from "~/composables/useApi";

const settings = useSettings();

const { data: home } = await useAsyncData("home", () => getHome());

const STAT_ICONS = [CalendarDays, Users, ThumbsUp, Award, Compass, MapPin];

const stats = computed(() =>
  [...settings.value.stats, { value: "Local", label: "Travel experts" }].slice(0, 6),
);

const featuredPost = computed(() => home.value?.latest_posts[0]);
const miniPosts = computed(() => home.value?.latest_posts.slice(1) ?? []);

const MOSAIC = [
  { image: "/images/hero-steppe.svg", label: "Amazing" },
  { image: "/images/altai-peaks.svg", label: "Adventure" },
  { image: "/images/kharkhorin.svg", label: "Established" },
  { image: "/images/eagle-hunter.svg", label: "History" },
  { image: "/images/nomad-life.svg", label: "Authentic" },
  { image: "/images/naadam-festival.svg", label: "Unforgettable" },
];

const EXPERIENCES = [
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
];
</script>

<template>
  <div>
    <!-- ── Hero ─────────────────────────────────────────────── -->
    <section class="relative isolate overflow-hidden bg-ink">
      <img
        src="/images/gobi-dunes.svg"
        alt="Gobi desert dunes"
        class="absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/65" />
      <div class="container-site relative py-28 text-center text-white lg:py-36">
        <h1 class="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.15] tracking-tight drop-shadow sm:text-5xl">
          Experience Mongolia with Trusted Local Experts Since {{ settings.founded_year }}
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-base text-white/85 sm:text-lg">
          {{ settings.tagline }} — crafted by trusted local experts since {{ settings.founded_year }}.
        </p>
        <div class="mt-9">
          <NuxtLink to="/contact" class="btn-primary btn-lg">Start Planning Your Journey</NuxtLink>
        </div>
      </div>
    </section>

    <!-- ── Why Mongolia ─────────────────────────────────────── -->
    <section class="section">
      <div class="container-site">
        <Reveal>
          <div class="mx-auto mb-10 max-w-3xl text-center">
            <h2 class="text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
              Why Mongolia in {{ new Date().getFullYear() }}
            </h2>
            <p class="mt-4 leading-relaxed text-slate-500">
              Vast open landscapes. Nomadic culture. Genuine human connection.
              Mongolia is one of the few places left where travelers can truly
              disconnect from the modern world and experience authentic
              adventure beyond the beaten path — from the Gobi Desert to remote
              steppe landscapes, designed around real people, not crowds.
            </p>
          </div>
        </Reveal>

        <Reveal :delay="100">
          <div class="relative overflow-hidden rounded-2xl">
            <div class="relative aspect-[16/10] sm:aspect-[21/9]">
              <img src="/images/moto-adventure.svg" alt="Travelers crossing the dunes" class="absolute inset-0 h-full w-full object-cover" />
              <div class="absolute inset-0 bg-black/25" />
            </div>
            <div class="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
              <div class="grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
                <div
                  v-for="(stat, i) in stats"
                  :key="stat.label"
                  class="rounded-xl border border-white/25 bg-white/10 p-4 text-center text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:p-5"
                >
                  <component :is="STAT_ICONS[i % STAT_ICONS.length]" :size="20" class="mx-auto opacity-90" />
                  <p class="mt-2 text-xl font-extrabold sm:text-2xl">{{ stat.value }}</p>
                  <p class="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-white/80">
                    {{ stat.label }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    <!-- ── Choose your experience ───────────────────────────── -->
    <section class="section !pt-0">
      <div class="container-site">
        <Reveal>
          <div class="mx-auto mb-10 max-w-2xl text-center">
            <h2 class="text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
              Choose Your Mongolia Experience
            </h2>
            <p class="mt-3 text-slate-500">
              Private journeys and curated small-group experiences across Mongolia.
            </p>
          </div>
        </Reveal>
        <div class="grid gap-6 md:grid-cols-2">
          <Reveal v-for="(card, i) in EXPERIENCES" :key="card.label" :delay="i * 120">
            <NuxtLink :to="card.href" class="group relative block overflow-hidden rounded-2xl">
              <div class="relative aspect-[16/9]">
                <img :src="card.image" :alt="card.alt" class="img-zoom absolute inset-0 h-full w-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              </div>
              <div class="absolute inset-x-0 bottom-0 flex items-center justify-between p-6">
                <span class="text-2xl font-extrabold text-white drop-shadow">{{ card.label }}</span>
                <span class="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/80 text-white transition-all group-hover:bg-white group-hover:text-slate-900">
                  <ArrowRight :size="18" />
                </span>
              </div>
            </NuxtLink>
          </Reveal>
        </div>
      </div>
    </section>

    <!-- ── Award band ───────────────────────────────────────── -->
    <section class="relative isolate overflow-hidden">
      <img src="/images/nomad-life.svg" alt="" class="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
      <div class="absolute inset-0 bg-black/55" />
      <div class="container-site relative flex flex-col items-center gap-5 py-16 text-center text-white">
        <AwardBadge :size="104" />
        <p class="max-w-xl text-sm font-semibold leading-relaxed text-white/90">
          We have been helping people the world over to enjoy unforgettable
          adventures in our homeland — and we do it all with expertise and passion.
        </p>
      </div>
    </section>

    <!-- ── Top tours ────────────────────────────────────────── -->
    <section class="section">
      <div class="container-site">
        <Reveal>
          <ToursCarousel heading="Our Top Tours" lead="Take a look at our most popular tours.">
            <TourCard v-for="tour in home?.featured_tours ?? []" :key="tour.id" :tour="tour" />
          </ToursCarousel>
        </Reveal>
        <div class="mt-10 text-center">
          <NuxtLink to="/tours" class="btn-outline btn-lg">View All Mongolia Tours</NuxtLink>
        </div>
      </div>
    </section>

    <!-- ── Travel guide ─────────────────────────────────────── -->
    <section class="section bg-blush">
      <div class="container-site">
        <Reveal>
          <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 class="text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
                Your Mongolia Travel Guide
              </h2>
              <p class="mt-2 text-slate-500">Articles &amp; tips to plan every step of your trip.</p>
            </div>
            <NuxtLink to="/blogs" class="btn-outline btn-md">See more blogs</NuxtLink>
          </div>

          <div class="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4">
            <NuxtLink
              v-for="(cat, i) in home?.post_categories ?? []"
              :key="cat.id"
              :to="`/blogs?category=${cat.slug}`"
              class="shrink-0 rounded-full px-5 py-2 text-sm font-bold transition-colors"
              :class="
                i === 0
                  ? 'bg-primary-700 text-white'
                  : 'bg-white text-slate-600 shadow-sm hover:bg-primary-50 hover:text-primary-700'
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
                :src="featuredPost.image ?? '/images/hero-steppe.svg'"
                :alt="featuredPost.title"
                class="img-zoom absolute inset-0 h-full w-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
              <span
                v-if="featuredPost.category"
                class="absolute left-5 top-5 rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-800"
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
                class="group flex gap-4 rounded-2xl bg-white p-3.5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div class="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl sm:h-[104px] sm:w-40">
                  <img :src="post.image ?? '/images/hero-steppe.svg'" alt="" class="img-zoom absolute inset-0 h-full w-full object-cover" loading="lazy" />
                </div>
                <div class="min-w-0 py-1">
                  <span
                    v-if="post.category"
                    class="rounded border border-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500"
                  >
                    {{ post.category.name }}
                  </span>
                  <h3 class="mt-1.5 line-clamp-2 text-[15px] font-extrabold leading-snug text-slate-900 group-hover:text-primary-700">
                    {{ post.title }}
                  </h3>
                  <p class="mt-1.5 flex items-center gap-2 text-xs font-bold text-primary-700">
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

    <!-- ── Why travel with us (mosaic) ──────────────────────── -->
    <section class="section">
      <div class="container-site">
        <Reveal>
          <div class="mx-auto mb-10 max-w-2xl text-center">
            <h2 class="text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
              Why travel with us
            </h2>
            <p class="mt-3 text-slate-500">
              Here are reasons you should go with {{ settings.site_name }}.
            </p>
          </div>
        </Reveal>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Reveal v-for="(tile, i) in MOSAIC.slice(0, 4)" :key="tile.label" :delay="i * 70">
            <div class="group relative h-40 overflow-hidden rounded-xl md:h-44">
              <img :src="tile.image" :alt="tile.label" class="img-zoom absolute inset-0 h-full w-full object-cover" loading="lazy" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <span class="absolute bottom-3 left-3 rounded-md bg-white/95 px-2.5 py-1 text-xs font-extrabold text-slate-800">
                {{ tile.label }}
              </span>
            </div>
          </Reveal>
          <Reveal :delay="80" class="col-span-2">
            <div class="flex h-40 items-center justify-center rounded-xl bg-primary-700 p-6 text-center md:h-44">
              <p class="text-lg font-extrabold leading-snug text-white">
                Professional &amp; knowledgeable — a local team guiding travelers
                since {{ settings.founded_year }}.
              </p>
            </div>
          </Reveal>
          <Reveal v-for="(tile, i) in MOSAIC.slice(4, 6)" :key="tile.label" :delay="i * 70">
            <div class="group relative h-40 overflow-hidden rounded-xl md:h-44">
              <img :src="tile.image" :alt="tile.label" class="img-zoom absolute inset-0 h-full w-full object-cover" loading="lazy" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <span class="absolute bottom-3 left-3 rounded-md bg-white/95 px-2.5 py-1 text-xs font-extrabold text-slate-800">
                {{ tile.label }}
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>

    <!-- ── Testimonials ─────────────────────────────────────── -->
    <section class="section bg-blush">
      <div class="container-site">
        <Reveal>
          <div class="mx-auto mb-10 max-w-2xl text-center">
            <h2 class="text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
              Feedback from our beloved customers
            </h2>
            <p class="mt-3 text-slate-500">
              Unedited words from recent guests — country by country, campfire by campfire.
            </p>
          </div>
        </Reveal>
        <Reveal :delay="100">
          <TestimonialMasonry :testimonials="home?.testimonials ?? []" />
        </Reveal>
      </div>
    </section>
  </div>
</template>
