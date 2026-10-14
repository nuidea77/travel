<script setup lang="ts">
import { Mail, Menu, MessageCircle, Phone, X } from "lucide-vue-next";

const settings = useSettings();
const route = useRoute();
const open = ref(false);

type NavGroup = { label: string; href: string; children?: { label: string; href: string }[] };

const NAV: NavGroup[] = [
  {
    label: "Tours",
    href: "/tours",
    children: [
      { label: "All tours", href: "/tours" },
      { label: "Best seller tours", href: "/tours?category=discovery" },
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
  <header class="sticky top-0 z-50 border-b border-slate-100 bg-white">
    <div class="container-site grid grid-cols-[1fr_auto_1fr] items-center py-2.5">
      <button
        class="flex w-fit items-center gap-2 rounded-lg px-2 py-2 text-sm font-bold uppercase tracking-wide text-slate-800 transition-colors hover:bg-slate-100"
        aria-label="Open menu"
        :aria-expanded="open"
        @click="open = true"
      >
        <Menu :size="20" />
        <span class="hidden sm:inline">Menu</span>
      </button>

      <NuxtLink to="/" aria-label="Home" class="justify-self-center">
        <SiteLogo :name="settings.site_name" :tagline="settings.logo_tagline" />
      </NuxtLink>

      <div class="flex items-center justify-end">
        <a :href="waLink" target="_blank" rel="noreferrer" class="btn-whatsapp btn-sm sm:btn-md !gap-2">
          <MessageCircle :size="16" />
          <span class="hidden md:inline">Chat with us on WhatsApp</span>
          <span class="md:hidden">WhatsApp</span>
        </a>
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
          <div v-for="group in NAV" :key="group.label" class="border-b border-slate-100 py-3 last:border-0">
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
