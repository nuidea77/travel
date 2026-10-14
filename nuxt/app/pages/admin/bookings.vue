<script setup lang="ts">
import { Trash2 } from "lucide-vue-next";
import { formatDate } from "~/composables/useApi";
import { adminError } from "~/composables/useAdmin";

definePageMeta({ layout: "admin", middleware: "admin" });
useSeoMeta({ title: "Bookings — admin" });

type BookingRow = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  travelers: number;
  preferred_date: string | null;
  message: string | null;
  status: string;
  created_at: string;
  tour?: { id: number; title: string } | null;
  departure?: { id: number; start_date: string; end_date: string } | null;
};
type Paged = { data: BookingRow[]; current_page: number; last_page: number };

const page = ref(1);
const status = ref("");

const { data: bookings, refresh } = await useAsyncData(
  "admin-bookings",
  () => adminFetch<Paged>(`/bookings?page=${page.value}${status.value ? `&status=${status.value}` : ""}`),
  { watch: [page, status] },
);

const STATUSES = ["new", "contacted", "confirmed", "cancelled"];

async function setStatus(booking: BookingRow, value: string) {
  try {
    await adminFetch(`/bookings/${booking.id}`, { method: "PUT", body: { status: value } });
    booking.status = value;
  } catch (e) {
    alert(adminError(e));
  }
}

async function remove(booking: BookingRow) {
  if (!confirm(`Delete booking from ${booking.name}?`)) return;
  await adminFetch(`/bookings/${booking.id}`, { method: "DELETE" });
  refresh();
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-extrabold text-slate-900">Bookings</h1>
      <select v-model="status" class="adm-input !w-44" aria-label="Filter by status">
        <option value="">All statuses</option>
        <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>

    <div class="adm-card overflow-x-auto !p-0">
      <table class="w-full min-w-[860px]">
        <thead class="border-b border-slate-200 bg-slate-50">
          <tr>
            <th class="adm-th">Guest</th>
            <th class="adm-th">Tour</th>
            <th class="adm-th">Pax</th>
            <th class="adm-th">Requested</th>
            <th class="adm-th">Message</th>
            <th class="adm-th">Status</th>
            <th class="adm-th" />
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="b in bookings?.data ?? []" :key="b.id" class="hover:bg-slate-50">
            <td class="adm-td">
              <p class="font-bold text-slate-900">{{ b.name }}</p>
              <p class="text-xs text-slate-500">{{ b.email }}</p>
              <p v-if="b.phone" class="text-xs text-slate-500">{{ b.phone }}</p>
              <p v-if="b.country" class="text-xs text-slate-400">{{ b.country }}</p>
            </td>
            <td class="adm-td">
              <p>{{ b.tour?.title ?? "General inquiry" }}</p>
              <p v-if="b.departure" class="text-xs text-slate-500">
                {{ formatDate(b.departure.start_date) }} – {{ formatDate(b.departure.end_date) }}
              </p>
              <p v-else-if="b.preferred_date" class="text-xs text-slate-500">
                Preferred: {{ formatDate(b.preferred_date) }}
              </p>
            </td>
            <td class="adm-td">{{ b.travelers }}</td>
            <td class="adm-td text-xs">{{ formatDate(b.created_at) }}</td>
            <td class="adm-td max-w-xs"><span class="line-clamp-3 text-xs">{{ b.message ?? "—" }}</span></td>
            <td class="adm-td">
              <select
                :value="b.status"
                class="adm-input !w-32 !py-1.5"
                @change="setStatus(b, ($event.target as HTMLSelectElement).value)"
              >
                <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
              </select>
            </td>
            <td class="adm-td text-right">
              <button class="adm-btn-danger !px-2.5" @click="remove(b)"><Trash2 :size="14" /></button>
            </td>
          </tr>
          <tr v-if="(bookings?.data ?? []).length === 0">
            <td class="adm-td text-slate-400" colspan="7">No bookings yet.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="bookings && bookings.last_page > 1" class="mt-4 flex items-center justify-center gap-2">
      <button class="adm-btn-outline" :disabled="page <= 1" @click="page--">← Prev</button>
      <span class="text-sm font-semibold text-slate-600">{{ bookings.current_page }} / {{ bookings.last_page }}</span>
      <button class="adm-btn-outline" :disabled="page >= bookings.last_page" @click="page++">Next →</button>
    </div>
  </div>
</template>
