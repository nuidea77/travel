<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "admin" });
useSeoMeta({ title: "Pages — admin" });

type MetaOptions = { images: string[] };
const { data: meta } = await useAsyncData("admin-meta-options", () => adminFetch<MetaOptions>("/meta"));

const imageOptions = computed(() =>
  (meta.value?.images ?? []).map((img) => ({
    value: img,
    label: img.replace("/images/", "").replace(".svg", ""),
  })),
);
</script>

<template>
  <AdminCrud
    title="Pages"
    endpoint="/pages"
    :columns="[
      { key: 'title', label: 'Title' },
      { key: 'slug', label: 'Slug' },
      { key: 'subtitle', label: 'Subtitle' },
    ]"
    :fields="[
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true },
      { key: 'subtitle', label: 'Subtitle', type: 'text', full: true },
      { key: 'image', label: 'Image', type: 'image', options: imageOptions, default: '/images/hero-steppe.svg' },
      { key: 'body', label: 'Body (HTML)', type: 'textarea', rows: 14, required: true },
    ]"
  />
</template>
