<script setup lang="ts">
import {
  BedDouble,
  Bus,
  CalendarClock,
  Check,
  Clock,
  MapPin,
  ShieldCheck,
  Star,
  Sun,
  UtensilsCrossed,
  X,
} from "lucide-vue-next";
import { getTour } from "~/composables/useApi";

const route = useRoute();
const slug = computed(() => String(route.params.slug ?? ""));

const { data: tour } = await useAsyncData(
  () => `tour-${slug.value}`,
  () => getTour(slug.value),
  { watch: [slug] },
);

if (!tour.value) {
  throw createError({ statusCode: 404, statusMessage: "Tour not found" });
}

useSeoMeta({
  title: () => tour.value?.title ?? "Tour",
  description: () => tour.value?.excerpt ?? "",
});

const departures = computed(() => tour.value?.departures ?? []);

const GOOD_TO_KNOW_ICONS = [Sun, BedDouble, UtensilsCrossed, Bus, ShieldCheck];

const tabs = computed(() =>
  [
    ["#overview", "Overview"],
    ["#itinerary", "Itinerary"],
    ["#price-date", "Price & Date"],
    ["#included", "What's included"],
    ["#good-to-know", "Good to know"],
    ["#reviews", "Reviews"],
  ].filter(
    ([href]) =>
      href !== "#reviews" ||
      (tour.value?.testimonials && tour.value.testimonials.length > 0),
  ),
);

function formatRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const sm = s.toLocaleDateString("en-US", { month: "short" });
  const em = e.toLocaleDateString("en-US", { month: "short" });
  const sameMonth = sm === em && s.getFullYear() === e.getFullYear();
  return `${s.getFullYear()} ${sm} ${s.getDate()} – ${sameMonth ? "" : `${em} `}${e.getDate()}`;
}
</script>

