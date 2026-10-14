<script setup lang="ts">
import { ChevronRight, House } from "lucide-vue-next";

defineProps<{
  items: { label: string; href?: string }[];
  light?: boolean;
}>();
</script>

<template>
  <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-xs font-semibold">
    <NuxtLink
      to="/"
      :class="light ? 'text-white/70 hover:text-white' : 'text-slate-400 hover:text-slate-700'"
      aria-label="Home"
    >
      <House :size="13" />
    </NuxtLink>
    <span v-for="(item, i) in items" :key="item.label" class="flex items-center gap-1.5">
      <ChevronRight :size="12" :class="light ? 'text-white/50' : 'text-slate-300'" />
      <NuxtLink
        v-if="item.href && i < items.length - 1"
        :to="item.href"
        :class="light ? 'text-white/70 hover:text-white' : 'text-slate-400 hover:text-slate-700'"
      >
        {{ item.label }}
      </NuxtLink>
      <span v-else :class="light ? 'text-white/90' : 'text-slate-600'">{{ item.label }}</span>
    </span>
  </nav>
</template>
