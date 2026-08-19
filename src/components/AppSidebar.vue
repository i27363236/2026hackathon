<script setup>
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
import { mainNav, earnPointNav, usePointNav } from '@/nav.js'
import metroPointImg from '@/img/metro-point.png'

defineProps({
  open: { type: Boolean, default: true },
})

defineEmits(['close'])

const route = useRoute()
const isDisabled = (item) => !item.to || item.to?.name === 'in-development'
const isActive = (item) => !isDisabled(item) && route.name === item.to?.name
const linkColorClass = (item) => (isDisabled(item) ? 'text-body-tertiary nav-link--disabled' : (isActive(item) ? '' : 'text-body-secondary'))
</script>

<template>
  <nav
    class="app-sidebar flex-column flex-shrink-0 bg-body-tertiary"
    :class="{ 'is-open': open }"
  >
    <!-- Close button -->
    <div class="d-flex justify-content-end px-4">
      <div class="close-sidebar-button px-2 py-1 rounded-pill">
        <Icon width="24" icon="ph:device-tablet-speaker-thin" @click="$emit('close')" />
      </div>
    </div>

    <ul class="nav nav-pills flex-column p-4 pt-2">
      <li v-for="item in mainNav" :key="item.label" class="nav-item">
        <component
          :is="isDisabled(item) ? 'span' : 'RouterLink'"
          :to="isDisabled(item) ? undefined : item.to"
          class="nav-link d-flex align-items-center gap-4"
          :class="linkColorClass(item)"
        >
          <img v-if="item.metroIcon" :src="metroPointImg" width="24" height="24" />
          <Icon v-else :icon="item.icon" width="24"/>
          <span>{{ item.label }}</span>
        </component>
      </li>
    </ul>

    <div class="px-4 py-3 pb-4">
      <div class="pb-4">
        <div class="caption-1 text-body-tertiary fw-bold px-5 mb-2">累積捷運點</div>
        <ul class="nav nav-pills flex-column">
          <li v-for="item in earnPointNav" :key="item.label" class="nav-item">
            <component
              :is="isDisabled(item) ? 'span' : 'RouterLink'"
              :to="isDisabled(item) ? undefined : item.to"
              class="nav-link d-flex align-items-center gap-4"
              :class="linkColorClass(item)"
            >
              <Icon :icon="item.icon" width="24"/>
              <span>{{ item.label }}</span>
            </component>
          </li>
        </ul>
      </div>
      <div class="caption-1 text-body-tertiary fw-bold px-5 mb-2">使用捷運點</div>
      <ul class="nav nav-pills flex-column">
        <li v-for="item in usePointNav" :key="item.label" class="nav-item">
          <component
            :is="isDisabled(item) ? 'span' : 'RouterLink'"
            :to="isDisabled(item) ? undefined : item.to"
            class="nav-link d-flex align-items-center gap-4"
            :class="linkColorClass(item)"
          >
            <Icon :icon="item.icon" width="24"/>
            <span>{{ item.label }}</span>
          </component>
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
  transition: width 0.25s ease, opacity 0.2s ease;
}

@media (min-width: 768px) {
  .app-sidebar {
    display: flex;
    flex-direction: column;
  }
}

.app-sidebar.is-open {
  width: 240px;
  overflow-y: auto;
  opacity: 1;
}

.nav-link {
  white-space: nowrap;
  height: 3rem;
}
.nav-link:hover:not(.router-link-active):not(.nav-link--disabled) {
  background-color: var(--component-hover-bg);
}
.nav-link--disabled {
  cursor: default;
}
.nav-link.router-link-active {
  background-color: var(--bs-primary);
  color: var(--bs-white);
  cursor: default;

  .iconify {
    color: var(--bs-white);
  }
}

.close-sidebar-button {
  margin-top: 6px;
  cursor: pointer;

  &:hover {
    background-color: var(--component-hover-bg);
  }
}
</style>
