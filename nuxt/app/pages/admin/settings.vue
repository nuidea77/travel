<script setup lang="ts">
import { Loader2, Plus, Save, Trash2 } from "lucide-vue-next";
import { adminError } from "~/composables/useAdmin";

definePageMeta({ layout: "admin", middleware: "admin" });
useSeoMeta({ title: "Settings — admin" });

const KNOWN_FIELDS: { key: string; label: string; type?: "textarea" }[] = [
  { key: "site_name", label: "Site name" },
  { key: "legal_name", label: "Legal name" },
  { key: "tagline", label: "Tagline", type: "textarea" },
  { key: "logo_tagline", label: "Logo tagline" },
  { key: "phone", label: "Phone" },
  { key: "phone2", label: "Phone 2" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address", type: "textarea" },
  { key: "founded_year", label: "Founded year" },
];

const SOCIAL_KEYS = ["instagram", "facebook", "tripadvisor", "youtube", "linkedin", "x"];

const values = reactive<Record<string, string>>({});
const socials = reactive<Record<string, string>>({});
const stats = ref<{ value: string; label: string }[]>([]);

const { data: rows } = await useAsyncData("admin-settings", () =>
  adminFetch<{ key: string; value: string | null }[]>("/settings"),
);

watchEffect(() => {
  for (const row of rows.value ?? []) {
    if (row.key === "socials") {
      try {
        Object.assign(socials, JSON.parse(row.value ?? "{}"));
      } catch {
        /* keep defaults */
      }
    } else if (row.key === "stats") {
      try {
        stats.value = JSON.parse(row.value ?? "[]");
      } catch {
        stats.value = [];
      }
    } else {
      values[row.key] = row.value ?? "";
    }
  }
});

const saving = ref(false);
const saved = ref(false);
const error = ref<string | null>(null);

async function save() {
  saving.value = true;
  error.value = null;
  saved.value = false;
  const settings = [
    ...Object.entries(values).map(([key, value]) => ({ key, value })),
    { key: "socials", value: JSON.stringify(socials) },
    { key: "stats", value: JSON.stringify(stats.value) },
  ];
  try {
    await adminFetch("/settings", { method: "PUT", body: { settings } });
    saved.value = true;
    setTimeout(() => (saved.value = false), 2500);
  } catch (e) {
    error.value = adminError(e);
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="save">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-extrabold text-slate-900">Site settings</h1>
      <div class="flex items-center gap-2">
        <span v-if="saved" class="text-sm font-bold text-emerald-600">Saved ✓</span>
        <button type="submit" :disabled="saving" class="adm-btn-primary">
          <Loader2 v-if="saving" :size="14" class="animate-spin" />
          <Save v-else :size="14" />
          Save settings
        </button>
      </div>
    </div>

    <p v-if="error" class="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{{ error }}</p>

    <div class="grid gap-6 xl:grid-cols-2">
      <section class="adm-card">
        <h2 class="mb-4 font-extrabold text-slate-900">Identity &amp; contacts</h2>
        <div class="grid gap-4 sm:grid-cols-2">
          <div v-for="field in KNOWN_FIELDS" :key="field.key" :class="{ 'sm:col-span-2': field.type === 'textarea' }">
            <label class="adm-label">{{ field.label }}</label>
            <textarea v-if="field.type === 'textarea'" v-model="values[field.key]" rows="2" class="adm-input" />
            <input v-else v-model="values[field.key]" class="adm-input" />
          </div>
        </div>
      </section>

      <div class="space-y-6">
        <section class="adm-card">
          <h2 class="mb-4 font-extrabold text-slate-900">Social links</h2>
          <div class="space-y-3">
            <div v-for="key in SOCIAL_KEYS" :key="key">
              <label class="adm-label capitalize">{{ key }}</label>
              <input v-model="socials[key]" class="adm-input" placeholder="https://…" />
            </div>
          </div>
        </section>

        <section class="adm-card">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="font-extrabold text-slate-900">Homepage stats</h2>
            <button type="button" class="adm-btn-outline" @click="stats.push({ value: '', label: '' })">
              <Plus :size="13" /> Add
            </button>
          </div>
          <div v-for="(stat, i) in stats" :key="i" class="mb-2 flex items-center gap-2">
            <input v-model="stat.value" placeholder="Value (e.g. 2017)" class="adm-input !w-36" />
            <input v-model="stat.label" placeholder="Label" class="adm-input" />
            <button type="button" class="adm-btn-danger !px-2.5" @click="stats.splice(i, 1)">
              <Trash2 :size="14" />
            </button>
          </div>
        </section>
      </div>
    </div>
  </form>
</template>
