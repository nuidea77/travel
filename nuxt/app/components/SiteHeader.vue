<script setup lang="ts">
import { ChevronDown, Mail, Menu, MessageCircle, Phone, X } from "lucide-vue-next";

const settings = useSettings();
const route = useRoute();
const open = ref(false);
const scrolled = ref(false);

type NavGroup = { label: string; href: string; children?: { label: string; href: string }[] };

const NAV: NavGroup[] = [
  { label: "Home", href: "/" },
  {
    label: "Tours",
    href: "/tours",
    children: [
      { label: "All tours", href: "/tours" },
      { label: "Join in tours", href: "/tours?type=join" },
      { label: "Tailor made tours", href: "/tours?type=private" },
      { label: "Trip calendar", href: "/trip-calendar" },
    ],
  },
  { label: "Destinations", href: "/about-mongolia#destinations" },
  {
    label: "Blog",
    href: "/blogs",
    children: [
      { label: "All articles", href: "/blogs" },
      { label: "Travel tips", href: "/blogs?category=travel-tips" },
      { label: "Places to visit", href: "/blogs?category=places-to-visit" },
      { label: "Festivals & events", href: "/blogs?category=news-events" },
    ],
  },
  {
    label: "About",
    href: "/about-us",
    children: [
      { label: "About us", href: "/about-us" },
      { label: "About Mongolia", href: "/about-mongolia" },
      { label: "Car rental", href: "/car-rental" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

// the drawer keeps the fuller sitemap for mobile
const DRAWER_NAV: NavGroup[] = [
  {
    label: "Tours",
    href: "/tours",
    children: [
      { label: "All tours", href: "/tours" },
      { label: "Join in tours", href: "/tours?type=join" },
      { label: "Tailor made tours", href: "/tours?type=private" },
      { label: "Trip calendar", href: "/trip-calendar" },
    ],
  },
  {
    label: "About Mongolia",
    href: "/about-mongolia",
    children: [
      { label: "Country guide", href: "/about-mongolia" },
      { label: "Destinations", href: "/about-mongolia#destinations" },
      { label: "Culture & history", href: "/blogs?category=culture-history" },
      { label: "Things to know", href: "/blogs?category=things-to-know" },
    ],
  },
  {
    label: "Blogs",
    href: "/blogs",
    children: [
      { label: "All articles", href: "/blogs" },
      { label: "Travel tips", href: "/blogs?category=travel-tips" },
      { label: "Places to visit", href: "/blogs?category=places-to-visit" },
      { label: "Festivals & events", href: "/blogs?category=news-events" },
    ],
  },
  { label: "Trip Calendar", href: "/trip-calendar" },
  { label: "About Us", href: "/about-us" },
  { label: "Car Rental", href: "/car-rental" },
  { label: "Contact", href: "/contact" },
];

const waLink = computed(
  () => `https://wa.me/${settings.value.whatsapp.replace(/[^\d]/g, "")}`,
);

function isActive(item: NavGroup) {
  if (item.href === "/") return route.path === "/";
  const base = item.href.split(/[?#]/)[0]!;
  return route.path === base || route.path.startsWith(base + "/");
}

function onScroll() {
  scrolled.value = window.scrollY > 24;
}

onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener("scroll", onScroll));

watch(
  () => route.fullPath,
  () => {
    open.value = false;
  },
);

watch(open, (value) => {
  if (import.meta.client) {
    document.body.style.overflow = value ? "hidden" : "";
  }
});
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all duration-300"
    :class="scrolled ? 'border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur' : 'bg-transparent'"
  >
    <div class="container-site flex items-center justify-between gap-4 py-3">
      <NuxtLink to="/" aria-label="Home" class="shrink-0">
        <SiteLogo :name="settings.site_name" :tagline="settings.logo_tagline" :light="!scrolled" />
      </NuxtLink>

      <!-- centered pill nav -->
      <nav
        class="hidden items-center rounded-full border p-1.5 backdrop-blur-md transition-colors lg:flex"
        :class="scrolled ? 'border-slate-200 bg-white' : 'border-white/20 bg-white/10'"
        aria-label="Main"
      >
        <div v-for="item in NAV" :key="item.label" class="group relative">
          <NuxtLink
            :to="item.href"
            class="flex items-center gap-1 rounded-full px-4 py-2 text-[12.5px] font-bold uppercase tracking-wider transition-colors"
            :class="
              isActive(item)
                ? scrolled
                  ? 'bg-ink text-white'
                  : 'bg-white text-ink'
                : scrolled
                  ? 'text-slate-700 hover:bg-slate-100'
                  : 'text-white/90 hover:bg-white/15'
            "
          >
            {{ item.label }}
            <ChevronDown v-if="item.children" :size="13" class="opacity-70" />
          </NuxtLink>

          <div
            v-if="item.children"
            class="invisible absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100"
          >
            <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white py-2 shadow-card-hover">
              <NuxtLink
                v-for="child in item.children"
                :key="child.label"
                :to="child.href"
                class="block px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-ink"
              >
                {{ child.label }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </nav>

      <div class="flex shrink-0 items-center gap-2.5">
        <a
          :href="waLink"
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          class="hidden h-11 w-11 items-center justify-center rounded-full border transition-colors sm:flex"
          :class="scrolled ? 'border-slate-200 text-wa-600 hover:bg-wa-500 hover:text-white' : 'border-white/30 text-white hover:bg-white hover:text-wa-600'"
        >
          <MessageCircle :size="18" />
        </a>
        <button
          class="flex h-11 w-11 items-center justify-center rounded-full border transition-colors"
          :class="scrolled ? 'border-slate-200 text-slate-800 hover:bg-slate-100' : 'border-white/30 text-white hover:bg-white/15'"
          aria-label="Open menu"
          :aria-expanded="open"
          @click="open = true"
        >
          <Menu :size="19" />
        </button>
      </div>
    </div>

    <!-- drawer -->
    <div v-if="open" class="fixed inset-0 z-[70]">
      <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" @click="open = false" />
      <div class="absolute inset-y-0 left-0 flex w-[92%] max-w-md flex-col overflow-y-auto bg-white shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <SiteLogo :name="settings.site_name" :tagline="settings.logo_tagline" />
          <button
            class="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
            aria-label="Close menu"
            @click="open = false"
          >
            <X :size="22" />
          </button>
        </div>

        <nav class="flex-1 px-6 py-5" aria-label="Main">
          <div v-for="group in DRAWER_NAV" :key="group.label" class="border-b border-slate-100 py-3 last:border-0">
            <NuxtLink
              :to="group.href"
              class="block text-[15px] font-extrabold uppercase tracking-wide text-slate-900 transition-colors hover:text-primary-700"
            >
              {{ group.label }}
            </NuxtLink>
            <div v-if="group.children" class="mt-2 grid grid-cols-2 gap-x-4">
              <NuxtLink
                v-for="child in group.children"
                :key="child.label"
                :to="child.href"
                class="rounded py-1.5 text-sm text-slate-500 transition-colors hover:text-primary-700"
              >
                {{ child.label }}
              </NuxtLink>
            </div>
          </div>
        </nav>

        <div class="space-y-2.5 border-t border-slate-100 bg-slate-50 px-6 py-5 text-sm">
          <a :href="`tel:${settings.phone}`" class="flex items-center gap-2.5 font-semibold text-slate-700 hover:text-primary-700">
            <Phone :size="15" class="text-primary-700" /> {{ settings.phone }}
          </a>
          <a :href="`mailto:${settings.email}`" class="flex items-center gap-2.5 font-semibold text-slate-700 hover:text-primary-700">
            <Mail :size="15" class="text-primary-700" /> {{ settings.email }}
          </a>
          <a :href="waLink" target="_blank" rel="noreferrer" class="btn-whatsapp btn-md mt-2 w-full">
            <MessageCircle :size="16" /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  </header>
</template>
