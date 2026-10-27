<script setup lang="ts">
const props = defineProps<{
  title: string;
  subtitle?: string | null;
  image?: string | null;
  breadcrumb?: string;
}>();

const bg = computed(() => props.image ?? "/images/hero.jpg");
</script>

<template>
  <section class="relative isolate overflow-hidden bg-ink">
    <img :src="bg" alt="" class="absolute inset-0 h-full w-full object-cover opacity-90" aria-hidden="true" />
    <div class="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/60" />
    <!-- extra top padding clears the fixed transparent header -->
    <div class="container-site relative pb-16 pt-32 text-white lg:pb-24 lg:pt-44">
      <Breadcrumb light :items="[{ label: breadcrumb ?? title }]" />
      <h1 class="mt-6 text-4xl font-extrabold tracking-tight lg:text-5xl">{{ title }}</h1>
      <p v-if="subtitle" class="mt-4 max-w-2xl leading-relaxed text-white/85">{{ subtitle }}</p>
      <slot />
    </div>
  </section>
</template>
