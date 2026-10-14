<script setup lang="ts">
const settings = useSettings();
</script>

<template>
  <div class="overflow-hidden rounded-xl bg-slate-50 shadow-card">
    <div class="bg-primary-700 px-6 py-4">
      <h3 class="font-extrabold text-white">Need Help Planning Your Vacation?</h3>
    </div>
    <div class="p-6">
      <p class="text-sm text-slate-600">
        Our friendly local experts will respond to your request with lightning speed.
      </p>
      <div class="mt-4">
        <ContactForm compact />
      </div>
      <p class="mt-4 text-center text-xs text-slate-400">
        Prefer to talk? Call {{ settings.phone }}
      </p>
    </div>
  </div>
</template>
