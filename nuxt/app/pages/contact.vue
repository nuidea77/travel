<script setup lang="ts">
import { Clock4, Mail, MapPin, MessageCircle, Phone } from "lucide-vue-next";
import { useSettings } from "~/composables/useApi";

const settings = useSettings();

useSeoMeta({
  title: "Contact Us",
  description:
    "Talk to our Ulaanbaatar team about tours, private itineraries, car rental or anything Mongolia.",
});

const items = computed(() => [
  { icon: MapPin, title: "Visit us", lines: [settings.value.address] },
  { icon: Phone, title: "Call us", lines: [settings.value.phone, settings.value.phone2 ?? "Mon–Sat, 09:00–18:00 (UTC+8)"] },
  { icon: MessageCircle, title: "WhatsApp", lines: [settings.value.whatsapp, "Fastest for travelers on the road"] },
  { icon: Mail, title: "Email", lines: [settings.value.email, "We reply within one business day"] },
]);
</script>

<template>
  <div>
    <PageHero
      title="Contact us"
      subtitle="Real humans in Ulaanbaatar — tell us your dates, dreams and questions."
      image="/images/ulaanbaatar.svg"
      breadcrumb="Contact"
    />
    <section class="section !pt-12">
      <div class="container-site grid gap-12 lg:grid-cols-[380px_1fr]">
        <div class="space-y-5">
          <div v-for="item in items" :key="item.title" class="flex gap-4 rounded-2xl border border-slate-200 p-5">
            <span class="h-fit rounded-xl bg-primary-100 p-2.5 text-primary-700">
              <component :is="item.icon" :size="20" />
            </span>
            <div>
              <h2 class="font-extrabold text-slate-900">{{ item.title }}</h2>
              <p
                v-for="(line, i) in item.lines"
                :key="line"
                :class="i === 0 ? 'mt-0.5 text-sm font-semibold text-slate-700' : 'text-xs text-slate-500'"
              >
                {{ line }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3 rounded-2xl bg-blush p-5 text-sm text-slate-600">
            <Clock4 :size="18" class="shrink-0 text-primary-700" />
            Ulaanbaatar is UTC+8 — we answer overnight requests first thing each morning.
          </div>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white p-7 shadow-card lg:p-9">
          <h2 class="text-2xl font-extrabold text-slate-900">Send a message</h2>
          <p class="mt-1 text-sm text-slate-500">
            Planning a trip? Include rough dates and group size and we'll come back with a draft itinerary.
          </p>
          <div class="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
