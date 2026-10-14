<script setup lang="ts">
import { CheckCircle2, Loader2 } from "lucide-vue-next";
import type { Departure } from "~/types";
import { postJson } from "~/composables/useApi";

const props = defineProps<{
  tourId: number;
  tourTitle: string;
  departures?: Departure[];
}>();

const state = ref<"idle" | "submitting" | "done">("idle");
const error = ref<string | null>(null);
const form = reactive({
  name: "",
  email: "",
  phone: "",
  country: "",
  travelers: 2,
  departure_id: "",
  preferred_date: "",
  message: "",
});

async function submit() {
  error.value = null;
  state.value = "submitting";
  const res = await postJson("/bookings", {
    tour_id: props.tourId,
    departure_id: form.departure_id ? Number(form.departure_id) : null,
    name: form.name,
    email: form.email,
    phone: form.phone || null,
    country: form.country || null,
    travelers: Number(form.travelers || 1),
    preferred_date: form.preferred_date || null,
    message: form.message || null,
  });
  if (res.ok) {
    state.value = "done";
  } else {
    state.value = "idle";
    error.value = res.message;
  }
}

function departureLabel(d: Departure) {
  const date = new Date(d.start_date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${date} — ${d.seats_left} seats left`;
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100";
</script>

<template>
  <div v-if="state === 'done'" class="rounded-2xl bg-primary-50 p-8 text-center">
    <CheckCircle2 :size="40" class="mx-auto text-primary-600" />
    <h3 class="mt-3 text-lg font-bold text-slate-900">Request received!</h3>
    <p class="mt-1 text-sm text-slate-600">
      Thank you for your interest in the {{ tourTitle }}. Our travel specialists
      will reply within 24 hours.
    </p>
  </div>

  <form v-else class="space-y-4" @submit.prevent="submit">
    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <label for="bf-name" class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
          Full name *
        </label>
        <input id="bf-name" v-model="form.name" required maxlength="120" :class="inputCls" placeholder="Your full name" />
      </div>
      <div>
        <label for="bf-email" class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
          Email *
        </label>
        <input id="bf-email" v-model="form.email" type="email" required maxlength="190" :class="inputCls" placeholder="you@example.com" />
      </div>
      <div>
        <label for="bf-phone" class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
          Phone / WhatsApp
        </label>
        <input id="bf-phone" v-model="form.phone" maxlength="60" :class="inputCls" placeholder="+1 555 000 0000" />
      </div>
      <div>
        <label for="bf-country" class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
          Country
        </label>
        <input id="bf-country" v-model="form.country" maxlength="90" :class="inputCls" placeholder="United States" />
      </div>
      <div>
        <label for="bf-travelers" class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
          Travelers
        </label>
        <input id="bf-travelers" v-model="form.travelers" type="number" min="1" max="99" :class="inputCls" />
      </div>
      <div v-if="departures && departures.length > 0">
        <label for="bf-departure" class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
          Departure
        </label>
        <select id="bf-departure" v-model="form.departure_id" :class="inputCls">
          <option value="">Flexible / not sure yet</option>
          <option v-for="d in departures" :key="d.id" :value="String(d.id)">
            {{ departureLabel(d) }}
          </option>
        </select>
      </div>
      <div v-else>
        <label for="bf-date" class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
          Preferred start date
        </label>
        <input id="bf-date" v-model="form.preferred_date" type="date" :class="inputCls" />
      </div>
    </div>
    <div>
      <label for="bf-message" class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
        Tell us about your plans
      </label>
      <textarea
        id="bf-message"
        v-model="form.message"
        rows="4"
        maxlength="3000"
        :class="inputCls"
        placeholder="Dates, group details, special requests…"
      />
    </div>

    <p v-if="error" class="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
      {{ error }}
    </p>

    <button type="submit" :disabled="state === 'submitting'" class="btn-primary btn-lg w-full">
      <template v-if="state === 'submitting'">
        <Loader2 :size="18" class="animate-spin" /> Sending…
      </template>
      <template v-else>Request booking</template>
    </button>
    <p class="text-center text-xs text-slate-400">
      No payment now — we confirm availability first, then arrange secure payment.
    </p>
  </form>
</template>
