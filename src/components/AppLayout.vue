<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TopToolbar from './TopToolbar.vue'
import AppSidebar from './AppSidebar.vue'
import FloatingNavPill from './FloatingNavPill.vue'
import ToolbarButton from './ToolbarButton.vue'

const route = useRoute()
const router = useRouter()

const meta = computed(() => route.meta ?? {})
const sidebarOpen = ref(true)
</script>

<template>
  <div class="app-shell d-flex overflow-hidden bg-body-secondary">
    <AppSidebar
      v-if="meta.showSidebar"
      :open="sidebarOpen"
      @close="sidebarOpen = false"
    />

    <div class="right-col flex-grow-1 d-flex flex-column overflow-hidden position-relative" style="min-width: 0">
      <TopToolbar
        :title="meta.hideTitle ? '' : meta.title"
        :show-back="!!meta.back"
        :show-profile="!!meta.showProfile"
        :hero="!!meta.heroTop"
        @back="router.back()"
      >
        <template v-if="meta.showHomeActions || meta.showCouponActions || meta.showEventActions" #actions>
          <template v-if="meta.showHomeActions">
            <ToolbarButton :size="44" icon="ph:scan-light" aria-label="掃描" />
            <ToolbarButton :size="44" icon="ph:qr-code-light" aria-label="QR碼" />
          </template>
          <template v-else-if="meta.showCouponActions">
            <ToolbarButton icon="ph:map-trifold-light" aria-label="地圖" />
            <ToolbarButton icon="ph:magnifying-glass-light" aria-label="搜尋" />
          </template>
          <template v-else-if="meta.showEventActions">
            <ToolbarButton icon="ph:map-trifold-light" aria-label="地圖" />
          </template>
        </template>
      </TopToolbar>

      <main class="flex-grow-1 overflow-auto" style="min-height: 0" :style="meta.heroTop ? {} : { paddingTop: '40px' }">
        <RouterView />
      </main>

      <Transition name="pill">
        <FloatingNavPill
          v-if="meta.showSidebar && !sidebarOpen"
          @open="sidebarOpen = true"
        />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  height: 100dvh;
}

.pill-enter-active,
.pill-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.pill-enter-from,
.pill-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}
</style>
