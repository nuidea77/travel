<script setup lang="ts">
import { Check, RotateCcw } from "lucide-vue-next";
import type { TourFilterOptions } from "~/types";

defineProps<{ options: TourFilterOptions }>();

const route = useRoute();
const router = useRouter();

const FILTER_KEYS = ["type", "category", "destination", "duration"];

function setParam(key: string, value: string) {
  const query: Record<string, string> = {};
  for (const [k, v] of Object.entries(route.query)) {
    if (typeof v === "string" && v) query[k] = v;
  }
  if (query[key] === value) {
    delete query[key];
  } else {
    query[key] = value;
  }
  delete query.page;
  router.push({ path: "/tours", query });
}

function clearAll() {
  const query: Record<string, string> = {};
  for (const [k, v] of Object.entries(route.query)) {
    if (typeof v === "string" && v && !FILTER_KEYS.includes(k) && k !== "page") {
      query[k] = v;
    }
  }
  router.push({ path: "/tours", query });
}

const hasActive = computed(() => FILTER_KEYS.some((k) => route.query[k]));
const isActive = (key: string, value: string) => route.query[key] === value;
</script>

<template>
  <div class="space-y-4">
    <button
      v-if="hasActive"
      class="flex items-center gap-1.5 text-xs font-bold text-primary-700 hover:text-primary-900"
      @click="clearAll"
    >
      <RotateCcw :size="12" /> Reset all filters
    </button>

    <section
      v-for="group in [
        { title: 'Tour type', key: 'type', tint: true, items: options.types.map((t) => ({ value: t.value, label: t.label })) },
        { title: 'Theme', key: 'category', tint: false, items: options.categories.map((c) => ({ value: c.slug, label: c.name })) },
        { title: 'Duration', key: 'duration', tint: false, items: options.durations.map((d) => ({ value: d.value, label: d.label })) },
        { title: 'Destination', key: 'destination', tint: false, items: options.destinations.map((d) => ({ value: d.slug, label: d.name })) },
      ]"
      :key="group.key"
      class="rounded-xl p-5"
      :class="group.tint ? 'bg-amber-50' : 'bg-slate-50'"
    >
      <h3 class="mb-2 text-[15px] font-extrabold text-slate-900">{{ group.title }}</h3>
      <div>
        <button
          v-for="item in group.items"
          :key="item.value"
          class="flex w-full items-center gap-2.5 py-[7px] text-left text-sm text-slate-700 transition-colors hover:text-primary-700"
          @click="setParam(group.key, item.value)"
        >
          <span
            class="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border transition-colors"
            :class="isActive(group.key, item.value) ? 'border-primary-700 bg-primary-700 text-white' : 'border-slate-300 bg-white'"
            aria-hidden="true"
          >
            <Check v-if="isActive(group.key, item.value)" :size="12" :stroke-width="3.5" />
          </span>
          <span :class="isActive(group.key, item.value) ? 'font-bold text-primary-800' : ''">
            {{ item.label }}
          </span>
        </button>
      </div>
    </section>
  </div>
</template>
