<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

defineProps<{ heading: string; lead?: string; label?: string }>();

const track = ref<HTMLElement | null>(null);
const canPrev = ref(false);
const canNext = ref(true);

function update() {
  const el = track.value;
  if (!el) return;
  canPrev.value = el.scrollLeft > 8;
  canNext.value = el.scrollLeft < el.scrollWidth - el.clientWidth - 8;
}

function scrollBy(dir: 1 | -1) {
  const el = track.value;
  if (!el) return;
  el.scrollBy({ left: dir * (el.clientWidth * 0.9), behavior: "smooth" });
}

onMounted(() => {
  update();
  window.addEventListener("resize", update);
  onBeforeUnmount(() => window.removeEventListener("resize", update));
});
</script>

<template>
  <div>
    <div class="mb-8 flex items-end justify-between gap-6">
      <div>
        <p v-if="label" class="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">{{ label }}</p>
        <h2 class="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
          {{ heading }}
        </h2>
        <p v-if="lead" class="mt-2 text-slate-500">{{ lead }}</p>
      </div>
      <div class="hidden shrink-0 gap-2.5 sm:flex">
        <button
          class="rounded-full border border-slate-300 p-2.5 text-slate-700 transition-all hover:border-ink hover:bg-ink hover:text-white disabled:border-slate-200 disabled:bg-transparent disabled:text-slate-300"
          :disabled="!canPrev"
          aria-label="Previous"
          @click="scrollBy(-1)"
        >
          <ChevronLeft :size="18" />
        </button>
        <button
          class="rounded-full border border-slate-300 p-2.5 text-slate-700 transition-all hover:border-ink hover:bg-ink hover:text-white disabled:border-slate-200 disabled:bg-transparent disabled:text-slate-300"
          :disabled="!canNext"
          aria-label="Next"
          @click="scrollBy(1)"
        >
          <ChevronRight :size="18" />
        </button>
      </div>
    </div>
    <div
      ref="track"
      class="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-4 pb-2 [&>*]:w-[86%] [&>*]:shrink-0 [&>*]:snap-start sm:[&>*]:w-[46%] lg:[&>*]:w-[31.5%] xl:[&>*]:w-[23.5%]"
      @scroll.passive="update"
    >
      <slot />
    </div>
  </div>
</template>
