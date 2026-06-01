<script setup>
import ToolbarButton from './ToolbarButton.vue'

defineProps({
  title: { type: String, default: '' },
  showToggle: { type: Boolean, default: false },
  sidebarOpen: { type: Boolean, default: true },
  showBack: { type: Boolean, default: false },
})

defineEmits(['toggle', 'back'])
</script>

<template>
  <header class="top-toolbar">
    <div class="d-flex align-items-center gap-4 px-5 py-4">
      <!-- Tablet+: sidebar toggle -->
      <ToolbarButton
        v-if="showToggle"
        class="d-none d-md-inline-flex"
        :icon="sidebarOpen ? 'ph:sidebar-simple-fill' : 'ph:sidebar-simple'"
        aria-label="切換側邊欄"
        @click="$emit('toggle')"
      />
      <!-- Back button -->
      <ToolbarButton
        v-if="showBack"
        icon="ph:arrow-left"
        aria-label="返回"
        @click="$emit('back')"
      />

      <h1 v-if="title" class="h4 mb-0 text-truncate">{{ title }}</h1>

      <div class="ms-auto d-flex align-items-center gap-3">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.top-toolbar {
  position: sticky;
  top: 0;
  z-index: 1020;
  padding-top: env(safe-area-inset-top);
}
</style>
