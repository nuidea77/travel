<script setup lang="ts">
import { getPage, useSettings } from "~/composables/useApi";

const settings = useSettings();

const { data: page } = await useAsyncData("page-about-us", () => getPage("about-us"));

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: "Page not found" });
}

useSeoMeta({
  title: "About Us",
  description: "A local Mongolian team guiding travelers across all five regions of the country.",
});
</script>

<template>
  <div v-if="page">
    <PageHero :title="page.title" :subtitle="page.subtitle" :image="page.image" breadcrumb="About Us" />
    <section class="section !pt-12">
      <div class="container-site grid gap-12 lg:grid-cols-[1fr_320px]">
        <!-- Page bodies are trusted content authored in our own admin panel. -->
        <div class="prose-site max-w-3xl" v-html="page.body" />
        <aside class="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div v-if="settings.stats.length > 0" class="rounded-2xl bg-blush p-6">
            <h2 class="text-sm font-extrabold uppercase tracking-wider text-slate-900">At a glance</h2>
            <dl class="mt-4 space-y-4">
              <div v-for="stat in settings.stats" :key="stat.label" class="flex items-baseline justify-between gap-3">
                <dt class="text-sm text-slate-600">{{ stat.label }}</dt>
                <dd class="text-xl font-extrabold text-primary-700">{{ stat.value }}</dd>
              </div>
            </dl>
          </div>
          <div class="rounded-2xl border border-slate-200 p-6 text-center">
            <h2 class="font-extrabold text-slate-900">Meet us on the steppe</h2>
            <p class="mt-1.5 text-sm text-slate-600">The best introduction is a journey together.</p>
            <NuxtLink to="/tours" class="btn-primary btn-md mt-4 w-full">Browse tours</NuxtLink>
            <NuxtLink to="/contact" class="btn-outline btn-md mt-2.5 w-full">Talk to the team</NuxtLink>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>
