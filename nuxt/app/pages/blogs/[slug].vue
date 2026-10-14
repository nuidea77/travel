<script setup lang="ts">
import { CalendarDays, Clock3, User } from "lucide-vue-next";
import { formatDate, getPost } from "~/composables/useApi";

const route = useRoute();
const slug = computed(() => String(route.params.slug ?? ""));

const { data: post } = await useAsyncData(
  () => `post-${slug.value}`,
  () => getPost(slug.value),
  { watch: [slug] },
);

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: "Article not found" });
}

useSeoMeta({
  title: () => post.value?.title ?? "Article",
  description: () => post.value?.excerpt ?? "",
});
</script>

<template>
  <div v-if="post">
    <article>
      <header class="relative isolate overflow-hidden bg-ink">
        <img
          :src="post.image ?? '/images/hero-steppe.svg'"
          :alt="post.title"
          class="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        <div class="container-site relative pb-14 pt-10 text-white lg:pb-20 lg:pt-14">
          <div class="mb-6">
            <Breadcrumb light :items="[{ label: 'Blogs', href: '/blogs' }, { label: post.title }]" />
          </div>
          <NuxtLink
            v-if="post.category"
            :to="`/blogs?category=${post.category.slug}`"
            class="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide backdrop-blur hover:bg-white/25"
          >
            {{ post.category.name }}
          </NuxtLink>
          <h1 class="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight lg:text-5xl">
            {{ post.title }}
          </h1>
          <div class="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-white/90">
            <span class="flex items-center gap-1.5"><User :size="15" /> {{ post.author }}</span>
            <span class="flex items-center gap-1.5"><CalendarDays :size="15" /> {{ formatDate(post.published_at) }}</span>
            <span class="flex items-center gap-1.5"><Clock3 :size="15" /> {{ post.read_time }} min read</span>
          </div>
        </div>
      </header>

      <div class="container-site section !pt-12">
        <div class="mx-auto max-w-3xl">
          <p class="text-lg font-medium leading-relaxed text-slate-700">{{ post.excerpt }}</p>
          <!-- Article bodies are trusted content authored in our own admin panel. -->
          <div class="prose-site mt-8" v-html="post.body" />
          <div class="mt-12 rounded-2xl bg-blush p-7 text-center">
            <h2 class="text-xl font-extrabold text-slate-900">Ready to see it for yourself?</h2>
            <p class="mt-1 text-sm text-slate-600">
              Our team turns articles like this into real itineraries every day.
            </p>
            <NuxtLink to="/tours" class="btn-primary btn-md mt-5">Browse Mongolia tours</NuxtLink>
          </div>
        </div>
      </div>
    </article>

    <section v-if="post.related && post.related.length > 0" class="section bg-slate-50">
      <div class="container-site">
        <Reveal>
          <h2 class="mb-8 text-3xl font-extrabold tracking-tight text-slate-900">Related articles</h2>
        </Reveal>
        <div class="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal v-for="(p, i) in post.related" :key="p.id" :delay="i * 90">
            <BlogCard :post="p" />
          </Reveal>
        </div>
      </div>
    </section>
  </div>
</template>
