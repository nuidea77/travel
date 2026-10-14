<script setup lang="ts">
import { ArrowRight } from "lucide-vue-next";
import type { Post } from "~/types";
import { formatDate } from "~/composables/useApi";

const props = defineProps<{ post: Post }>();

const image = computed(() => props.post.image ?? "/images/hero-steppe.svg");
</script>

<template>
  <article class="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
    <NuxtLink :to="`/blogs/${post.slug}`" class="relative block aspect-[16/9] overflow-hidden">
      <img :src="image" :alt="post.title" class="img-zoom absolute inset-0 h-full w-full object-cover" loading="lazy" />
    </NuxtLink>
    <div class="flex flex-1 flex-col p-5">
      <div class="flex flex-wrap items-center gap-2">
        <span
          v-if="post.category"
          class="rounded border border-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500"
        >
          {{ post.category.name }}
        </span>
        <span class="text-[11px] text-slate-400">
          {{ formatDate(post.published_at) }} · {{ post.read_time }} min
        </span>
      </div>
      <h3 class="mt-2.5 text-lg font-extrabold leading-snug text-slate-900">
        <NuxtLink :to="`/blogs/${post.slug}`" class="transition-colors group-hover:text-primary-700">
          {{ post.title }}
        </NuxtLink>
      </h3>
      <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
        {{ post.excerpt }}
      </p>
      <NuxtLink
        :to="`/blogs/${post.slug}`"
        class="mt-auto flex items-center gap-2 pt-4 text-sm font-bold text-primary-700 transition-colors hover:text-primary-900"
      >
        Read
        <span class="flex h-7 w-7 items-center justify-center rounded-full border border-primary-300 transition-all group-hover:border-primary-700 group-hover:bg-primary-700 group-hover:text-white">
          <ArrowRight :size="13" />
        </span>
      </NuxtLink>
    </div>
  </article>
</template>
