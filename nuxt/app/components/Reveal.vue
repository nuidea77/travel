<script setup lang="ts">
const props = withDefaults(defineProps<{ delay?: number }>(), { delay: 0 });

const el = ref<HTMLElement | null>(null);
const visible = ref(false);

onMounted(() => {
  const node = el.value;
  if (!node) return;
  if (!("IntersectionObserver" in window)) {
    visible.value = true;
    return;
  }
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        visible.value = true;
        observer.disconnect();
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  observer.observe(node);
  onBeforeUnmount(() => observer.disconnect());
});
</script>

<template>
  <!-- Fades content up as it scrolls into view; renders visible if JS is off. -->
  <div
    ref="el"
    class="reveal"
    :class="{ 'is-visible': visible }"
    :style="props.delay ? { transitionDelay: `${props.delay}ms` } : undefined"
  >
    <slot />
  </div>
</template>
