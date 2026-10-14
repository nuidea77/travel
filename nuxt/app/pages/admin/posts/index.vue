<script setup lang="ts">
import { Plus, Search, Trash2 } from "lucide-vue-next";
import type { Paginated, Post } from "~/types";
import { formatDate } from "~/composables/useApi";
import { adminError } from "~/composables/useAdmin";

definePageMeta({ layout: "admin", middleware: "admin" });
useSeoMeta({ title: "Blog posts — admin" });

const search = ref("");
const page = ref(1);

const { data: posts, refresh } = await useAsyncData(
  "admin-posts",
  () =>
    adminFetch<Paginated<Post>>(
      `/posts?page=${page.value}${search.value ? `&search=${encodeURIComponent(search.value)}` : ""}`,
    ),
  { watch: [page] },
);

function doSearch() {
  page.value = 1;
  refresh();
}

async function remove(post: Post) {
  if (!confirm(`Delete "${post.title}"?`)) return;
  try {
    await adminFetch(`/posts/${post.id}`, { method: "DELETE" });
    refresh();
  } catch (e) {
    alert(adminError(e));
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-extrabold text-slate-900">Blog posts</h1>
      <div class="flex items-center gap-2">
        <form class="relative" @submit.prevent="doSearch">
          <Search :size="14" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="search" placeholder="Search posts…" class="adm-input !w-56 !pl-8" />
        </form>
        <NuxtLink to="/admin/posts/new" class="adm-btn-primary"><Plus :size="15" /> New post</NuxtLink>
      </div>
    </div>

    <div class="adm-card overflow-x-auto !p-0">
      <table class="w-full min-w-[680px]">
        <thead class="border-b border-slate-200 bg-slate-50">
          <tr>
            <th class="adm-th">Title</th>
            <th class="adm-th">Category</th>
            <th class="adm-th">Published</th>
            <th class="adm-th">Status</th>
            <th class="adm-th" />
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="post in posts?.data ?? []" :key="post.id" class="hover:bg-slate-50">
            <td class="adm-td">
              <NuxtLink :to="`/admin/posts/${post.id}`" class="font-bold text-primary-700 hover:underline">
                {{ post.title }}
              </NuxtLink>
              <p class="text-xs text-slate-400">/blogs/{{ post.slug }}</p>
            </td>
            <td class="adm-td">{{ post.category?.name ?? "—" }}</td>
            <td class="adm-td text-xs">{{ formatDate(post.published_at) }}</td>
            <td class="adm-td">
              <span
                class="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase"
                :class="(post as any).is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ (post as any).is_published ? "Published" : "Draft" }}
              </span>
            </td>
            <td class="adm-td text-right">
              <button class="adm-btn-danger !px-2.5" title="Delete" @click="remove(post)">
                <Trash2 :size="14" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="posts && posts.last_page > 1" class="mt-4 flex items-center justify-center gap-2">
      <button class="adm-btn-outline" :disabled="page <= 1" @click="page--">← Prev</button>
      <span class="text-sm font-semibold text-slate-600">{{ posts.current_page }} / {{ posts.last_page }}</span>
      <button class="adm-btn-outline" :disabled="page >= posts.last_page" @click="page++">Next →</button>
    </div>
  </div>
</template>
