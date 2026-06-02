<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TopToolbar from './TopToolbar.vue'
import AppSidebar from './AppSidebar.vue'
import ToolbarButton from './ToolbarButton.vue'

const route = useRoute()
const router = useRouter()

const meta = computed(() => route.meta ?? {})
const sidebarOpen = ref(true)
</script>

<template>
  <div class="app-shell vh-100 d-flex overflow-hidden bg-body-secondary">
    <AppSidebar v-if="meta.showSidebar" :open="sidebarOpen" />
    <main class="flex-grow-1 d-flex flex-column overflow-hidden position-relative" style="min-width: 0">
      <TopToolbar
        :title="meta.title"
        :show-toggle="!!meta.showSidebar"
        :sidebar-open="sidebarOpen"
        :show-back="!!meta.back"
        :show-profile="!!meta.showProfile"
        @toggle="sidebarOpen = !sidebarOpen"
        @back="router.back()"
      >
        <template v-if="meta.showHomeActions" #actions>
          <ToolbarButton :size="32" variant="ghost" icon="ph:scan" aria-label="掃描" />
          <ToolbarButton :size="32" variant="ghost" icon="ph:qr-code" aria-label="QR碼" />
        </template>
      </TopToolbar>
      <div class="flex-grow-1 overflow-auto" style="min-height: 0">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  height: 100dvh;
}
</style>
