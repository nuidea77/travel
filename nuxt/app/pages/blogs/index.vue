<script setup lang="ts">
import { ArrowRight } from "lucide-vue-next";
import { getPostCategories, getPosts } from "~/composables/useApi";

const route = useRoute();

useSeoMeta({
  title: "Blogs",
  description:
    "Mongolia travel tips, destination guides, festival news and cultural know-how from a local team of guides.",
});

const queryString = computed(() => {
  const params = new URLSearchParams();
  for (const key of ["category", "search", "page"]) {
    const value = route.query[key];
    if (typeof value === "string" && value) params.set(key, value);
  }
  return params.toString();
});

const { data: posts } = await useAsyncData(
  "posts",
  () => getPosts(queryString.value),
  { watch: [queryString] },
);
const { data: categories } = await useAsyncData("post-categories", () => getPostCategories());

const activeCategory = computed(() =>
  typeof route.query.category === "string" ? route.query.category : "",
);
const isFirstUnfilteredPage = computed(
  () => !activeCategory.value && (posts.value?.current_page ?? 1) === 1,
);
const featured = computed(() =>
  isFirstUnfilteredPage.value ? posts.value?.data[0] : undefined,
);
const rest = computed(() =>
  isFirstUnfilteredPage.value ? (posts.value?.data.slice(1) ?? []) : (posts.value?.data ?? []),
);
</script>

<template>
  <div>
    <section class="border-b border-slate-100 bg-white">
      <div class="container-site py-10 lg:py-14">
        <Breadcrumb :items="[{ label: 'Blogs' }]" />
        <h1 class="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">Blogs</h1>
        <p class="mt-3 text-slate-500">It is a land where you can experience wide-open spaces.</p>
      </div>
    </section>

    <section class="section !pt-8">
      <div class="container-site">
        <!-- category pills -->
        <div class="no-scrollbar mb-8 flex gap-1.5 overflow-x-auto rounded-full bg-slate-100 p-1.5">
          <NuxtLink
            to="/blogs"
            class="shrink-0 rounded-full px-5 py-2 text-sm font-bold transition-colors"
            :class="
              !activeCategory
                ? 'bg-primary-700 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white hover:text-primary-700'
            "
          >
            All articles
          </NuxtLink>
          <NuxtLink
            v-for="cat in categories ?? []"
            :key="cat.id"
            :to="`/blogs?category=${cat.slug}`"
            class="shrink-0 rounded-full px-5 py-2 text-sm font-bold transition-colors"
            :class="
              activeCategory === cat.slug
                ? 'bg-primary-700 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white hover:text-primary-700'
            "
          >
            {{ cat.name }}
          </NuxtLink>
        </div>

        <div v-if="!posts || posts.data.length === 0" class="rounded-xl bg-slate-50 p-14 text-center">
          <p class="text-lg font-extrabold text-slate-800">No articles found</p>
        </div>

        <div v-else class="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          <!-- featured card spans 2 cols -->
          <NuxtLink
            v-if="featured"
            :to="`/blogs/${featured.slug}`"
            class="group relative block overflow-hidden rounded-xl sm:col-span-2"
          >
            <div class="relative min-h-[280px] sm:min-h-[340px]">
              <img
                :src="featured.image ?? '/images/hero-steppe.svg'"
                :alt="featured.title"
                class="img-zoom absolute inset-0 h-full w-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
              <span
                v-if="featured.category"
                class="absolute left-5 top-5 rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-800"
              >
                {{ featured.category.name }}
              </span>
              <div class="absolute inset-x-0 bottom-0 p-6">
                <h2 class="max-w-2xl text-2xl font-extrabold leading-snug text-white lg:text-3xl">
                  {{ featured.title }}
                </h2>
                <span class="mt-3 inline-flex items-center gap-2 text-sm font-bold text-white">
                  Read more
                  <span class="flex h-7 w-7 items-center justify-center rounded-full border border-white/70 transition-colors group-hover:bg-white group-hover:text-slate-900">
                    <ArrowRight :size="13" />
                  </span>
                </span>
              </div>
            </div>
          </NuxtLink>
          <BlogCard v-for="post in rest" :key="post.id" :post="post" />
        </div>

        <AppPagination
          :current-page="posts?.current_page ?? 1"
          :last-page="posts?.last_page ?? 1"
          base-path="/blogs"
        />
      </div>
    </section>
  </div>
</template>
