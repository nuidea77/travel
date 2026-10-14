<script setup lang="ts">
import { Loader2, Lock } from "lucide-vue-next";
import { adminError } from "~/composables/useAdmin";

definePageMeta({ layout: false });

const token = useAdminToken();
const user = useAdminUser();
const config = useRuntimeConfig();

const form = reactive({ email: "", password: "" });
const submitting = ref(false);
const error = ref<string | null>(null);

async function submit() {
  submitting.value = true;
  error.value = null;
  try {
    const res = await $fetch<{ token: string; user: { id: number; name: string; email: string } }>(
      `${config.public.apiBase}/admin/login`,
      { method: "POST", body: { ...form }, headers: { Accept: "application/json" } },
    );
    token.value = res.token;
    user.value = res.user;
    await navigateTo("/admin");
  } catch (e: unknown) {
    error.value = adminError(e);
  } finally {
    submitting.value = false;
  }
}

useSeoMeta({ title: "Admin login" });
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-ink px-4">
    <div class="w-full max-w-sm">
      <div class="mb-6 flex justify-center">
        <SiteLogo light />
      </div>
      <form class="rounded-2xl bg-white p-7 shadow-card" @submit.prevent="submit">
        <h1 class="flex items-center gap-2 text-lg font-extrabold text-slate-900">
          <Lock :size="17" class="text-primary-700" /> Admin login
        </h1>
        <div class="mt-5 space-y-4">
          <div>
            <label for="al-email" class="adm-label">Email</label>
            <input id="al-email" v-model="form.email" type="email" required class="adm-input" placeholder="admin@example.com" />
          </div>
          <div>
            <label for="al-password" class="adm-label">Password</label>
            <input id="al-password" v-model="form.password" type="password" required class="adm-input" placeholder="••••••••" />
          </div>
          <p v-if="error" class="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {{ error }}
          </p>
          <button type="submit" :disabled="submitting" class="adm-btn-primary w-full justify-center">
            <Loader2 v-if="submitting" :size="15" class="animate-spin" />
            Sign in
          </button>
        </div>
      </form>
      <p class="mt-4 text-center text-xs text-neutral-500">
        <NuxtLink to="/" class="hover:text-white">← Back to site</NuxtLink>
      </p>
    </div>
  </div>
</template>
