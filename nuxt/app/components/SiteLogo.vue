<script setup lang="ts">
defineProps<{ name?: string; light?: boolean; tagline?: string }>();
</script>

<template>
  <span class="flex items-center gap-2.5">
    <!-- logo-dark has the black script re-inked white for dark surfaces -->
    <img
      :src="light ? '/images/logo-dark.png' : '/images/logo.png'"
      :alt="name ?? 'Magnificent Mongolia'"
      class="h-11 w-auto shrink-0"
      decoding="async"
    />
    <span class="leading-tight">
      <span
        class="block text-lg font-extrabold uppercase tracking-tight"
        :class="light ? 'text-white' : 'text-primary-900'"
      >
        {{ name ?? "Magnificent Mongolia" }}
      </span>
      <span class="block text-[11px] italic" :class="light ? 'text-primary-200' : 'text-primary-700'">
        {{ tagline ?? "Authentic Mongolian Tours" }}
      </span>
    </span>
  </span>
</template>
