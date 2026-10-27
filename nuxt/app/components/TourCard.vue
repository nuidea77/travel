<script setup lang="ts">
import { ArrowRight, ArrowUpRight } from "lucide-vue-next";
import type { Tour } from "~/types";

const props = defineProps<{ tour: Tour }>();

const image = computed(() => props.tour.image ?? "/images/hero.jpg");
</script>

<template>
  <article class="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
    <NuxtLink :to="`/tours/${tour.slug}`" class="relative block">
      <div class="relative aspect-[4/3] overflow-hidden">
        <img
          :src="image"
          :alt="tour.title"
          class="img-zoom absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/10" />

        <div class="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          <span class="rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-slate-800 shadow-sm">
            {{ tour.type === "join" ? "Join in" : "Private" }}
          </span>
          <span
            v-if="tour.is_best_seller"
            class="rounded-full bg-ink px-3 py-1 text-[11px] font-bold text-white shadow-sm"
          >
            Best seller
          </span>
        </div>

        <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
          <div class="min-w-0">
            <h3 class="line-clamp-2 text-lg font-extrabold leading-snug text-white drop-shadow">
              {{ tour.title }}
            </h3>
            <p class="mt-1 text-xs font-semibold text-white/80">
              {{ tour.duration_days }} {{ tour.duration_days === 1 ? "day" : "days" }}
              <span class="mx-1 opacity-60">·</span>
              <template v-if="Number(tour.price_from) > 0">from {{ Number(tour.price_from).toLocaleString() }} USD</template>
              <template v-else>price on request</template>
            </p>
          </div>
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/70 text-white transition-all group-hover:bg-white group-hover:text-ink">
            <ArrowUpRight :size="16" />
          </span>
        </div>
      </div>
    </NuxtLink>

    <div class="flex flex-1 flex-col px-5 pb-5 pt-4">
      <ul v-if="tour.highlights" class="space-y-1.5">
        <li
          v-for="h in tour.highlights.slice(0, 3)"
          :key="h"
          class="flex items-start gap-2 text-[13px] leading-snug text-slate-600"
        >
          <span class="mt-[7px] h-[3px] w-2.5 shrink-0 rounded-full bg-ink/60" aria-hidden="true" />
          {{ h }}
        </li>
      </ul>

      <div class="mt-auto flex items-center justify-end border-t border-slate-100 pt-4" :class="tour.highlights ? 'mt-4' : ''">
        <NuxtLink
          :to="`/tours/${tour.slug}`"
          class="flex items-center gap-2 text-sm font-bold text-ink transition-colors hover:text-primary-700"
        >
          Discover
          <ArrowRight :size="14" />
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
