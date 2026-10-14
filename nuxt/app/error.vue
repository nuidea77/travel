<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{ error: NuxtError }>();
</script>

<template>
  <div>
    <SiteHeader />
    <section class="relative isolate overflow-hidden bg-ink">
      <img src="/images/gobi-dunes.svg" alt="" class="absolute inset-0 h-full w-full object-cover opacity-90" aria-hidden="true" />
      <div class="absolute inset-0 bg-black/60" />
      <div class="container-site relative flex min-h-[60vh] flex-col items-center justify-center py-24 text-center text-white">
        <p class="text-7xl font-extrabold text-accent-400">{{ error.statusCode }}</p>
        <h1 class="mt-3 text-2xl font-extrabold lg:text-3xl">
          {{ error.statusCode === 404 ? "You've wandered off the trail" : "Something went wrong" }}
        </h1>
        <p class="mt-2 max-w-md text-white/85">
          Even our best guides can't find this page. The steppe is vast — let's get you back to camp.
        </p>
        <div class="mt-7 flex gap-4">
          <button class="btn-primary btn-md" @click="clearError({ redirect: '/' })">Back to home</button>
          <NuxtLink to="/tours" class="btn btn-md border-2 border-white/70 text-white hover:bg-white/10">
            Browse tours
          </NuxtLink>
        </div>
      </div>
    </section>
    <SiteFooter />
  </div>
</template>
