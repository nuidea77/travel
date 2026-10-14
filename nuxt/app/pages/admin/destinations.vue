<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "admin" });
useSeoMeta({ title: "Destinations — admin" });

type MetaOptions = { images: string[] };
const { data: meta } = await useAsyncData("admin-meta-options", () => adminFetch<MetaOptions>("/meta"));

const imageOptions = computed(() =>
  (meta.value?.images ?? []).map((img) => ({
    value: img,
    label: img.replace("/images/", "").replace(".svg", ""),
  })),
);

const REGIONS = ["South", "Central", "North", "West", "East"].map((r) => ({
  value: r,
  label: r,
}));
</script>

<template>
  <AdminCrud
    title="Destinations"
    endpoint="/destinations"
    :columns="[
      { key: 'name', label: 'Name' },
      { key: 'region', label: 'Region' },
      { key: 'slug', label: 'Slug' },
      { key: 'sort_order', label: 'Order' },
    ]"
    :fields="[
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true },
      { key: 'region', label: 'Region', type: 'select', options: REGIONS, default: 'Central' },
      { key: 'image', label: 'Image', type: 'image', options: imageOptions, default: '/images/hero-steppe.svg' },
      { key: 'lat', label: 'Latitude (map)', type: 'number' },
      { key: 'lng', label: 'Longitude (map)', type: 'number' },
      { key: 'sort_order', label: 'Sort order', type: 'number', default: 0 },
      { key: 'description', label: 'Description', type: 'textarea', rows: 2 },
    ]"
  />
</template>
