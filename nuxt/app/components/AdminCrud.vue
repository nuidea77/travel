<script setup lang="ts">
import { Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-vue-next";
import { adminError } from "~/composables/useAdmin";

type FieldType = "text" | "textarea" | "number" | "select" | "checkbox" | "date" | "image";

export type CrudField = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string | number; label: string }[];
  rows?: number;
  full?: boolean;
  default?: unknown;
};

const props = defineProps<{
  title: string;
  endpoint: string;
  columns: { key: string; label: string }[];
  fields: CrudField[];
  /** Renders a cell; falls back to the raw value. */
  display?: (row: Record<string, unknown>, key: string) => string;
}>();

const rows = ref<Record<string, unknown>[]>([]);
const loading = ref(true);
const editing = ref<Record<string, unknown> | null>(null);
const saving = ref(false);
const error = ref<string | null>(null);

async function load() {
  loading.value = true;
  rows.value = await adminFetch<Record<string, unknown>[]>(props.endpoint);
  loading.value = false;
}
await useAsyncData(`crud-${props.endpoint}`, async () => {
  await load();
  return true;
});

function blank(): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  for (const field of props.fields) {
    row[field.key] =
      field.default ?? (field.type === "checkbox" ? true : field.type === "number" ? 0 : "");
  }
  return row;
}

function startCreate() {
  error.value = null;
  editing.value = blank();
}

function startEdit(row: Record<string, unknown>) {
  error.value = null;
  editing.value = { ...row };
}

async function save() {
  if (!editing.value) return;
  saving.value = true;
  error.value = null;
  const payload: Record<string, unknown> = {};
  for (const field of props.fields) payload[field.key] = editing.value[field.key];
  try {
    if (editing.value.id) {
      await adminFetch(`${props.endpoint}/${editing.value.id}`, { method: "PUT", body: payload });
    } else {
      await adminFetch(props.endpoint, { method: "POST", body: payload });
    }
    editing.value = null;
    await load();
  } catch (e) {
    error.value = adminError(e);
  } finally {
    saving.value = false;
  }
}

async function remove(row: Record<string, unknown>) {
  if (!confirm("Delete this entry?")) return;
  try {
    await adminFetch(`${props.endpoint}/${row.id}`, { method: "DELETE" });
    await load();
  } catch (e) {
    alert(adminError(e));
  }
}

function cell(row: Record<string, unknown>, key: string): string {
  if (props.display) {
    const out = props.display(row, key);
    if (out !== "") return out;
  }
  const value = key.split(".").reduce<unknown>((acc, part) => (acc as any)?.[part], row);
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-extrabold text-slate-900">{{ title }}</h1>
      <button class="adm-btn-primary" @click="startCreate"><Plus :size="15" /> New</button>
    </div>

    <!-- editor -->
    <section v-if="editing" class="adm-card mb-6">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="font-extrabold text-slate-900">{{ editing.id ? "Edit entry" : "New entry" }}</h2>
        <button class="adm-btn-outline !px-2.5" @click="editing = null"><X :size="14" /></button>
      </div>
      <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="save">
        <div v-for="field in fields" :key="field.key" :class="{ 'sm:col-span-2': field.full || field.type === 'textarea' }">
          <label v-if="field.type !== 'checkbox'" class="adm-label">
            {{ field.label }}{{ field.required ? " *" : "" }}
          </label>
          <textarea
            v-if="field.type === 'textarea'"
            v-model="(editing as any)[field.key]"
            :rows="field.rows ?? 4"
            :required="field.required"
            class="adm-input"
          />
          <select v-else-if="field.type === 'select' || field.type === 'image'" v-model="(editing as any)[field.key]" class="adm-input">
            <option v-for="opt in field.options ?? []" :key="String(opt.value)" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
          <label v-else-if="field.type === 'checkbox'" class="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input v-model="(editing as any)[field.key]" type="checkbox" class="h-4 w-4 accent-primary-700" />
            {{ field.label }}
          </label>
          <input
            v-else
            v-model="(editing as any)[field.key]"
            :type="field.type"
            :required="field.required"
            class="adm-input"
          />
        </div>
        <p v-if="error" class="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 sm:col-span-2">
          {{ error }}
        </p>
        <div class="sm:col-span-2">
          <button type="submit" :disabled="saving" class="adm-btn-primary">
            <Loader2 v-if="saving" :size="14" class="animate-spin" />
            <Save v-else :size="14" />
            Save
          </button>
        </div>
      </form>
    </section>

    <!-- table -->
    <div class="adm-card overflow-x-auto !p-0">
      <table class="w-full min-w-[640px]">
        <thead class="border-b border-slate-200 bg-slate-50">
          <tr>
            <th v-for="col in columns" :key="col.key" class="adm-th">{{ col.label }}</th>
            <th class="adm-th" />
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="row in rows" :key="String(row.id)" class="hover:bg-slate-50">
            <td v-for="col in columns" :key="col.key" class="adm-td max-w-sm">
              <span class="line-clamp-2">{{ cell(row, col.key) }}</span>
            </td>
            <td class="adm-td whitespace-nowrap text-right">
              <button class="adm-btn-outline mr-1 !px-2.5" title="Edit" @click="startEdit(row)">
                <Pencil :size="14" />
              </button>
              <button class="adm-btn-danger !px-2.5" title="Delete" @click="remove(row)">
                <Trash2 :size="14" />
              </button>
            </td>
          </tr>
          <tr v-if="!loading && rows.length === 0">
            <td class="adm-td text-slate-400" :colspan="columns.length + 1">No entries yet.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
