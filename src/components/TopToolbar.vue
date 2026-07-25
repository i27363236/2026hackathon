<script setup>
import { RouterLink } from 'vue-router'
import ToolbarButton from './ToolbarButton.vue'

defineProps({
  title: { type: String, default: '' },
  showBack: { type: Boolean, default: false },
  showProfile: { type: Boolean, default: false },
  hero: { type: Boolean, default: false },
})

defineEmits(['back'])
</script>

<template>
  <header class="top-toolbar" :class="{ 'top-toolbar--hero': hero }">
    <div class="toolbar-inner d-flex align-items-center justify-content-between px-5 pb-3 pt-4 pt-md-0 position-relative">

      <div class="d-flex align-items-center flex-grow-1">
        <ToolbarButton
          v-if="showBack"
          icon="ph:caret-left-light"
          aria-label="返回"
          @click="$emit('back')"
        />
      </div>

      <h1 v-if="title" class="toolbar-title fs-6 mb-0 position-absolute start-50 top-50 translate-middle-x px-5 py-3">
        {{ title }}
      </h1>

      <div id="top-toolbar-actions" class="d-flex align-items-center flex-shrink-0 gap-4">
        <slot name="actions" />
        <RouterLink
          v-if="showProfile"
          to="/profile"
          class="profile-avatar rounded-circle d-inline-block overflow-hidden text-decoration-none flex-shrink-0"
          aria-label="個人檔案"
        >
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" alt="頭像" class="w-100 h-100 object-fit-cover" />
        </RouterLink>
      </div>

    </div>
  </header>
</template>

<style scoped>
.top-toolbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1020;
  background: none;
  /* Transparent on every page — the glass pills (buttons + title) stay legible on their own,
     matching the iOS 27 look. The --hero modifier is kept as a no-op for backward compat. */
}
.toolbar-inner {
  min-height: 40px;
}
.toolbar-title {
  translate: 0 calc(-50% - 4px);
  pointer-events: none;
  max-width: 70%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-radius: var(--bs-border-radius-pill);
  background: var(--toolbar-glass-fill);
  box-shadow: var(--toolbar-glass-shadow);
  backdrop-filter: var(--toolbar-glass-blur);
  -webkit-backdrop-filter: var(--toolbar-glass-blur);
  margin-block: 6px;
  @media (min-width: 768px) {
  margin-block: 0;
  }
}
.profile-avatar {
  position: relative;
  width: 44px;
  height: 44px;
}
.profile-avatar::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0);
  transition: background 0.15s;
}
.profile-avatar:hover::after {
  background: rgba(0, 0, 0, 0.15);
}
</style>
