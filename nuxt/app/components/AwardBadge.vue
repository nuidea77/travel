<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 96 });

const leaves = [0, 1, 2, 3, 4].map((i) => -35 + i * 21);
</script>

<template>
  <!-- Generic circular "Travellers' Choice"-style award medallion. -->
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 120 120"
    role="img"
    aria-label="Travellers' Choice award 2025"
    class="drop-shadow-lg"
  >
    <circle cx="60" cy="60" r="58" fill="#00aa6c" />
    <circle cx="60" cy="60" r="58" fill="none" stroke="#ffffff" stroke-width="3" />
    <circle cx="60" cy="60" r="48" fill="none" stroke="#ffffff" stroke-width="1.4" opacity="0.85" />
    <g v-for="dir in [-1, 1]" :key="dir" :transform="`translate(60 62) scale(${dir} 1)`" fill="#ffffff" opacity="0.95">
      <ellipse
        v-for="angle in leaves"
        :key="angle"
        cx="0"
        cy="0"
        rx="3.1"
        ry="7.5"
        :transform="`rotate(${angle}) translate(0 -37)`"
      />
    </g>
    <text x="60" y="48" text-anchor="middle" fill="#ffffff" font-size="9.5" font-weight="700" letter-spacing="1" font-family="system-ui, sans-serif">
      TRAVELLERS'
    </text>
    <text x="60" y="60" text-anchor="middle" fill="#ffffff" font-size="9.5" font-weight="700" letter-spacing="1.6" font-family="system-ui, sans-serif">
      CHOICE
    </text>
    <text x="60" y="80" text-anchor="middle" fill="#ffffff" font-size="15" font-weight="800" font-family="system-ui, sans-serif">
      2025
    </text>
  </svg>
</template>
