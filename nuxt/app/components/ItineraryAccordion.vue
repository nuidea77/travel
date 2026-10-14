<script setup lang="ts">
import { BedDouble, ChevronDown, Route } from "lucide-vue-next";
import type { ItineraryDay } from "~/types";

defineProps<{ days: ItineraryDay[] }>();

const open = ref<number | null>(1);

function mealsLabel(meals: string | null): string {
  if (!meals) return "—";
  const map: Record<string, string> = { B: "Breakfast", L: "Lunch", D: "Dinner" };
  return meals
    .split("+")
    .map((m) => map[m.trim()] ?? m.trim())
    .join(" · ");
}
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-slate-200">
    <div v-for="day in days" :key="day.id" class="border-b border-slate-100 last:border-b-0">
      <button
        class="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors"
        :class="open === day.day_number ? 'bg-primary-50/50' : 'hover:bg-slate-50'"
        :aria-expanded="open === day.day_number"
        @click="open = open === day.day_number ? null : day.day_number"
      >
        <span class="w-14 shrink-0 text-sm font-extrabold text-primary-700">
          Day {{ day.day_number }}
        </span>
        <span class="flex-1 text-[15px] font-bold text-slate-900">
          {{ day.title }}
        </span>
        <span class="hidden shrink-0 text-xs font-semibold text-slate-400 md:block">
          {{ mealsLabel(day.meals) }}
        </span>
        <span
          class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all"
          :class="open === day.day_number ? 'border-primary-700 bg-primary-700 text-white' : 'border-slate-300 text-slate-400'"
        >
          <ChevronDown
            :size="14"
            class="transition-transform"
            :class="{ 'rotate-180': open === day.day_number }"
          />
        </span>
      </button>

      <div v-if="open === day.day_number" class="px-5 pb-5 md:pl-[76px]">
        <p class="text-sm leading-relaxed text-slate-600">
          {{ day.description }}
        </p>
        <div class="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
          <span class="md:hidden">Meals: {{ mealsLabel(day.meals) }}</span>
          <span v-if="day.accommodation" class="flex items-center gap-1.5">
            <BedDouble :size="13" class="text-primary-700" />
            {{ day.accommodation }}
          </span>
          <span v-if="day.distance" class="flex items-center gap-1.5">
            <Route :size="13" class="text-primary-700" />
            {{ day.distance }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
