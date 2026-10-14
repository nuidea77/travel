<script setup lang="ts">
import { DEFAULT_SETTINGS, getSettings, useSettings } from "~/composables/useApi";

const settings = useSettings();

// Fetch site settings once, shared by header, footer and pages.
const { data } = await useAsyncData("site-settings", () => getSettings(), {
  default: () => DEFAULT_SETTINGS,
});
watchEffect(() => {
  if (data.value) settings.value = data.value;
});

useSeoMeta({
  titleTemplate: (chunk?: string) =>
    chunk
      ? `${chunk} | ${settings.value.site_name}`
      : `${settings.value.site_name} — Mongolia Tours & Travel`,
  description: () => settings.value.tagline,
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
