<script setup>
import { Icon } from '@iconify/vue'
import ToolbarButton from './ToolbarButton.vue'
import { mainNav, earnPointNav, usePointNav } from '../nav.js'

defineProps({
  open: { type: Boolean, default: true },
})

defineEmits(['close'])
</script>

<template>
  <nav
    class="app-sidebar flex-column flex-shrink-0 bg-body-tertiary border rounded-4"
    :class="{ 'is-open': open }"
  >
    <!-- Close button -->
    <div class="d-flex justify-content-end px-3 pt-3">
      <ToolbarButton
        :size="44"
        variant="ghost"
        icon="ph:device-tablet-speaker-thin"
        aria-label="關閉側邊欄"
        @click="$emit('close')"
      />
    </div>

    <ul class="nav nav-pills flex-column p-4 pt-2">
      <li v-for="item in mainNav" :key="item.label" class="nav-item">
        <component
          :is="item.to ? 'RouterLink' : 'a'"
          :to="item.to"
          :href="item.to ? undefined : '#'"
          class="nav-link d-flex align-items-center gap-4 text-body"
          style="height: 2.5rem"
        >
          <Icon :icon="item.icon" width="24" class="text-body-secondary" />
          <span>{{ item.label }}</span>
        </component>
      </li>
    </ul>

    <div class="px-4 py-3 pb-4">
      <div class="pb-4">
        <div class="caption-1 text-body-secondary fw-bold px-5 mb-2">累積捷運點</div>
        <ul class="nav nav-pills flex-column">
          <li v-for="item in earnPointNav" :key="item.label" class="nav-item">
            <RouterLink
              :to="item.to"
              class="nav-link d-flex align-items-center gap-4 text-body"
              style="height: 2.75rem"
            >
              <Icon :icon="item.icon" width="24" class="text-body-secondary" />
              <span>{{ item.label }}</span>
            </RouterLink>
          </li>
        </ul>
      </div>
      <div class="caption-1 text-body-secondary fw-bold px-5 mb-2">使用捷運點</div>
      <ul class="nav nav-pills flex-column">
        <li v-for="item in usePointNav" :key="item.label" class="nav-item">
          <RouterLink
            :to="item.to"
            class="nav-link d-flex align-items-center gap-4 text-body"
            style="height: 2.75rem"
          >
            <Icon :icon="item.icon" width="24" class="text-body-secondary" />
            <span>{{ item.label }}</span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.app-sidebar {
  display: none;
  width: 0;
  margin: 0;
  overflow: hidden;
  opacity: 0;
  transition: width 0.25s ease, opacity 0.2s ease, margin 0.25s ease;
}

@media (min-width: 768px) {
  .app-sidebar {
    display: flex;
    flex-direction: column;
  }
}

.app-sidebar.is-open {
  width: 240px;
  margin: 16px;
  overflow-y: auto;
  opacity: 1;
}

.nav-link {
  white-space: nowrap;
}
.nav-link:hover:not(.router-link-active) {
  background-color: var(--bs-primary-bg-subtle);
  color: var(--bs-primary) !important;
}
.nav-link.router-link-active {
  background-color: var(--bs-primary);
  color: var(--bs-white) !important;
}
</style>
