<script setup lang="ts">
import { ArrowLeft, Loader2, Plus, Save, Trash2 } from "lucide-vue-next";
import type { Tour } from "~/types";
import { adminError } from "~/composables/useAdmin";

definePageMeta({ layout: "admin", middleware: "admin" });

const route = useRoute();
const isNew = computed(() => route.params.id === "new");
const id = computed(() => String(route.params.id));

useSeoMeta({ title: () => (isNew.value ? "New tour — admin" : "Edit tour — admin") });

type MetaOptions = {
  images: string[];
  tour_categories: { id: number; name: string }[];
  destinations: { id: number; name: string }[];
};

const { data: meta } = await useAsyncData("admin-meta-options", () => adminFetch<MetaOptions>("/meta"));

type Day = { day_number: number; title: string; description: string; meals: string; accommodation: string; distance: string };
type Price = { min_people: number; max_people: number; price: number };
type Departure = { start_date: string; end_date: string; price: number | null; seats_total: number; seats_left: number; status: string };
type GoodToKnow = { title: string; body: string };

const form = reactive({
  title: "",
  slug: "",
  excerpt: "",
  overview: "",
  type: "private",
  duration_days: 1,
  price_from: 0,
  rating: 5,
  reviews_count: 0,
  image: "/images/hero-steppe.svg",
  is_featured: false,
  is_best_seller: false,
  is_published: true,
  sort_order: 0,
  categories: [] as number[],
  destinations: [] as number[],
  highlightsText: "",
  includedText: "",
  excludedText: "",
  good_to_know: [] as GoodToKnow[],
  itinerary_days: [] as Day[],
  prices: [] as Price[],
  departures: [] as Departure[],
});

if (!isNew.value) {
  const tour = await adminFetch<Tour>(`/tours/${id.value}`);
  Object.assign(form, {
    title: tour.title,
    slug: tour.slug,
    excerpt: tour.excerpt,
    overview: tour.overview ?? "",
    type: tour.type,
    duration_days: tour.duration_days,
    price_from: Number(tour.price_from),
    rating: Number(tour.rating),
    reviews_count: tour.reviews_count,
    image: tour.image ?? "/images/hero-steppe.svg",
    is_featured: !!tour.is_featured,
    is_best_seller: !!tour.is_best_seller,
    is_published: !!(tour as any).is_published,
    sort_order: (tour as any).sort_order ?? 0,
    categories: (tour.categories ?? []).map((c) => c.id),
    destinations: (tour.destinations ?? []).map((d) => d.id),
    highlightsText: (tour.highlights ?? []).join("\n"),
    includedText: (tour.included ?? []).join("\n"),
    excludedText: (tour.excluded ?? []).join("\n"),
    good_to_know: tour.good_to_know ?? [],
    itinerary_days: (tour.itinerary_days ?? []).map((d) => ({
      day_number: d.day_number,
      title: d.title,
      description: d.description,
      meals: d.meals ?? "",
      accommodation: d.accommodation ?? "",
      distance: d.distance ?? "",
    })),
    prices: (tour.prices ?? []).map((p) => ({
      min_people: p.min_people,
      max_people: p.max_people,
      price: Number(p.price),
    })),
    departures: (tour.departures ?? []).map((d) => ({
      start_date: d.start_date.slice(0, 10),
      end_date: d.end_date.slice(0, 10),
      price: d.price === null ? null : Number(d.price),
      seats_total: d.seats_total,
      seats_left: d.seats_left,
      status: d.status,
    })),
  });
}

