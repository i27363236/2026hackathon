<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  icon: { type: String, required: true },
  ariaLabel: { type: String, required: true },
  size: { type: Number, default: 44 },
})

defineEmits(['click'])
</script>

<template>
  <button
    type="button"
    class="toolbar-btn d-inline-flex align-items-center justify-content-center p-0"
    :style="{ width: `${size}px`, height: `${size}px` }"
    :aria-label="ariaLabel"
    @click="$emit('click', $event)"
  >
    <Icon :icon="icon" width="24" height="24" />
  </button>
</template>

<style scoped>
.toolbar-btn {
  flex: 0 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 800px;
  background: rgba(249, 247, 243, 0.8);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  color: inherit;
  cursor: pointer;
  padding: 4px;
  transition: background 0.15s;
}
.toolbar-btn:hover,
.toolbar-btn:focus-visible {
  background: var(--component-hover-bg);
  outline: none;
}
</style>
