<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TopToolbar from './TopToolbar.vue'
import AppSidebar from './AppSidebar.vue'

const route = useRoute()
const router = useRouter()

const meta = computed(() => route.meta ?? {})
const sidebarOpen = ref(true)
</script>

<template>
  <div class="app-shell vh-100 d-flex flex-column overflow-hidden">
    <TopToolbar
      :title="meta.title"
      :show-toggle="!!meta.showSidebar"
      :sidebar-open="sidebarOpen"
      :show-back="!!meta.back"
      @toggle="sidebarOpen = !sidebarOpen"
      @back="router.back()"
    />

    <div class="d-flex flex-grow-1 overflow-hidden">
      <AppSidebar v-if="meta.showSidebar" :open="sidebarOpen" />
      <main class="flex-grow-1 overflow-auto" style="min-width: 0">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  height: 100dvh;
}
</style>
