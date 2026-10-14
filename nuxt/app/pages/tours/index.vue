<script setup lang="ts">
import { getTourFilters, getTours, useSettings } from "~/composables/useApi";

const route = useRoute();
const settings = useSettings();

useSeoMeta({
  title: "Mongolia Tours",
  description:
    "Small group and private tours across Mongolia — the Gobi, Naadam, Khuvsgul, the Altai and beyond. Filter by theme, duration and destination.",
});

const FILTER_KEYS = ["type", "category", "destination", "duration", "search", "sort", "page"];

const queryString = computed(() => {
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const value = route.query[key];
    if (typeof value === "string" && value) params.set(key, value);
  }
  return params.toString();
});

const { data: tours } = await useAsyncData(
  "tours",
  () => getTours(queryString.value),
  { watch: [queryString] },
);
const { data: filters } = await useAsyncData("tour-filters", () => getTourFilters());
</script>

<template>
  <div>
    <section class="relative isolate overflow-hidden bg-ink">
      <img src="/images/hero-steppe.svg" alt="" class="absolute inset-0 h-full w-full object-cover opacity-90" aria-hidden="true" />
      <div class="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/60" />
      <div class="container-site relative py-16 text-white lg:py-24">
        <Breadcrumb light :items="[{ label: 'Tours' }]" />
        <div class="mt-6 flex items-end justify-between gap-8">
          <div class="max-w-2xl">
            <h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl">Mongolia Tours</h1>
            <p class="mt-4 leading-relaxed text-white/85">
              {{ settings.site_name }} provides a large number of tours and
              packages, all of them designed with the utmost consideration into
              what travelers like you want most out of their trip.
            </p>
          </div>
          <div class="hidden shrink-0 md:block">
            <AwardBadge :size="88" />
          </div>
        </div>
      </div>
    </section>

    <section class="section !pt-10">
      <div class="container-site grid gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          <ToursToolbar :total="tours?.total ?? 0" />
          <div v-if="!tours || tours.data.length === 0" class="mt-8 rounded-xl bg-slate-50 p-14 text-center">
            <p class="text-lg font-extrabold text-slate-800">No tours match those filters</p>
            <p class="mt-1 text-sm text-slate-500">
              Try removing a filter — or tell us what you're looking for and we'll design it privately.
            </p>
          </div>
          <div v-else class="mt-6 grid gap-7 sm:grid-cols-2">
            <TourCard v-for="tour in tours.data" :key="tour.id" :tour="tour" />
          </div>
          <AppPagination
            :current-page="tours?.current_page ?? 1"
            :last-page="tours?.last_page ?? 1"
            base-path="/tours"
          />
        </div>

        <aside class="space-y-4">
          <TourFilters
            :options="filters ?? { categories: [], destinations: [], durations: [], types: [] }"
          />
          <HelpCard />
        </aside>
      </div>
    </section>
  </div>
</template>
