<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  open: { type: Boolean, default: true },
})

// Top-level nav. Items without a route yet point to '#'.
const mainNav = [
  { label: '首頁', icon: 'ph:house-duotone', to: null },
  { label: '捷運路線', icon: 'ph:graph-duotone', to: null },
  { label: 'Go優惠', icon: 'ph:gift-duotone', to: null },
  { label: '更多功能', icon: 'ph:squares-four-duotone', to: null },
  { label: '我的帳戶', icon: 'ph:user-duotone', to: { name: 'profile' } },
  { label: '捷運點', to: { name: 'home' } },
]

const earnPointNav = [
  { label: '累點活動', icon: 'ph:tipi-duotone', to: { name: 'earn-events' } },
  { label: '累點地圖', icon: 'ph:map-trifold-duotone', to: { name: 'earn-map' } },
]

const usePointNav = [
  { label: '購物', icon: 'ph:shopping-bag-duotone', to: { name: 'use-shopping' } },
  { label: '送禮', icon: 'ph:gift-duotone', to: { name: 'use-gift-setup' } },
  { label: '優惠券', icon: 'ph:ticket-duotone', to: { name: 'coupons' } },
  { label: '銷點地圖', icon: 'ph:map-trifold-duotone', to: { name: 'use-redeem-map' } },
  { label: '捷客券商城', icon: 'ph:storefront-duotone', to: { name: 'use-mall' } },
  { label: '轉換點數', icon: 'ph:arrows-left-right', to: { name: 'use-convert' } },
  { label: '點數傳愛', icon: 'ph:hand-heart-duotone', to: { name: 'use-donate' } },
]
</script>

<template>
  <nav
    class="app-sidebar flex-column flex-shrink-0 bg-body-tertiary border rounded-4"
    :class="{ 'is-open': open }"
  >
    <ul class="nav nav-pills flex-column p-4">
      <li v-for="item in mainNav" :key="item.label" class="nav-item">
        <component
          :is="item.to ? 'RouterLink' : 'a'"
          :to="item.to"
          :href="item.to ? undefined : '#'"
          class="nav-link d-flex align-items-center gap-4 text-body" style="height: 2.75rem"
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
          <li v-for="item in earnPointNav" :key="item.label" class="nav-item" >
            <RouterLink
              :to="item.to"
              class="nav-link d-flex align-items-center gap-4 text-body" style="height: 2.75rem"
            >
              <Icon :icon="item.icon" width="24" class="text-body-secondary"/>
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
            class="nav-link d-flex align-items-center gap-4 text-body" style="height: 2.75rem"
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
