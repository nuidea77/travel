<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

const props = defineProps<{
  currentPage: number;
  lastPage: number;
  basePath: string;
}>();

const route = useRoute();

function hrefFor(page: number) {
  const query: Record<string, string> = {};
  for (const [k, v] of Object.entries(route.query)) {
    if (typeof v === "string" && k !== "page") query[k] = v;
  }
  if (page > 1) query.page = String(page);
  return { path: props.basePath, query };
}

const items = computed<(number | "…")[]>(() => {
  const pages = Array.from({ length: props.lastPage }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === props.lastPage || Math.abs(p - props.currentPage) <= 1,
  );
  const out: (number | "…")[] = [];
  pages.forEach((p, i) => {
    const prev = pages[i - 1];
    if (i > 0 && prev !== undefined && p - prev > 1) out.push("…");
    out.push(p);
  });
  return out;
});

const navCls =
  "flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:border-primary-700 hover:text-primary-700";
</script>

<template>
  <nav v-if="lastPage > 1" class="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
    <NuxtLink v-if="currentPage > 1" :to="hrefFor(currentPage - 1)" :class="navCls" aria-label="Previous page">
      <ChevronLeft :size="15" />
    </NuxtLink>
    <template v-for="(item, i) in items" :key="`${item}-${i}`">
      <span v-if="item === '…'" class="px-1 text-slate-400">…</span>
      <NuxtLink
        v-else
        :to="hrefFor(item)"
        :aria-current="item === currentPage ? 'page' : undefined"
        class="flex h-9 w-9 items-center justify-center rounded-md text-sm font-bold transition-colors"
        :class="
          item === currentPage
            ? 'bg-primary-700 text-white shadow-sm'
            : 'border border-slate-200 text-slate-600 hover:border-primary-700 hover:text-primary-700'
        "
      >
        {{ item }}
      </NuxtLink>
    </template>
    <NuxtLink v-if="currentPage < lastPage" :to="hrefFor(currentPage + 1)" :class="navCls" aria-label="Next page">
      <ChevronRight :size="15" />
    </NuxtLink>
  </nav>
</template>
