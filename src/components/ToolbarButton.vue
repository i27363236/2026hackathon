<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  icon: { type: String, required: true },
  ariaLabel: { type: String, required: true },
  size: { type: Number, default: 44 },
  accent: { type: Boolean, default: false }, // primary-filled call-to-action variant
  disabled: { type: Boolean, default: false },
})

defineEmits(['click'])
</script>

<template>
  <button
    type="button"
    class="toolbar-btn d-inline-flex align-items-center justify-content-center p-0"
    :class="{ 'toolbar-btn--accent': accent }"
    :style="{ width: `${size}px`, height: `${size}px` }"
    :aria-label="ariaLabel"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <Icon :icon="icon" width="24" height="24" />
  </button>
</template>

<style scoped>
.toolbar-btn {
  flex: 0 0 auto;
  border: 0;
  border-radius: 800px;
  background: var(--toolbar-glass-fill);
  box-shadow: var(--toolbar-glass-shadow);
  backdrop-filter: var(--toolbar-glass-blur);
  -webkit-backdrop-filter: var(--toolbar-glass-blur);
  transition: background 0.15s;
  color: inherit;
  cursor: pointer;
  padding: 4px;
}
.toolbar-btn:hover,
.toolbar-btn:focus-visible {
  background: var(--component-hover-bg);
  outline: none;
}
.toolbar-btn--accent {
  background: var(--bs-primary);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.12);
  color: #fff;
}
.toolbar-btn--accent:hover,
.toolbar-btn--accent:focus-visible {
  background: var(--bs-primary);
  filter: brightness(0.94);
}
.toolbar-btn:disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
