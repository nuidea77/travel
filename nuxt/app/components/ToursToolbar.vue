<script setup lang="ts">
import { Search } from "lucide-vue-next";

defineProps<{ total: number }>();

const route = useRoute();
const router = useRouter();
const search = ref(typeof route.query.search === "string" ? route.query.search : "");

watch(
  () => route.query.search,
  (value) => {
    search.value = typeof value === "string" ? value : "";
  },
);

const SORTS = [
  { value: "", label: "Recommended" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "duration", label: "Duration" },
  { value: "rating", label: "Top rated" },
];

function apply(key: string, value: string) {
  const query: Record<string, string> = {};
  for (const [k, v] of Object.entries(route.query)) {
    if (typeof v === "string" && v) query[k] = v;
  }
  if (value) {
    query[key] = value;
  } else {
    delete query[key];
  }
  delete query.page;
  router.push({ path: "/tours", query });
}

const sort = computed({
  get: () => (typeof route.query.sort === "string" ? route.query.sort : ""),
  set: (value: string) => apply("sort", value),
});
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <p class="text-sm text-slate-500">
      <span class="font-extrabold text-slate-900">{{ total }}</span>
      {{ total === 1 ? "tour" : "tours" }} found
    </p>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <form class="relative" @submit.prevent="apply('search', search.trim())">
        <Search :size="15" class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          v-model="search"
          placeholder="Search tours…"
          class="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 sm:w-56"
        />
      </form>
      <select
        v-model="sort"
        class="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 focus:border-primary-500 focus:outline-none"
        aria-label="Sort tours"
      >
        <option v-for="s in SORTS" :key="s.value" :value="s.value">{{ s.label }}</option>
      </select>
    </div>
  </div>
</template>
