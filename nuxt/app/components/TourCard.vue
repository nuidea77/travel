<script setup lang="ts">
import { ArrowRight } from "lucide-vue-next";
import type { Tour } from "~/types";

const props = defineProps<{ tour: Tour }>();

const image = computed(() => props.tour.image ?? "/images/hero-steppe.svg");

// Diagonal photo-collage header, in the style of the reference design.
const slices = [
  { clip: "polygon(0 0, 39% 0, 26% 100%, 0 100%)", pos: "left center", scale: 1.06 },
  { clip: "polygon(41% 0, 73% 0, 60% 100%, 28% 100%)", pos: "center center", scale: 1.12 },
  { clip: "polygon(75% 0, 100% 0, 100% 100%, 62% 100%)", pos: "right center", scale: 1.18 },
];
</script>

<template>
  <article class="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
    <NuxtLink :to="`/tours/${tour.slug}`" class="relative block">
      <div class="relative aspect-[16/9] overflow-hidden bg-white">
        <div
          v-for="(slice, i) in slices"
          :key="i"
          class="absolute inset-0"
          :style="{ clipPath: slice.clip }"
        >
          <img
            :src="image"
            :alt="i === 0 ? tour.title : ''"
            class="img-zoom absolute inset-0 h-full w-full object-cover"
            :style="{ objectPosition: slice.pos, transform: `scale(${slice.scale})` }"
            loading="lazy"
          />
        </div>
      </div>
      <span class="absolute left-3 top-3 rounded-md bg-white px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-sm">
        {{ tour.type === "join" ? "Join in" : "Private" }}
      </span>
      <span
        v-if="tour.is_best_seller"
        class="absolute left-3 top-10 rounded-md bg-primary-700 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm"
      >
        Best seller
      </span>
    </NuxtLink>

    <div class="flex flex-1 flex-col px-5 pb-5 pt-4">
      <h3 class="text-lg font-extrabold leading-snug text-slate-900">
        <NuxtLink :to="`/tours/${tour.slug}`" class="transition-colors hover:text-primary-700">
          {{ tour.title }}
        </NuxtLink>
      </h3>

      <ul v-if="tour.highlights" class="mt-3 space-y-1.5">
        <li
          v-for="h in tour.highlights.slice(0, 3)"
          :key="h"
          class="flex items-start gap-2 text-[13px] leading-snug text-slate-600"
        >
          <span class="mt-[7px] h-[3px] w-2.5 shrink-0 rounded-full bg-primary-600" aria-hidden="true" />
          {{ h }}
        </li>
      </ul>

      <div class="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
        <p class="pt-0.5 text-[13px] font-semibold text-slate-700">
          {{ tour.duration_days }} {{ tour.duration_days === 1 ? "day" : "days" }}
          <span class="mx-1.5 text-slate-300">·</span>
          from {{ Number(tour.price_from).toLocaleString() }} USD
        </p>
        <NuxtLink
          :to="`/tours/${tour.slug}`"
          class="flex items-center gap-2 text-sm font-bold text-primary-700 transition-colors hover:text-primary-900"
        >
          Discover
          <span class="flex h-7 w-7 items-center justify-center rounded-full border border-primary-300 transition-all group-hover:border-primary-700 group-hover:bg-primary-700 group-hover:text-white">
            <ArrowRight :size="13" />
          </span>
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
