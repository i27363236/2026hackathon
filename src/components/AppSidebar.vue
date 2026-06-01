<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  open: { type: Boolean, default: true },
})

// Top-level nav. Items without a route yet point to '#'.
const mainNav = [
  { label: '首頁', icon: 'ph:house', to: { name: 'home' } },
  { label: '捷運路線', icon: 'ph:subway', to: null },
  { label: 'Go優惠', icon: 'ph:tag', to: null },
  { label: '更多功能', icon: 'ph:squares-four', to: null },
  { label: '我的帳戶', icon: 'ph:user', to: { name: 'profile' } },
]

const pointNav = [
  { label: '累點活動', icon: 'ph:calendar-star', to: { name: 'earn-events' } },
  { label: '累點地圖', icon: 'ph:map-trifold', to: { name: 'earn-map' } },
  { label: '購物', icon: 'ph:shopping-bag', to: { name: 'use-shopping' } },
  { label: '送禮', icon: 'ph:gift', to: { name: 'use-gift-setup' } },
  { label: '優惠券', icon: 'ph:ticket', to: { name: 'coupons' } },
  { label: '銷點地圖', icon: 'ph:map-pin', to: { name: 'use-redeem-map' } },
  { label: '捷客券商城', icon: 'ph:storefront', to: { name: 'use-mall' } },
  { label: '轉換點數', icon: 'ph:arrows-left-right', to: { name: 'use-convert' } },
  { label: '點數傳愛', icon: 'ph:heart', to: { name: 'use-donate' } },
]
</script>

<template>
  <nav
    v-show="open"
    class="app-sidebar d-none d-md-flex flex-column flex-shrink-0 bg-body border-end overflow-auto py-5"
  >
    <ul class="nav nav-pills flex-column px-4 gap-1">
      <li v-for="item in mainNav" :key="item.label" class="nav-item">
        <component
          :is="item.to ? 'RouterLink' : 'a'"
          :to="item.to"
          :href="item.to ? undefined : '#'"
          class="nav-link d-flex align-items-center gap-4 text-body"
        >
          <Icon :icon="item.icon" width="22" height="22" />
          <span>{{ item.label }}</span>
        </component>
      </li>
    </ul>

    <hr class="mx-5 my-4" />
    <div class="text-body-secondary small fw-bold px-5 mb-2">捷點</div>

    <ul class="nav nav-pills flex-column px-4 gap-1">
      <li v-for="item in pointNav" :key="item.label" class="nav-item">
        <RouterLink
          :to="item.to"
          class="nav-link d-flex align-items-center gap-4 text-body"
        >
          <Icon :icon="item.icon" width="22" height="22" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.app-sidebar {
  width: 240px;
}
.nav-link.router-link-active {
  background-color: var(--bs-primary);
  color: var(--bs-white) !important;
}
</style>
