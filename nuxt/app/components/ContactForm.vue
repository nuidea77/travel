<script setup lang="ts">
import { CheckCircle2, Loader2 } from "lucide-vue-next";
import { postJson } from "~/composables/useApi";

const props = defineProps<{ compact?: boolean }>();

const state = ref<"idle" | "submitting" | "done">("idle");
const error = ref<string | null>(null);
const form = reactive({ name: "", email: "", subject: "", message: "" });

async function submit() {
  error.value = null;
  state.value = "submitting";
  const res = await postJson("/contact", {
    name: form.name,
    email: form.email,
    subject: form.subject || null,
    message: form.message,
  });
  if (res.ok) {
    state.value = "done";
  } else {
    state.value = "idle";
    error.value = res.message;
  }
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100";
</script>

<template>
  <div v-if="state === 'done'" class="rounded-2xl bg-primary-50 p-8 text-center">
    <CheckCircle2 :size="40" class="mx-auto text-primary-600" />
    <h3 class="mt-3 text-lg font-bold text-slate-900">Message sent!</h3>
    <p class="mt-1 text-sm text-slate-600">We will get back to you within one business day.</p>
  </div>

  <form v-else class="space-y-4" @submit.prevent="submit">
    <div :class="props.compact ? 'space-y-4' : 'grid gap-4 sm:grid-cols-2'">
      <div>
        <label for="cf-name" class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
          Full name *
        </label>
        <input id="cf-name" v-model="form.name" required maxlength="120" :class="inputCls" placeholder="Your full name" />
      </div>
      <div>
        <label for="cf-email" class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
          E-Mail *
        </label>
        <input id="cf-email" v-model="form.email" type="email" required maxlength="190" :class="inputCls" placeholder="you@example.com" />
      </div>
    </div>
    <div v-if="!props.compact">
      <label for="cf-subject" class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
        Subject
      </label>
      <input id="cf-subject" v-model="form.subject" maxlength="190" :class="inputCls" placeholder="Planning a trip in July…" />
    </div>
    <div>
      <label for="cf-message" class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
        {{ props.compact ? "Travel plans *" : "Message *" }}
      </label>
      <textarea
        id="cf-message"
        v-model="form.message"
        :rows="props.compact ? 3 : 5"
        required
        maxlength="5000"
        :class="inputCls"
        placeholder="Tell us where you want to go, when, and with whom…"
      />
    </div>

    <p v-if="error" class="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
      {{ error }}
    </p>

    <button type="submit" :disabled="state === 'submitting'" class="btn-primary w-full" :class="props.compact ? 'btn-md' : 'btn-lg'">
      <template v-if="state === 'submitting'">
        <Loader2 :size="18" class="animate-spin" /> Sending…
      </template>
      <template v-else>{{ props.compact ? "Let's go" : "Send message" }}</template>
    </button>
  </form>
</template>
