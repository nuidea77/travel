<script setup lang="ts">
import { Plus, Search, Trash2 } from "lucide-vue-next";
import type { Paginated, Tour } from "~/types";
import { adminError } from "~/composables/useAdmin";

definePageMeta({ layout: "admin", middleware: "admin" });
useSeoMeta({ title: "Tours — admin" });

const search = ref("");
const page = ref(1);

const { data: tours, refresh } = await useAsyncData(
  "admin-tours",
  () =>
    adminFetch<Paginated<Tour>>(
      `/tours?page=${page.value}${search.value ? `&search=${encodeURIComponent(search.value)}` : ""}`,
    ),
  { watch: [page] },
);

function doSearch() {
  page.value = 1;
  refresh();
}

async function remove(tour: Tour) {
  if (!confirm(`Delete "${tour.title}"? This also removes its itinerary, prices and departures.`)) return;
  try {
    await adminFetch(`/tours/${tour.id}`, { method: "DELETE" });
    refresh();
  } catch (e) {
    alert(adminError(e));
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-extrabold text-slate-900">Tours</h1>
      <div class="flex items-center gap-2">
        <form class="relative" @submit.prevent="doSearch">
          <Search :size="14" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="search" placeholder="Search tours…" class="adm-input !w-56 !pl-8" />
        </form>
        <NuxtLink to="/admin/tours/new" class="adm-btn-primary"><Plus :size="15" /> New tour</NuxtLink>
      </div>
    </div>

    <div class="adm-card overflow-x-auto !p-0">
      <table class="w-full min-w-[760px]">
        <thead class="border-b border-slate-200 bg-slate-50">
          <tr>
            <th class="adm-th">Title</th>
            <th class="adm-th">Type</th>
            <th class="adm-th">Days</th>
            <th class="adm-th">From (USD)</th>
            <th class="adm-th">Departures</th>
            <th class="adm-th">Status</th>
            <th class="adm-th" />
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="tour in tours?.data ?? []" :key="tour.id" class="hover:bg-slate-50">
            <td class="adm-td">
              <NuxtLink :to="`/admin/tours/${tour.id}`" class="font-bold text-primary-700 hover:underline">
                {{ tour.title }}
              </NuxtLink>
              <p class="text-xs text-slate-400">/tours/{{ tour.slug }}</p>
            </td>
            <td class="adm-td capitalize">{{ tour.type }}</td>
            <td class="adm-td">{{ tour.duration_days }}</td>
            <td class="adm-td">{{ Number(tour.price_from).toLocaleString() }}</td>
            <td class="adm-td">{{ (tour as any).departures_count ?? 0 }}</td>
            <td class="adm-td">
              <span
                class="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase"
                :class="tour.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ tour.is_published ? "Published" : "Draft" }}
              </span>
            </td>
            <td class="adm-td text-right">
              <button class="adm-btn-danger !px-2.5" title="Delete" @click="remove(tour)">
                <Trash2 :size="14" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="tours && tours.last_page > 1" class="mt-4 flex items-center justify-center gap-2">
      <button class="adm-btn-outline" :disabled="page <= 1" @click="page--">← Prev</button>
      <span class="text-sm font-semibold text-slate-600">{{ tours.current_page }} / {{ tours.last_page }}</span>
      <button class="adm-btn-outline" :disabled="page >= tours.last_page" @click="page++">Next →</button>
    </div>
  </div>
</template>
