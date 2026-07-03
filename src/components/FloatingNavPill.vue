<script setup>
import { mainNav } from '../nav.js'
import { Icon } from '@iconify/vue'

defineEmits(['open'])
</script>

<template>
  <div class="floating-pill d-none d-md-flex align-items-center rounded-pill border bg-body-tertiary">
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
    <RouterLink
      v-for="(item, i) in mainNav"
      :key="item.label"
      :to="item.to || { path: '#' }"
      class="pill-btn text-body-secondary d-flex align-items-center justify-content-center rounded-pill"
      :class="{ 'pill-btn--active': i === mainNav.length - 1 }"
      :title="item.label"
    >
      <span class="pill-label">{{ item.label }}</span>
    </RouterLink>
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
  background: var(--bs-body-bg);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.10);
  padding: 6px 2px;
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
.pill-btn:hover:not(.router-link-active) {
  background: var(--component-hover-bg);
}
.pill-btn--active {
  background: var(--bs-primary);
  color: var(--bs-white) !important;
  cursor: default;
}

.pill-divider {
  width: 1px;
  height: 100%;
  background: var(--bs-border-color);
}
</style>
