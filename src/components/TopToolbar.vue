<script setup>
import { RouterLink } from 'vue-router'
import ToolbarButton from './ToolbarButton.vue'

defineProps({
  title: { type: String, default: '' },
  showToggle: { type: Boolean, default: false },
  sidebarOpen: { type: Boolean, default: true },
  showBack: { type: Boolean, default: false },
  showProfile: { type: Boolean, default: false },
})

defineEmits(['toggle', 'back'])
</script>

<template>
  <header class="top-toolbar">
    <!-- px-5=16px, pb-3=8px, pt-0 — matches Figma container padding -->
    <div class="toolbar-inner d-flex align-items-center justify-content-between px-5 pb-3 pt-0 position-relative">

      <!-- Left: grows to fill space, holds back / sidebar-toggle -->
      <div class="d-flex align-items-center flex-grow-1">
        <ToolbarButton
          v-if="showToggle"
          class="d-none d-md-inline-flex"
          :size="32"
          variant="ghost"
          :icon="sidebarOpen ? 'ph:sidebar-simple-fill' : 'ph:sidebar-simple'"
          aria-label="切換側邊欄"
          @click="$emit('toggle')"
        />
        <ToolbarButton
          v-if="showBack"
          :size="32"
          variant="ghost"
          icon="ph:caret-left"
          aria-label="返回"
          @click="$emit('back')"
        />
      </div>

      <!-- Center: absolute, left-50% translate-x(-50%), top 5px -->
      <h1 v-if="title" class="toolbar-title h5 fw-bold mb-0 position-absolute start-50 translate-middle-x text-truncate">
        {{ title }}
      </h1>

      <!-- Right: buttons with no gap, then profile with 10px left padding -->
      <div class="d-flex align-items-center flex-shrink-0">
        <slot name="actions" />
        <RouterLink
          v-if="showProfile"
          to="/profile"
          class="profile-avatar rounded-circle d-inline-block overflow-hidden text-decoration-none flex-shrink-0"
          aria-label="個人檔案"
        />
      </div>

    </div>
  </header>
</template>

<style scoped>
.top-toolbar {
  position: sticky;
  top: 0;
  z-index: 1020;
  background: rgba(255, 255, 255, 0.12) !important;
  backdrop-filter: blur(48px) saturate(180%) brightness(1.06);
  -webkit-backdrop-filter: blur(48px) saturate(180%) brightness(1.06);
  /* specular inner highlight mimicking glass edge */
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.55),
              inset 0 -1px 0 rgba(255, 255, 255, 0.18);
}
.toolbar-inner {
  min-height: 40px;
}
.toolbar-title {
  top: 5px;
  pointer-events: none;
  max-width: 50%;
}
.profile-avatar {
  width: 24px;
  height: 24px;
  background-color: var(--bs-gray-400);
  margin-left: 10px;
}
</style>
