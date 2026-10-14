<script setup lang="ts">
defineProps<{ name?: string; light?: boolean; tagline?: string }>();
</script>

<template>
  <span class="flex items-center gap-2.5">
    <svg viewBox="0 0 48 48" class="h-10 w-10 shrink-0" aria-hidden="true">
      <circle cx="24" cy="24" r="23" :class="light ? 'fill-primary-500' : 'fill-primary-600'" />
      <!-- ger silhouette -->
      <path d="M10 32 L13 24 Q24 17 35 24 L38 32 Z" fill="#fff" />
      <rect x="21.5" y="26" width="5" height="6" :class="light ? 'fill-primary-500' : 'fill-primary-600'" />
      <path d="M20 20.5 L24 15 L28 20.5" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" />
      <!-- sun -->
      <circle cx="33.5" cy="13.5" r="3.2" fill="#fbbf24" />
    </svg>
    <span class="leading-tight">
      <span
        class="block text-lg font-extrabold uppercase tracking-tight"
        :class="light ? 'text-white' : 'text-primary-700'"
      >
        {{ name ?? "Magnificent Mongolia" }}
      </span>
      <span class="block text-[11px] italic" :class="light ? 'text-primary-200' : 'text-primary-600'">
        {{ tagline ?? "Authentic Mongolian Tours" }}
      </span>
    </span>
  </span>
</template>
