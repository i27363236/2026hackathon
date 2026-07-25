<script setup>
import { mainNav } from '@/nav.js'
import { Icon } from '@iconify/vue'

defineEmits(['open'])

const isDisabled = (item) => !item.to || item.to?.name === 'in-development'
</script>

<template>
  <div class="floating-pill d-none d-md-flex align-items-center rounded-pill">
    <!-- Sidebar open button -->
    <button
      class="pill-btn d-flex align-items-center justify-content-center rounded-pill text-body-secondary"
      aria-label="開啟側邊欄"
      @click="$emit('open')"
    >
      <Icon icon="ph:sidebar-light" width="24" height="24"/>
    </button>

    <div class="pill-divider" />

    <!-- Nav tab links -->
    <component
      v-for="(item, i) in mainNav"
      :key="item.label"
      :is="isDisabled(item) ? 'span' : 'RouterLink'"
      :to="isDisabled(item) ? undefined : item.to"
      class="pill-btn d-flex align-items-center justify-content-center rounded-pill"
      :class="i === mainNav.length - 1 ? 'pill-btn--active' : (isDisabled(item) ? ['pill-btn--disabled', 'text-body-tertiary'] : 'text-body-secondary')"
      :title="item.label"
    >
      <span class="pill-label">{{ item.label }}</span>
    </component>
  </div>
</template>

<style scoped>
.floating-pill {
  height: 44px;
  position: fixed;
  top: 36px;
  left: 50%;
  translate: -50% 0;
  z-index: 1200;
  padding: 6px 2px;
  background: var(--toolbar-glass-fill);
  box-shadow: var(--toolbar-glass-shadow);
  backdrop-filter: var(--toolbar-glass-blur);
  -webkit-backdrop-filter: var(--toolbar-glass-blur);
  transition: background 0.15s;
}

.pill-btn {
  width: auto;
  height: 40px;
  padding: 0 12px;
  border: none;
  background: transparent;
  text-decoration: none;
  flex-shrink: 0;
  transition: background 0.15s ease, color 0.15s ease;
}
.pill-btn:hover:not(.pill-btn--active):not(.pill-btn--disabled) {
  background: var(--component-hover-bg);
}
.pill-btn--disabled {
  cursor: default;
}
.pill-btn--active {
  background: var(--bs-primary);
  color: var(--bs-white);
  cursor: default;
}

.pill-divider {
  width: 1px;
  height: 100%;
  background: var(--bs-border-color);
}
</style>
