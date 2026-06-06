<script setup>
import { RouterLink } from 'vue-router'
import ToolbarButton from './ToolbarButton.vue'

defineProps({
  title: { type: String, default: '' },
  showBack: { type: Boolean, default: false },
  showProfile: { type: Boolean, default: false },
})

defineEmits(['back'])
</script>

<template>
  <header class="top-toolbar">
    <div class="toolbar-inner d-flex align-items-center justify-content-between px-5 pb-3 pt-0 position-relative">

      <div class="d-flex align-items-center flex-grow-1">
        <ToolbarButton
          v-if="showBack"
          variant="ghost"
          icon="ph:caret-left-light"
          aria-label="返回"
          @click="$emit('back')"
        />
      </div>

      <h1 v-if="title" class="toolbar-title h5 mb-0 position-absolute start-50 top-50 translate-middle-x text-truncate">
        {{ title }}
      </h1>

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
  background: linear-gradient(to bottom, rgba(255,255,255,0.6) 0% ,rgba(255,255,255,0) 100%) !important;
}
.toolbar-inner {
  min-height: 40px;
}
.toolbar-title {
  translate: 0 calc(-50% - 4px);
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
