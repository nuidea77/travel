<script setup lang="ts">
import { MailOpen, Trash2 } from "lucide-vue-next";
import { formatDate } from "~/composables/useApi";
import { adminError } from "~/composables/useAdmin";

definePageMeta({ layout: "admin", middleware: "admin" });
useSeoMeta({ title: "Messages — admin" });

type MessageRow = {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};
type Paged = { data: MessageRow[]; current_page: number; last_page: number };

const page = ref(1);
const { data: messages, refresh } = await useAsyncData(
  "admin-messages",
  () => adminFetch<Paged>(`/messages?page=${page.value}`),
  { watch: [page] },
);

async function toggleRead(m: MessageRow) {
  try {
    await adminFetch(`/messages/${m.id}`, { method: "PUT", body: { is_read: !m.is_read } });
    m.is_read = !m.is_read;
  } catch (e) {
    alert(adminError(e));
  }
}

async function remove(m: MessageRow) {
  if (!confirm(`Delete message from ${m.name}?`)) return;
  await adminFetch(`/messages/${m.id}`, { method: "DELETE" });
  refresh();
}
</script>

<template>
  <div>
    <h1 class="mb-6 text-2xl font-extrabold text-slate-900">Contact messages</h1>

    <div class="space-y-3">
      <article
        v-for="m in messages?.data ?? []"
        :key="m.id"
        class="adm-card"
        :class="{ 'border-primary-200 bg-primary-50/40': !m.is_read }"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p class="font-extrabold text-slate-900">
              {{ m.name }}
              <span v-if="!m.is_read" class="ml-1.5 rounded bg-primary-700 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">new</span>
            </p>
            <p class="text-xs text-slate-500">
              {{ m.email }} · {{ formatDate(m.created_at) }}
              <template v-if="m.subject"> · {{ m.subject }}</template>
            </p>
          </div>
          <div class="flex gap-1.5">
            <button class="adm-btn-outline !px-2.5" :title="m.is_read ? 'Mark unread' : 'Mark read'" @click="toggleRead(m)">
              <MailOpen :size="14" />
            </button>
            <button class="adm-btn-danger !px-2.5" title="Delete" @click="remove(m)">
              <Trash2 :size="14" />
            </button>
          </div>
        </div>
        <p class="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">{{ m.message }}</p>
      </article>

      <p v-if="(messages?.data ?? []).length === 0" class="adm-card text-slate-400">No messages yet.</p>
    </div>

    <div v-if="messages && messages.last_page > 1" class="mt-4 flex items-center justify-center gap-2">
      <button class="adm-btn-outline" :disabled="page <= 1" @click="page--">← Prev</button>
      <span class="text-sm font-semibold text-slate-600">{{ messages.current_page }} / {{ messages.last_page }}</span>
      <button class="adm-btn-outline" :disabled="page >= messages.last_page" @click="page++">Next →</button>
    </div>
  </div>
</template>
