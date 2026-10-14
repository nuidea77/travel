<script setup lang="ts">
import { SlidersHorizontal, X } from "lucide-vue-next";
import type { TourFilterOptions } from "~/types";

defineProps<{ options: TourFilterOptions }>();

const route = useRoute();
const mobileOpen = ref(false);

const hasActive = computed(() =>
  ["type", "category", "destination", "duration"].some((k) => route.query[k]),
);

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false;
  },
);
</script>

<template>
  <!-- mobile trigger -->
  <button class="btn-outline btn-md w-full lg:hidden" @click="mobileOpen = true">
    <SlidersHorizontal :size="15" /> Filters
    <span v-if="hasActive" class="rounded-full bg-primary-700 px-2 py-0.5 text-[11px] font-bold text-white">on</span>
  </button>

  <!-- mobile drawer -->
  <div v-if="mobileOpen" class="fixed inset-0 z-[60] lg:hidden">
    <div class="absolute inset-0 bg-slate-900/50" @click="mobileOpen = false" />
    <div class="absolute inset-y-0 right-0 w-[85%] max-w-sm overflow-y-auto bg-white p-6">
      <button class="mb-4 ml-auto flex rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Close filters" @click="mobileOpen = false">
        <X :size="20" />
      </button>
      <TourFilterBoxes :options="options" />
    </div>
  </div>

  <!-- desktop sidebar -->
  <div class="hidden lg:block">
    <TourFilterBoxes :options="options" />
  </div>
</template>
