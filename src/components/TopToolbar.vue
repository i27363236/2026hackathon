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
    <div class="toolbar-inner d-flex align-items-center justify-content-between px-5 pb-3 pt-0 position-relative">

      <div class="d-flex align-items-center flex-grow-1">
        <ToolbarButton
          v-if="showBack"
          icon="ph:caret-left-light"
          aria-label="返回"
          @click="$emit('back')"
        />
      </div>

      <h1 v-if="title" class="toolbar-title h5 mb-0 position-absolute start-50 top-50 translate-middle-x">
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
  background: linear-gradient(to bottom, rgba(255,255,255,0.88) 60%, rgba(255,255,255,0) 100%) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.top-toolbar--hero {
  background: none !important;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}
.toolbar-inner {
  min-height: 40px;
}
.toolbar-title {
  translate: 0 calc(-50% - 4px);
  pointer-events: none;
  max-width: 50%;
  overflow: visible;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-shadow: 0 0 8px rgba(255,255,255,1), 0 0 20px rgba(255,255,255,0.9), 0 0 40px rgba(255,255,255,0.7);
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
