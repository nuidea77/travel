<script setup lang="ts">
import { ArrowLeft, Loader2, Save } from "lucide-vue-next";
import type { Post } from "~/types";
import { adminError } from "~/composables/useAdmin";

definePageMeta({ layout: "admin", middleware: "admin" });

const route = useRoute();
const isNew = computed(() => route.params.id === "new");
const id = computed(() => String(route.params.id));

useSeoMeta({ title: () => (isNew.value ? "New post — admin" : "Edit post — admin") });

type MetaOptions = { images: string[]; post_categories: { id: number; name: string }[] };
const { data: meta } = await useAsyncData("admin-meta-options", () => adminFetch<MetaOptions>("/meta"));

const form = reactive({
  post_category_id: 0,
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  image: "/images/hero-steppe.svg",
  author: "Editorial Team",
  read_time: 5,
  published_at: new Date().toISOString().slice(0, 10),
  is_published: true,
});

if (!isNew.value) {
  const post = await adminFetch<Post & { post_category_id: number; is_published: boolean }>(`/posts/${id.value}`);
  Object.assign(form, {
    post_category_id: post.post_category_id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    body: post.body,
    image: post.image ?? "/images/hero-steppe.svg",
    author: post.author,
    read_time: post.read_time,
    published_at: post.published_at?.slice(0, 10) ?? "",
    is_published: !!post.is_published,
  });
} else {
  watchEffect(() => {
    const first = meta.value?.post_categories[0];
    if (first && !form.post_category_id) form.post_category_id = first.id;
  });
}

watch(
  () => form.title,
  (title) => {
    if (isNew.value && title) {
      form.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    }
  },
);

const saving = ref(false);
const error = ref<string | null>(null);
const saved = ref(false);

async function save() {
  saving.value = true;
  error.value = null;
  try {
    if (isNew.value) {
      const created = await adminFetch<Post>("/posts", { method: "POST", body: { ...form } });
      await navigateTo(`/admin/posts/${created.id}`);
    } else {
      await adminFetch(`/posts/${id.value}`, { method: "PUT", body: { ...form } });
      saved.value = true;
      setTimeout(() => (saved.value = false), 2500);
    }
  } catch (e) {
    error.value = adminError(e);
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="save">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <NuxtLink to="/admin/posts" class="adm-btn-outline !px-2.5"><ArrowLeft :size="15" /></NuxtLink>
        <h1 class="text-2xl font-extrabold text-slate-900">{{ isNew ? "New post" : form.title || "Edit post" }}</h1>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="saved" class="text-sm font-bold text-emerald-600">Saved ✓</span>
        <button type="submit" :disabled="saving" class="adm-btn-primary">
          <Loader2 v-if="saving" :size="14" class="animate-spin" />
          <Save v-else :size="14" />
          Save post
        </button>
      </div>
    </div>

    <p v-if="error" class="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{{ error }}</p>

    <div class="grid gap-6 xl:grid-cols-[1fr_300px]">
      <section class="adm-card space-y-4">
        <div class="grid gap-4 sm:grid-cols-2">
          <div><label class="adm-label">Title *</label><input v-model="form.title" required class="adm-input" /></div>
          <div><label class="adm-label">Slug *</label><input v-model="form.slug" required class="adm-input" /></div>
        </div>
        <div><label class="adm-label">Excerpt *</label><textarea v-model="form.excerpt" rows="2" required class="adm-input" /></div>
        <div>
          <label class="adm-label">Body (HTML) *</label>
          <textarea v-model="form.body" rows="18" required class="adm-input font-mono !text-xs" />
        </div>
      </section>

      <aside class="space-y-6">
        <section class="adm-card space-y-3">
          <div>
            <label class="adm-label">Category *</label>
            <select v-model.number="form.post_category_id" class="adm-input">
              <option v-for="cat in meta?.post_categories ?? []" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div>
            <label class="adm-label">Image</label>
            <select v-model="form.image" class="adm-input">
              <option v-for="img in meta?.images ?? []" :key="img" :value="img">
                {{ img.replace("/images/", "").replace(".svg", "") }}
              </option>
            </select>
          </div>
          <div><label class="adm-label">Author</label><input v-model="form.author" class="adm-input" /></div>
          <div class="grid grid-cols-2 gap-3">
            <div><label class="adm-label">Read time (min)</label><input v-model.number="form.read_time" type="number" min="1" class="adm-input" /></div>
            <div><label class="adm-label">Published at</label><input v-model="form.published_at" type="date" class="adm-input" /></div>
          </div>
          <label class="flex items-center gap-2 pt-1 text-sm font-semibold text-slate-700">
            <input v-model="form.is_published" type="checkbox" class="h-4 w-4 accent-primary-700" /> Published
          </label>
        </section>
      </aside>
    </div>
  </form>
</template>