<template>
  <div v-if="tour">
    <!-- hero -->
    <section class="relative isolate overflow-hidden bg-ink">
      <img
        :src="tour.image ?? '/images/hero-steppe.svg'"
        :alt="tour.title"
        class="absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/40" />
      <div class="container-site relative pb-12 pt-10 text-white lg:pb-16 lg:pt-14">
        <Breadcrumb light :items="[{ label: 'Tours', href: '/tours' }, { label: tour.title }]" />
        <div class="mt-6 flex flex-wrap items-center gap-2">
          <span class="rounded-md bg-white px-2.5 py-1 text-[11px] font-bold text-slate-800">
            {{ tour.type === "join" ? "Join in" : "Private" }}
          </span>
          <span v-if="tour.is_best_seller" class="rounded-md bg-primary-700 px-2.5 py-1 text-[11px] font-bold text-white">
            Best seller
          </span>
        </div>
        <h1 class="mt-3 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight lg:text-[3.2rem]">
          {{ tour.title }}
        </h1>
        <p class="mt-3 max-w-2xl text-white/85">{{ tour.excerpt }}</p>
        <div class="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold">
          <span class="flex items-center gap-1.5">
            <Clock :size="15" class="text-accent-400" />
            {{ tour.duration_days }} {{ tour.duration_days === 1 ? "day" : "days" }}
          </span>
          <span v-if="tour.reviews_count > 0" class="flex items-center gap-1.5">
            <Star :size="15" class="fill-accent-400 text-accent-400" />
            {{ Number(tour.rating).toFixed(1) }} · {{ tour.reviews_count }} reviews
          </span>
          <span v-if="tour.destinations && tour.destinations.length > 0" class="flex items-center gap-1.5">
            <MapPin :size="15" class="text-accent-400" />
            {{ tour.destinations.map((d) => d.name).join(" · ") }}
          </span>
        </div>
      </div>
    </section>

    <!-- tab nav -->
    <nav aria-label="Tour sections" class="sticky top-[61px] z-30 border-b border-slate-200 bg-white">
      <div class="container-site no-scrollbar flex items-center gap-6 overflow-x-auto">
        <a
          v-for="[href, label] in tabs"
          :key="href"
          :href="href"
          class="relative shrink-0 border-b-[3px] border-transparent py-3.5 text-sm font-bold text-slate-600 transition-colors hover:border-primary-700 hover:text-primary-700"
        >
          {{ label }}
        </a>
        <a href="#book" class="btn-primary btn-sm my-2 ml-auto hidden shrink-0 sm:inline-flex">Book now</a>
      </div>
    </nav>

    <div class="container-site grid gap-10 py-12 lg:grid-cols-[1fr_330px]">
      <!-- ── main column ── -->
      <div class="min-w-0">
        <!-- overview -->
        <section id="overview" class="scroll-mt-32">
          <div class="prose-site whitespace-pre-line">{{ tour.overview }}</div>
          <div v-if="tour.highlights" class="mt-6 rounded-xl bg-blush p-6">
            <h2 class="text-lg font-extrabold text-slate-900">What we expect</h2>
            <ul class="mt-3 grid gap-2.5 sm:grid-cols-2">
              <li v-for="h in tour.highlights" :key="h" class="flex items-start gap-2 text-sm text-slate-700">
                <Check :size="16" class="mt-0.5 shrink-0 text-primary-700" />
                {{ h }}
              </li>
            </ul>
          </div>
        </section>

        <!-- itinerary -->
        <section v-if="tour.itinerary_days && tour.itinerary_days.length > 0" id="itinerary" class="mt-12 scroll-mt-32">
          <h2 class="text-2xl font-extrabold text-slate-900">Itinerary</h2>
          <p class="mb-5 mt-1 text-sm text-slate-500">
            Day by day tour plan with highlights, distances and activities.
          </p>
          <ItineraryAccordion :days="tour.itinerary_days" />
        </section>

        <!-- price & date -->
        <section id="price-date" class="mt-12 scroll-mt-32">
          <h2 class="text-2xl font-extrabold text-slate-900">Price &amp; Date</h2>
          <p class="mb-5 mt-1 text-sm text-slate-500">Tour cost, departure dates, and price differences.</p>
          <div class="grid gap-6 md:grid-cols-2">
            <div v-if="tour.prices && tour.prices.length > 0" class="rounded-xl border border-slate-200 p-6">
              <h3 class="font-extrabold text-slate-900">Pax based price</h3>
              <div class="mt-4 divide-y divide-slate-100">
                <div v-for="tier in tour.prices" :key="tier.id" class="flex items-center justify-between py-3">
                  <span class="text-sm font-semibold text-slate-600">
                    Pax {{ tier.min_people }}–{{ tier.max_people }}
                  </span>
                  <span class="text-lg font-extrabold text-primary-700">
                    {{ Number(tier.price).toLocaleString() }} USD
                  </span>
                </div>
              </div>
              <p class="mt-3 text-xs text-slate-400">
                Per person, depending on group size. Larger groups travel cheaper.
              </p>
            </div>
            <div class="rounded-xl border border-slate-200 p-6">
              <h3 class="font-extrabold text-slate-900">Tour schedule</h3>
              <template v-if="departures.length > 0">
                <div class="mt-4 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
                  <div
                    v-for="d in departures"
                    :key="d.id"
                    class="flex items-center justify-between border-b border-slate-100 py-2.5"
                  >
                    <span class="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <CalendarClock :size="14" class="shrink-0 text-primary-700" />
                      {{ formatRange(d.start_date, d.end_date) }}
                    </span>
                    <span
                      class="text-[11px] font-bold"
                      :class="d.status === 'guaranteed' ? 'text-wa-700' : 'text-slate-400'"
                    >
                      {{ d.status === "guaranteed" ? `${d.seats_left} seats left` : "Open" }}
                    </span>
                  </div>
                </div>
                <p class="mt-3 text-xs text-slate-400">
                  If any of the listed group dates do not fit your schedule,
                  <NuxtLink to="/contact" class="font-bold text-primary-700 hover:underline">contact us</NuxtLink>
                  for your own private booking.
                </p>
              </template>
              <p v-else class="mt-4 text-sm text-slate-500">
                This tour runs privately on your dates —
                <NuxtLink to="/contact" class="font-bold text-primary-700 hover:underline">
                  tell us when you want to travel</NuxtLink>.
              </p>
            </div>
          </div>
        </section>

        <!-- included / excluded -->
        <section id="included" class="mt-12 scroll-mt-32">
          <h2 class="text-2xl font-extrabold text-slate-900">What's included</h2>
          <p class="mb-5 mt-1 text-sm text-slate-500">
            Accommodation, transport, meals, guide and full service inclusions.
          </p>
          <div class="space-y-5">
            <div class="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
              <h3 class="font-extrabold text-emerald-900">Services included</h3>
              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  v-for="item in tour.included ?? []"
                  :key="item"
                  class="flex items-center gap-1.5 rounded-md border border-emerald-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700"
                >
                  <Check :size="13" class="shrink-0 text-emerald-600" />
                  {{ item }}
                </span>
              </div>
            </div>
            <div class="rounded-xl border border-primary-200 bg-primary-50/50 p-6">
              <h3 class="font-extrabold text-primary-900">Services not included</h3>
              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  v-for="item in tour.excluded ?? []"
                  :key="item"
                  class="flex items-center gap-1.5 rounded-md border border-primary-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700"
                >
                  <X :size="13" class="shrink-0 text-primary-600" />
                  {{ item }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- good to know -->
        <section v-if="tour.good_to_know && tour.good_to_know.length > 0" id="good-to-know" class="mt-12 scroll-mt-32">
          <h2 class="text-2xl font-extrabold text-slate-900">Good to know</h2>
          <p class="mb-5 mt-1 text-sm text-slate-500">
            Important tips, weather, packing advice, and local travel notes.
          </p>
          <div class="grid gap-5 sm:grid-cols-2">
            <div v-for="(item, i) in tour.good_to_know" :key="item.title" class="rounded-xl bg-slate-50 p-6">
              <component :is="GOOD_TO_KNOW_ICONS[i % GOOD_TO_KNOW_ICONS.length]" :size="22" class="text-primary-700" />
              <h3 class="mt-3 font-extrabold text-slate-900">{{ item.title }}</h3>
              <p class="mt-1.5 text-sm leading-relaxed text-slate-600">{{ item.body }}</p>
            </div>
          </div>
        </section>

        <!-- reviews -->
        <section v-if="tour.testimonials && tour.testimonials.length > 0" id="reviews" class="mt-12 scroll-mt-32">
          <h2 class="text-2xl font-extrabold text-slate-900">Reviews</h2>
          <p class="mb-5 mt-1 text-sm text-slate-500">
            Genuine traveler feedback from this experience in Mongolia.
          </p>
          <TestimonialMasonry :testimonials="tour.testimonials" />
        </section>

        <!-- booking -->
        <section id="book" class="mt-12 scroll-mt-32">
          <div class="rounded-xl border border-slate-200 p-6 lg:p-8">
            <h2 class="text-2xl font-extrabold text-slate-900">Book this tour</h2>
            <p class="mb-6 mt-1 text-sm text-slate-500">
              No payment now — we confirm availability first, then arrange secure payment.
            </p>
            <BookingForm :tour-id="tour.id" :tour-title="tour.title" :departures="departures" />
          </div>
        </section>
      </div>

      <!-- ── sidebar ── -->
      <aside class="lg:sticky lg:top-32 lg:self-start">
        <div class="overflow-hidden rounded-xl border border-slate-200 shadow-card">
          <div class="bg-blush px-6 py-5">
            <template v-if="Number(tour.price_from) > 0">
              <p class="text-xs font-bold uppercase tracking-wide text-slate-500">From</p>
              <p class="text-3xl font-extrabold text-primary-700">
                {{ Number(tour.price_from).toLocaleString() }} USD
                <span class="text-sm font-semibold text-slate-500"> /person</span>
              </p>
            </template>
            <template v-else>
              <p class="text-xs font-bold uppercase tracking-wide text-slate-500">Private tour</p>
              <p class="text-2xl font-extrabold text-primary-700">Price on request</p>
            </template>
          </div>
          <div class="space-y-2.5 p-6">
            <a href="#book" class="btn-primary btn-md w-full">Book now</a>
            <NuxtLink to="/contact" class="btn-outline btn-md w-full">Inquire now</NuxtLink>
            <ul class="space-y-2 pt-3 text-[13px] text-slate-600">
              <li class="flex items-start gap-2">
                <Check :size="14" class="mt-0.5 shrink-0 text-wa-700" />
                Free cancellation up to 30 days before departure
              </li>
              <li class="flex items-start gap-2">
                <Check :size="14" class="mt-0.5 shrink-0 text-wa-700" />
                {{ tour.duration_days }}-day {{ tour.type === "join" ? "small group" : "private" }} tour
              </li>
              <li class="flex items-start gap-2">
                <Check :size="14" class="mt-0.5 shrink-0 text-wa-700" />
                Local team, replies within 24 hours
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>

    <!-- related -->
    <section v-if="tour.related && tour.related.length > 0" class="section bg-slate-50">
      <div class="container-site">
        <Reveal>
          <h2 class="mb-8 text-3xl font-extrabold tracking-tight text-slate-900">Related tours</h2>
        </Reveal>
        <div class="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal v-for="(t, i) in tour.related" :key="t.id" :delay="i * 90">
            <TourCard :tour="t" />
          </Reveal>
        </div>
      </div>
    </section>
  </div>
</template>
