<script setup lang="ts">
import { getPage } from "~/composables/useApi";

const { data: page } = await useAsyncData("page-car-rental", () => getPage("car-rental"));

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: "Page not found" });
}

useSeoMeta({
  title: "Car Rental",
  description:
    "Land Cruisers, UAZ vans and minibuses with professional drivers for your own Mongolian expedition.",
});
</script>

<template>
  <div v-if="page">
    <PageHero :title="page.title" :subtitle="page.subtitle" :image="page.image" breadcrumb="Car Rental" />
    <section class="section !pt-12">
      <div class="container-site grid gap-12 lg:grid-cols-[1fr_360px]">
        <div>
          <!-- Page bodies are trusted content authored in our own admin panel. -->
          <div class="prose-site max-w-3xl" v-html="page.body" />
          <div class="mt-8 flex flex-wrap gap-4">
            <NuxtLink to="/contact" class="btn-primary btn-md">Request a quote</NuxtLink>
            <NuxtLink to="/tours" class="btn-outline btn-md">Or take a guided tour</NuxtLink>
          </div>
        </div>
        <aside class="lg:sticky lg:top-24 lg:self-start">
          <HelpCard />
        </aside>
      </div>
    </section>
  </div>
</template>
