<script setup lang="ts">
import {
  CalendarDays,
  FileText,
  FolderTree,
  Inbox,
  LayoutDashboard,
  LogOut,
  Map,
  MapPin,
  MessageSquare,
  Newspaper,
  Settings,
  Star,
} from "lucide-vue-next";

const token = useAdminToken();
const user = useAdminUser();

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Tours", href: "/admin/tours", icon: Map },
  { label: "Blog posts", href: "/admin/posts", icon: Newspaper },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Destinations", href: "/admin/destinations", icon: MapPin },
  { label: "Testimonials", href: "/admin/testimonials", icon: Star },
  { label: "Pages", href: "/admin/pages", icon: FileText },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  { label: "Messages", href: "/admin/messages", icon: Inbox },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const route = useRoute();
const isActive = (href: string) =>
  href === "/admin" ? route.path === "/admin" : route.path.startsWith(href);

async function logout() {
  try {
    await adminFetch("/logout", { method: "POST" });
  } catch {
    // token may already be invalid — still clear it locally
  }
  token.value = null;
  user.value = null;
  await navigateTo("/admin/login");
}
</script>

<template>
  <div class="min-h-screen bg-slate-100">
    <div class="flex min-h-screen">
      <!-- sidebar -->
      <aside class="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-ink text-neutral-300 lg:flex">
        <NuxtLink to="/admin" class="flex items-center gap-2.5 border-b border-neutral-800 px-5 py-4">
          <SiteLogo light />
        </NuxtLink>
        <nav class="flex-1 space-y-0.5 px-3 py-4" aria-label="Admin">
          <NuxtLink
            v-for="item in NAV"
            :key="item.href"
            :to="item.href"
            class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors"
            :class="isActive(item.href) ? 'bg-primary-700 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'"
          >
            <component :is="item.icon" :size="16" />
            {{ item.label }}
          </NuxtLink>
        </nav>
        <div class="border-t border-neutral-800 px-5 py-4 text-xs text-neutral-500">
          <NuxtLink to="/" class="hover:text-white">← View site</NuxtLink>
        </div>
      </aside>

      <!-- main -->
      <div class="min-w-0 flex-1">
        <header class="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
          <div class="flex items-center gap-3 lg:hidden">
            <NuxtLink to="/admin"><SiteLogo /></NuxtLink>
          </div>
          <nav class="no-scrollbar hidden gap-1 overflow-x-auto lg:flex" aria-label="Breadcrumb-ish">
            <span class="text-sm font-bold text-slate-700">Admin panel</span>
          </nav>
          <div class="flex items-center gap-3">
            <span v-if="user" class="hidden text-sm font-semibold text-slate-600 sm:inline">{{ user.name }}</span>
            <button class="adm-btn-outline" @click="logout"><LogOut :size="14" /> Logout</button>
          </div>
        </header>

        <!-- mobile nav -->
        <nav class="no-scrollbar flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 lg:hidden" aria-label="Admin sections">
          <NuxtLink
            v-for="item in NAV"
            :key="item.href"
            :to="item.href"
            class="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold"
            :class="isActive(item.href) ? 'bg-primary-700 text-white' : 'text-slate-600 hover:bg-slate-100'"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <main class="p-5 lg:p-8">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
