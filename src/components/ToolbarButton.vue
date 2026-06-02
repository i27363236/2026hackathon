<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  icon: { type: String, required: true },
  ariaLabel: { type: String, required: true },
  variant: { type: String, default: 'light' },
  size: { type: Number, default: 40 },
})

defineEmits(['click'])
</script>

<template>
  <button
    type="button"
    class="toolbar-btn btn rounded-circle d-inline-flex align-items-center justify-content-center p-0"
    :class="`btn-${variant}`"
    :style="{ width: `${size}px`, height: `${size}px` }"
    :aria-label="ariaLabel"
    @click="$emit('click', $event)"
  >
    <Icon :icon="icon" :width="size * 0.55" :height="size * 0.55" />
  </button>
</template>

<style scoped>
.toolbar-btn {
  flex: 0 0 auto;
  border: none;
}
.btn-ghost {
  background: transparent;
  color: inherit;
}
.btn-ghost:hover,
.btn-ghost:focus-visible {
  background: var(--bs-gray-200);
}
</style>
