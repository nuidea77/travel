<script setup lang="ts">
import { getDepartures } from "~/composables/useApi";
import type { Departure } from "~/types";

useSeoMeta({
  title: "Trip Calendar",
  description:
    "All upcoming small-group departures across Mongolia, month by month. Guaranteed departures marked.",
});

const { data: departures } = await useAsyncData("departures", () => getDepartures());

function monthKey(date: string) {
  return new Date(date).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function anchorFor(month: string) {
  return month.toLowerCase().replace(/\s+/g, "-");
}

function formatShort(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

const byMonth = computed(() => {
  const map = new Map<string, Departure[]>();
  for (const departure of departures.value ?? []) {
    const key = monthKey(departure.start_date);
    map.set(key, [...(map.get(key) ?? []), departure]);
  }
  return map;
});

const months = computed(() => Array.from(byMonth.value.keys()));

const seasonYear = computed(() => {
  const first = departures.value?.[0];
  return first ? new Date(first.start_date).getFullYear() : new Date().getFullYear();
});
</script>

<template>
  <div>
    <section class="relative isolate overflow-hidden bg-ink">
      <img src="/images/gobi-dunes.svg" alt="" class="absolute inset-0 h-full w-full object-cover opacity-90" aria-hidden="true" />
      <div class="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/65" />
      <div class="container-site relative py-16 text-white lg:py-24">
        <Breadcrumb light :items="[{ label: 'Trip Calendar' }]" />
        <h1 class="mt-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Welcome to Trip Calendar {{ seasonYear }}!
        </h1>
        <p class="mt-4 max-w-2xl leading-relaxed text-white/85">
          We have been developing tours for small groups since 2017. Here are the
          details of our small group tours with guaranteed departure dates — the
          best option for those who are eager to see all of Mongolia's most
          popular places at a reasonable price.
        </p>
      </div>
    </section>

    <!-- month tabs -->
    <nav v-if="months.length > 0" aria-label="Months" class="sticky top-[61px] z-30 border-b border-slate-200 bg-white">
      <div class="container-site no-scrollbar flex gap-6 overflow-x-auto">
        <a
          v-for="month in months"
          :key="month"
          :href="`#${anchorFor(month)}`"
          class="shrink-0 border-b-[3px] border-transparent py-3.5 text-sm font-bold text-slate-600 transition-colors hover:border-primary-700 hover:text-primary-700"
        >
          {{ month.split(" ")[0] }}
          <span class="ml-1 text-xs font-semibold text-slate-400">{{ month.split(" ")[1] }}</span>
        </a>
      </div>
    </nav>

    <section class="section !pt-10">
      <div class="container-site">
        <div v-if="months.length === 0" class="rounded-xl bg-slate-50 p-14 text-center">
          <p class="text-lg font-extrabold text-slate-800">No scheduled departures right now</p>
          <p class="mt-1 text-sm text-slate-500">All of our tours also run privately on your dates.</p>
          <NuxtLink to="/tours" class="btn-primary btn-md mt-5">Browse tours</NuxtLink>
        </div>

        <div v-for="month in months" :id="anchorFor(month)" :key="month" class="mb-12 scroll-mt-36">
          <h2 class="mb-4 text-2xl font-extrabold text-slate-900">{{ month }}</h2>
          <div class="overflow-x-auto rounded-xl border border-slate-200">
            <table class="w-full min-w-[760px] text-sm">
              <thead>
                <tr class="border-b border-slate-200 bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th class="px-5 py-3.5">Date</th>
                  <th class="px-5 py-3.5">Tour</th>
                  <th class="px-5 py-3.5">Duration</th>
                  <th class="px-5 py-3.5">Status</th>
                  <th class="px-5 py-3.5">Tour info</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="d in byMonth.get(month)" :key="d.id" class="align-top transition-colors hover:bg-blush/50">
                  <td class="whitespace-nowrap px-5 py-4 font-semibold text-slate-700">
                    {{ formatShort(d.start_date) }} – {{ formatShort(d.end_date) }}
                  </td>
                  <td class="px-5 py-4">
                    <NuxtLink
                      :to="`/tours/${d.tour?.slug}#book`"
                      class="font-bold text-primary-700 hover:text-primary-900 hover:underline"
                    >
                      {{ d.tour?.title }}
                    </NuxtLink>
                  </td>
                  <td class="whitespace-nowrap px-5 py-4 text-slate-600">{{ d.tour?.duration_days }} days</td>
                  <td class="whitespace-nowrap px-5 py-4">
                    <span class="font-bold" :class="d.status === 'guaranteed' ? 'text-wa-700' : 'text-slate-600'">
                      {{ d.status === "guaranteed" ? `${d.seats_left} seats left` : "Bookings open" }}
                    </span>
                  </td>
                  <td class="max-w-md px-5 py-4 text-[13px] leading-relaxed text-slate-500">
                    {{ d.tour?.excerpt }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