watch(
  () => form.title,
  (title) => {
    if (isNew.value && title) {
      form.slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
  },
);

const lines = (text: string) =>
  text.split("\n").map((l) => l.trim()).filter(Boolean);

const saving = ref(false);
const error = ref<string | null>(null);
const saved = ref(false);

async function save() {
  saving.value = true;
  error.value = null;
  saved.value = false;
  const payload = {
    title: form.title,
    slug: form.slug,
    excerpt: form.excerpt,
    overview: form.overview || null,
    type: form.type,
    duration_days: Number(form.duration_days),
    price_from: Number(form.price_from),
    rating: Number(form.rating),
    reviews_count: Number(form.reviews_count),
    image: form.image,
    is_featured: form.is_featured,
    is_best_seller: form.is_best_seller,
    is_published: form.is_published,
    sort_order: Number(form.sort_order),
    highlights: lines(form.highlightsText),
    included: lines(form.includedText),
    excluded: lines(form.excludedText),
    good_to_know: form.good_to_know,
    categories: form.categories,
    destinations: form.destinations,
    itinerary_days: form.itinerary_days.map((d, i) => ({ ...d, day_number: i + 1 })),
    prices: form.prices,
    departures: form.departures,
  };
  try {
    if (isNew.value) {
      const created = await adminFetch<Tour>("/tours", { method: "POST", body: payload });
      await navigateTo(`/admin/tours/${created.id}`);
    } else {
      await adminFetch(`/tours/${id.value}`, { method: "PUT", body: payload });
      saved.value = true;
      setTimeout(() => (saved.value = false), 2500);
    }
  } catch (e) {
    error.value = adminError(e);
  } finally {
    saving.value = false;
  }
}

function addDay() {
  form.itinerary_days.push({
    day_number: form.itinerary_days.length + 1,
    title: "",
    description: "",
    meals: "B+L+D",
    accommodation: "Ger camp / family ger",
    distance: "",
  });
}
</script>

<template>
  <form @submit.prevent="save">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <NuxtLink to="/admin/tours" class="adm-btn-outline !px-2.5"><ArrowLeft :size="15" /></NuxtLink>
        <h1 class="text-2xl font-extrabold text-slate-900">
          {{ isNew ? "New tour" : form.title || "Edit tour" }}
        </h1>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="saved" class="text-sm font-bold text-emerald-600">Saved ✓</span>
        <button type="submit" :disabled="saving" class="adm-btn-primary">
          <Loader2 v-if="saving" :size="14" class="animate-spin" />
          <Save v-else :size="14" />
          Save tour
        </button>
      </div>
    </div>

    <p v-if="error" class="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{{ error }}</p>

    <div class="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div class="space-y-6">
        <!-- basics -->
        <section class="adm-card">
          <h2 class="mb-4 font-extrabold text-slate-900">Basics</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <div><label class="adm-label">Title *</label><input v-model="form.title" required class="adm-input" /></div>
            <div><label class="adm-label">Slug *</label><input v-model="form.slug" required class="adm-input" /></div>
            <div>
              <label class="adm-label">Type *</label>
              <select v-model="form.type" class="adm-input">
                <option value="join">Join a group</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div>
              <label class="adm-label">Image</label>
              <select v-model="form.image" class="adm-input">
                <option v-for="img in meta?.images ?? []" :key="img" :value="img">{{ img.replace("/images/", "").replace(".svg", "") }}</option>
              </select>
            </div>
            <div><label class="adm-label">Duration (days) *</label><input v-model.number="form.duration_days" type="number" min="1" class="adm-input" /></div>
            <div><label class="adm-label">Price from (USD) *</label><input v-model.number="form.price_from" type="number" min="0" class="adm-input" /></div>
            <div><label class="adm-label">Rating</label><input v-model.number="form.rating" type="number" min="0" max="5" step="0.1" class="adm-input" /></div>
            <div><label class="adm-label">Review count</label><input v-model.number="form.reviews_count" type="number" min="0" class="adm-input" /></div>
          </div>
          <div class="mt-4">
            <label class="adm-label">Excerpt *</label>
            <textarea v-model="form.excerpt" rows="2" required class="adm-input" />
          </div>
          <div class="mt-4">
            <label class="adm-label">Overview</label>
            <textarea v-model="form.overview" rows="5" class="adm-input" />
          </div>
        </section>

        <!-- lists -->
        <section class="adm-card">
          <h2 class="mb-4 font-extrabold text-slate-900">Highlights &amp; services <span class="text-xs font-semibold text-slate-400">(one per line)</span></h2>
          <div class="grid gap-4 lg:grid-cols-3">
            <div><label class="adm-label">Highlights</label><textarea v-model="form.highlightsText" rows="6" class="adm-input" /></div>
            <div><label class="adm-label">Included</label><textarea v-model="form.includedText" rows="6" class="adm-input" /></div>
            <div><label class="adm-label">Not included</label><textarea v-model="form.excludedText" rows="6" class="adm-input" /></div>
          </div>
          <div class="mt-5">
            <div class="mb-2 flex items-center justify-between">
              <label class="adm-label !mb-0">Good to know</label>
              <button type="button" class="adm-btn-outline" @click="form.good_to_know.push({ title: '', body: '' })">
                <Plus :size="13" /> Add
              </button>
            </div>
            <div v-for="(g, i) in form.good_to_know" :key="i" class="mb-3 rounded-lg border border-slate-200 p-3">
              <div class="flex gap-3">
                <div class="flex-1 space-y-2">
                  <input v-model="g.title" placeholder="Title" class="adm-input" />
                  <textarea v-model="g.body" placeholder="Body" rows="2" class="adm-input" />
                </div>
                <button type="button" class="adm-btn-danger h-fit !px-2.5" @click="form.good_to_know.splice(i, 1)">
                  <Trash2 :size="14" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- itinerary -->
        <section class="adm-card">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="font-extrabold text-slate-900">Itinerary ({{ form.itinerary_days.length }} days)</h2>
            <button type="button" class="adm-btn-outline" @click="addDay"><Plus :size="13" /> Add day</button>
          </div>
          <div v-for="(day, i) in form.itinerary_days" :key="i" class="mb-3 rounded-lg border border-slate-200 p-3">
            <div class="mb-2 flex items-center justify-between">
              <span class="text-xs font-extrabold uppercase text-primary-700">Day {{ i + 1 }}</span>
              <button type="button" class="adm-btn-danger !px-2.5" @click="form.itinerary_days.splice(i, 1)">
                <Trash2 :size="14" />
              </button>
            </div>
            <div class="space-y-2">
              <input v-model="day.title" placeholder="Day title" class="adm-input" />
              <textarea v-model="day.description" placeholder="Description" rows="2" class="adm-input" />
              <div class="grid gap-2 sm:grid-cols-3">
                <input v-model="day.meals" placeholder="Meals (B+L+D)" class="adm-input" />
                <input v-model="day.accommodation" placeholder="Accommodation" class="adm-input" />
                <input v-model="day.distance" placeholder="Distance" class="adm-input" />
              </div>
            </div>
          </div>
        </section>

        <!-- prices & departures -->
        <section class="adm-card">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="font-extrabold text-slate-900">Pax based prices</h2>
            <button type="button" class="adm-btn-outline" @click="form.prices.push({ min_people: 1, max_people: 2, price: 0 })">
              <Plus :size="13" /> Add tier
            </button>
          </div>
          <div v-for="(p, i) in form.prices" :key="i" class="mb-2 flex items-center gap-2">
            <input v-model.number="p.min_people" type="number" min="1" class="adm-input !w-24" title="Min pax" />
            <span class="text-slate-400">–</span>
            <input v-model.number="p.max_people" type="number" min="1" class="adm-input !w-24" title="Max pax" />
            <input v-model.number="p.price" type="number" min="0" class="adm-input !w-32" title="Price USD" />
            <span class="text-xs font-bold text-slate-400">USD</span>
            <button type="button" class="adm-btn-danger !px-2.5" @click="form.prices.splice(i, 1)"><Trash2 :size="14" /></button>
          </div>

          <div class="mb-4 mt-6 flex items-center justify-between">
            <h2 class="font-extrabold text-slate-900">Departures</h2>
            <button
              type="button"
              class="adm-btn-outline"
              @click="form.departures.push({ start_date: '', end_date: '', price: form.price_from, seats_total: 16, seats_left: 16, status: 'open' })"
            >
              <Plus :size="13" /> Add departure
            </button>
          </div>
          <div v-for="(d, i) in form.departures" :key="i" class="mb-2 grid items-center gap-2 lg:grid-cols-[1fr_1fr_100px_80px_80px_110px_auto]">
            <input v-model="d.start_date" type="date" class="adm-input" title="Start" />
            <input v-model="d.end_date" type="date" class="adm-input" title="End" />
            <input v-model.number="d.price" type="number" min="0" class="adm-input" title="Price" />
            <input v-model.number="d.seats_total" type="number" min="1" class="adm-input" title="Seats" />
            <input v-model.number="d.seats_left" type="number" min="0" class="adm-input" title="Left" />
            <select v-model="d.status" class="adm-input">
              <option value="open">Open</option>
              <option value="guaranteed">Guaranteed</option>
              <option value="full">Full</option>
            </select>
            <button type="button" class="adm-btn-danger !px-2.5" @click="form.departures.splice(i, 1)"><Trash2 :size="14" /></button>
          </div>
        </section>
      </div>

      <!-- sidebar -->
      <aside class="space-y-6">
        <section class="adm-card">
          <h2 class="mb-3 font-extrabold text-slate-900">Visibility</h2>
          <label class="flex items-center gap-2 py-1 text-sm font-semibold text-slate-700">
            <input v-model="form.is_published" type="checkbox" class="h-4 w-4 accent-primary-700" /> Published
          </label>
          <label class="flex items-center gap-2 py-1 text-sm font-semibold text-slate-700">
            <input v-model="form.is_featured" type="checkbox" class="h-4 w-4 accent-primary-700" /> Featured on homepage
          </label>
          <label class="flex items-center gap-2 py-1 text-sm font-semibold text-slate-700">
            <input v-model="form.is_best_seller" type="checkbox" class="h-4 w-4 accent-primary-700" /> Best seller badge
          </label>
          <div class="mt-3">
            <label class="adm-label">Sort order</label>
            <input v-model.number="form.sort_order" type="number" class="adm-input" />
          </div>
        </section>

        <section class="adm-card">
          <h2 class="mb-3 font-extrabold text-slate-900">Categories</h2>
          <label
            v-for="cat in meta?.tour_categories ?? []"
            :key="cat.id"
            class="flex items-center gap-2 py-1 text-sm text-slate-700"
          >
            <input v-model="form.categories" type="checkbox" :value="cat.id" class="h-4 w-4 accent-primary-700" />
            {{ cat.name }}
          </label>
        </section>

        <section class="adm-card">
          <h2 class="mb-3 font-extrabold text-slate-900">Destinations</h2>
          <label
            v-for="dest in meta?.destinations ?? []"
            :key="dest.id"
            class="flex items-center gap-2 py-1 text-sm text-slate-700"
          >
            <input v-model="form.destinations" type="checkbox" :value="dest.id" class="h-4 w-4 accent-primary-700" />
            {{ dest.name }}
          </label>
        </section>
      </aside>
    </div>
  </form>
</template>
