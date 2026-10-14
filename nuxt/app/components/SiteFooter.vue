<script setup lang="ts">
const settings = useSettings();

const COLUMNS = [
  {
    title: "Tours",
    links: [
      { label: "Discovery tours", href: "/tours?category=discovery" },
      { label: "Trip calendar", href: "/trip-calendar" },
      { label: "Join in tours", href: "/tours?type=join" },
      { label: "Tailor made tours", href: "/tours?type=private" },
    ],
  },
  {
    title: "About Mongolia",
    links: [
      { label: "Practical information", href: "/about-mongolia" },
      { label: "Destinations", href: "/about-mongolia#destinations" },
      { label: "Things to do", href: "/blogs?category=places-to-visit" },
      { label: "Culture & history", href: "/blogs?category=culture-history" },
    ],
  },
  {
    title: "Blogs",
    links: [
      { label: "Travel tips", href: "/blogs?category=travel-tips" },
      { label: "Festivals & events", href: "/blogs?category=news-events" },
      { label: "Places to visit", href: "/blogs?category=places-to-visit" },
      { label: "Things to know", href: "/blogs?category=things-to-know" },
    ],
  },
  {
    title: "Travel Tools",
    links: [
      { label: "Best time to travel", href: "/blogs/best-time-to-visit-mongolia" },
      { label: "Visa information", href: "/blogs/mongolia-visa-rules-2026" },
      { label: "What to pack", href: "/blogs/what-to-pack-for-the-gobi" },
      { label: "Railway guide", href: "/blogs/trans-mongolian-railway-guide" },
    ],
  },
  {
    title: "About Us",
    links: [
      { label: "Company profile", href: "/about-us" },
      { label: "Meet the team", href: "/about-us" },
      { label: "Contact us", href: "/contact" },
      { label: "Booking inquiry", href: "/contact" },
    ],
  },
  {
    title: "Car Rental",
    links: [
      { label: "Rent with driver", href: "/car-rental" },
      { label: "Our fleet", href: "/car-rental" },
    ],
  },
];

const year = new Date().getFullYear();

const socialPaths: Record<string, string[]> = {
  facebook: ["M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"],
  instagram: [
    "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z",
    "M17.5 6.5h.01",
  ],
  youtube: [
    "M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17",
    "m10 15 5-3-5-3z",
  ],
  linkedin: [
    "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",
    "M2 9h4v12H2z",
    "M4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
  ],
  x: ["M4 4l16 16M20 4L4 20"],
};
</script>

<template>
  <footer class="bg-ink text-neutral-300">
    <div class="container-site pb-8 pt-14">
      <!-- brand row -->
      <div class="flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8">
        <NuxtLink to="/" aria-label="Home">
          <SiteLogo :name="settings.site_name" :tagline="settings.logo_tagline" light />
        </NuxtLink>
        <span class="hidden h-12 w-px bg-neutral-800 sm:block" aria-hidden="true" />
        <AwardBadge :size="64" />
      </div>

      <!-- link columns -->
      <div class="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
        <div v-for="col in COLUMNS" :key="col.title">
          <h3 class="text-[13px] font-extrabold uppercase tracking-wider text-white">
            {{ col.title }}
          </h3>
          <ul class="mt-4 space-y-2.5 text-sm">
            <li v-for="link in col.links" :key="link.label">
              <NuxtLink :to="link.href" class="text-neutral-400 transition-colors hover:text-white">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- socials -->
      <div class="mt-12 flex items-center justify-center gap-3">
        <a
          v-for="(url, key) in settings.socials"
          :key="key"
          :href="url"
          target="_blank"
          rel="noreferrer"
          :aria-label="String(key)"
          class="rounded-full border border-neutral-700 p-2.5 text-neutral-300 transition-colors hover:border-white hover:text-white"
        >
          <svg
            v-if="socialPaths[String(key)]"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path v-for="(d, i) in socialPaths[String(key)]" :key="i" :d="d" />
          </svg>
        </a>
      </div>

      <!-- bottom bar -->
      <div class="mt-10 flex flex-col items-center justify-between gap-3 border-t border-neutral-800 pt-6 text-xs text-neutral-500 sm:flex-row">
        <p>
          © {{ settings.legal_name ?? settings.site_name }} {{ settings.founded_year }} – {{ year }}.
          All rights reserved.
        </p>
        <p>{{ settings.address }}</p>
      </div>
    </div>
  </footer>
</template>
