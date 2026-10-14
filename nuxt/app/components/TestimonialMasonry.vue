<script setup lang="ts">
import { Star } from "lucide-vue-next";
import type { Testimonial } from "~/types";

const props = defineProps<{ testimonials: Testimonial[] }>();

const expanded = ref(false);
const visible = computed(() =>
  expanded.value ? props.testimonials : props.testimonials.slice(0, 6),
);

const FLAGS: Record<string, string> = {
  "united kingdom": "🇬🇧",
  "united states": "🇺🇸",
  italy: "🇮🇹",
  germany: "🇩🇪",
  japan: "🇯🇵",
  ireland: "🇮🇪",
  france: "🇫🇷",
  australia: "🇦🇺",
  sweden: "🇸🇪",
  canada: "🇨🇦",
  netherlands: "🇳🇱",
  spain: "🇪🇸",
};

const AVATAR_COLORS = [
  "bg-primary-700",
  "bg-slate-700",
  "bg-amber-700",
  "bg-emerald-800",
  "bg-cyan-800",
  "bg-rose-800",
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}
</script>

<template>
  <div v-if="testimonials.length > 0">
    <div class="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
      <figure
        v-for="(t, i) in visible"
        :key="t.id"
        class="break-inside-avoid rounded-xl bg-white p-6 shadow-card"
      >
        <span class="font-serif text-5xl leading-none text-primary-700" aria-hidden="true">“</span>
        <blockquote class="-mt-3 text-sm leading-relaxed text-slate-600">
          {{ t.body }}
        </blockquote>
        <div class="mt-4 flex gap-0.5" :aria-label="`${t.rating} out of 5 stars`">
          <Star v-for="s in t.rating" :key="s" :size="14" class="fill-accent-400 text-accent-400" />
        </div>
        <figcaption class="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
            :class="AVATAR_COLORS[i % AVATAR_COLORS.length]"
            aria-hidden="true"
          >
            {{ initials(t.name) }}
          </span>
          <div class="min-w-0 text-sm">
            <p class="truncate font-bold text-slate-800">{{ t.name }}</p>
            <p class="truncate text-xs text-slate-500">
              {{ FLAGS[t.country.toLowerCase()] ?? "🌍" }} {{ t.country }}
            </p>
          </div>
        </figcaption>
      </figure>
    </div>
    <div v-if="testimonials.length > 6" class="mt-4 text-center">
      <button class="btn-outline btn-md" @click="expanded = !expanded">
        {{ expanded ? "Show fewer reviews" : "See more reviews" }}
      </button>
    </div>
  </div>
</template>
