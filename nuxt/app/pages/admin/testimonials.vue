<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "admin" });
useSeoMeta({ title: "Testimonials — admin" });

type MetaOptions = { tours: { id: number; title: string }[] };
const { data: meta } = await useAsyncData("admin-meta-options", () => adminFetch<MetaOptions>("/meta"));

const tourOptions = computed(() => [
  { value: "", label: "— no tour —" },
  ...(meta.value?.tours ?? []).map((t) => ({ value: t.id, label: t.title })),
]);
</script>

<template>
  <AdminCrud
    title="Testimonials"
    endpoint="/testimonials"
    :columns="[
      { key: 'name', label: 'Guest' },
      { key: 'country', label: 'Country' },
      { key: 'rating', label: 'Rating' },
      { key: 'tour.title', label: 'Tour' },
      { key: 'is_published', label: 'Published' },
    ]"
    :fields="[
      { key: 'name', label: 'Guest name', type: 'text', required: true },
      { key: 'country', label: 'Country', type: 'text', required: true },
      { key: 'rating', label: 'Rating (1–5)', type: 'number', default: 5 },
      { key: 'tour_id', label: 'Tour', type: 'select', options: tourOptions, default: '' },
      { key: 'travelled_at', label: 'Travelled at', type: 'date' },
      { key: 'is_published', label: 'Published', type: 'checkbox', default: true },
      { key: 'title', label: 'Review title', type: 'text', required: true, full: true },
      { key: 'body', label: 'Review body', type: 'textarea', rows: 4, required: true },
    ]"
  />
</template>
