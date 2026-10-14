<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "admin" });
useSeoMeta({ title: "Categories — admin" });
</script>

<template>
  <div class="space-y-12">
    <AdminCrud
      title="Tour categories"
      endpoint="/tour-categories"
      :columns="[
        { key: 'name', label: 'Name' },
        { key: 'slug', label: 'Slug' },
        { key: 'description', label: 'Description' },
        { key: 'sort_order', label: 'Order' },
      ]"
      :fields="[
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'slug', label: 'Slug', type: 'text', required: true },
        { key: 'icon', label: 'Icon (keyword)', type: 'text' },
        { key: 'sort_order', label: 'Sort order', type: 'number', default: 0 },
        { key: 'description', label: 'Description', type: 'textarea', rows: 2 },
      ]"
    />

    <AdminCrud
      title="Blog categories"
      endpoint="/post-categories"
      :columns="[
        { key: 'name', label: 'Name' },
        { key: 'slug', label: 'Slug' },
        { key: 'sort_order', label: 'Order' },
      ]"
      :fields="[
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'slug', label: 'Slug', type: 'text', required: true },
        { key: 'icon', label: 'Icon (keyword)', type: 'text' },
        { key: 'sort_order', label: 'Sort order', type: 'number', default: 0 },
      ]"
    />
  </div>
</template>
