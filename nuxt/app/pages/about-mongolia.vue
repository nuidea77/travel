<script setup lang="ts">
import { MapPin } from "lucide-vue-next";
import { getHome, getPage } from "~/composables/useApi";

const { data: page } = await useAsyncData("page-about-mongolia", () => getPage("about-mongolia"));
const { data: home } = await useAsyncData("home-for-destinations", () => getHome());

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: "Page not found" });
}

useSeoMeta({
  title: "About Mongolia",
  description:
    "The essential country guide: history, nomadic culture, landscapes and the destinations that define Mongolia.",
});
</script>

<template>
  <div v-if="page">
    <PageHero :title="page.title" :subtitle="page.subtitle" :image="page.image" breadcrumb="About Mongolia" />
    <section class="section !pt-12">
      <div class="container-site">
        <!-- Page bodies are trusted content authored in our own admin panel. -->
        <div class="prose-site mx-auto max-w-3xl" v-html="page.body" />
      </div>
    </section>

    <section id="destinations" class="section scroll-mt-24 bg-slate-50">
      <div class="container-site">
        <Reveal>
          <div class="mx-auto mb-10 max-w-2xl text-center">
            <h2 class="text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">Destinations</h2>
            <p class="mt-3 text-slate-500">
              The regions and places that define Mongolia. Tap any of them to see the tours that visit.
            </p>
          </div>
        </Reveal>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal v-for="(dest, i) in home?.destinations ?? []" :key="dest.id" :delay="(i % 3) * 80">
            <NuxtLink
              :to="`/tours?destination=${dest.slug}`"
              class="group block h-full overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div class="relative aspect-[16/9] overflow-hidden">
                <img
                  :src="dest.image ?? '/images/hero-steppe.svg'"
                  :alt="dest.name"
                  class="img-zoom absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <span
                  v-if="dest.region"
                  class="absolute left-3 top-3 rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-700"
                >
                  {{ dest.region }}
                </span>
              </div>
              <div class="p-5">
                <h3 class="flex items-center gap-1.5 font-extrabold text-slate-900 group-hover:text-primary-700">
                  <MapPin :size="15" class="text-primary-700" />
                  {{ dest.name }}
                </h3>
                <p class="mt-1.5 line-clamp-2 text-sm text-slate-600">{{ dest.description }}</p>
                <p class="mt-3 text-xs font-bold uppercase tracking-wide text-primary-700">
                  {{ dest.tours_count ?? 0 }} tours →
                </p>
              </div>
            </NuxtLink>
          </Reveal>
        </div>
      </div>
    </section>
  </div>
</template>
