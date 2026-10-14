<script setup lang="ts">
import { CalendarDays, Inbox, Map, Newspaper, Star, UserCheck } from "lucide-vue-next";
import { formatDate } from "~/composables/useApi";

definePageMeta({ layout: "admin", middleware: "admin" });
useSeoMeta({ title: "Admin dashboard" });

type Meta = {
  counts: Record<string, number>;
  recent_bookings: {
    id: number;
    name: string;
    email: string;
    travelers: number;
    status: string;
    created_at: string;
    tour?: { title: string } | null;
  }[];
  recent_messages: { id: number; name: string; subject: string | null; is_read: boolean; created_at: string }[];
};

const { data: meta, refresh } = await useAsyncData("admin-meta", () => adminFetch<Meta>("/meta"));

const cards = computed(() => [
  { label: "Tours", value: meta.value?.counts.tours ?? 0, icon: Map, href: "/admin/tours" },
  { label: "Blog posts", value: meta.value?.counts.posts ?? 0, icon: Newspaper, href: "/admin/posts" },
  { label: "Testimonials", value: meta.value?.counts.testimonials ?? 0, icon: Star, href: "/admin/testimonials" },
  { label: "New bookings", value: meta.value?.counts.bookings_new ?? 0, icon: CalendarDays, href: "/admin/bookings" },
  { label: "Total bookings", value: meta.value?.counts.bookings_total ?? 0, icon: UserCheck, href: "/admin/bookings" },
  { label: "Unread messages", value: meta.value?.counts.messages_unread ?? 0, icon: Inbox, href: "/admin/messages" },
]);
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-extrabold text-slate-900">Dashboard</h1>
      <button class="adm-btn-outline" @click="refresh()">Refresh</button>
    </div>

    <div class="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      <NuxtLink v-for="card in cards" :key="card.label" :to="card.href" class="adm-card transition-shadow hover:shadow-card">
        <component :is="card.icon" :size="18" class="text-primary-700" />
        <p class="mt-2 text-2xl font-extrabold text-slate-900">{{ card.value }}</p>
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ card.label }}</p>
      </NuxtLink>
    </div>

    <div class="mt-8 grid gap-6 xl:grid-cols-2">
      <section class="adm-card !p-0">
        <h2 class="border-b border-slate-100 px-5 py-3.5 font-extrabold text-slate-900">Recent bookings</h2>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[480px]">
            <tbody class="divide-y divide-slate-100">
              <tr v-for="b in meta?.recent_bookings ?? []" :key="b.id">
                <td class="adm-td">
                  <p class="font-bold text-slate-900">{{ b.name }}</p>
                  <p class="text-xs text-slate-500">{{ b.tour?.title ?? "General inquiry" }} · {{ b.travelers }} pax</p>
                </td>
                <td class="adm-td text-xs text-slate-500">{{ formatDate(b.created_at) }}</td>
                <td class="adm-td">
                  <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase text-slate-600">
                    {{ b.status }}
                  </span>
                </td>
              </tr>
              <tr v-if="(meta?.recent_bookings ?? []).length === 0">
                <td class="adm-td text-slate-400">No bookings yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="adm-card !p-0">
        <h2 class="border-b border-slate-100 px-5 py-3.5 font-extrabold text-slate-900">Recent messages</h2>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[420px]">
            <tbody class="divide-y divide-slate-100">
              <tr v-for="m in meta?.recent_messages ?? []" :key="m.id">
                <td class="adm-td">
                  <p class="font-bold text-slate-900">
                    {{ m.name }}
                    <span v-if="!m.is_read" class="ml-1.5 rounded bg-primary-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary-700">new</span>
                  </p>
                  <p class="text-xs text-slate-500">{{ m.subject ?? "—" }}</p>
                </td>
                <td class="adm-td text-xs text-slate-500">{{ formatDate(m.created_at) }}</td>
              </tr>
              <tr v-if="(meta?.recent_messages ?? []).length === 0">
                <td class="adm-td text-slate-400">No messages yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>
