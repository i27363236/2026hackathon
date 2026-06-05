<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { getCoupons } from '../../data/coupons.js'

const router = useRouter()
const coupons = ref(getCoupons())
const activeTab = ref('available')

const tabs = [
  { id: 'available', label: '可使用' },
  { id: 'used', label: '已使用' },
  { id: 'expired', label: '已過期' }
]

const goBack = () => router.back()
</script>

<template>
  <div class="coupons-view pb-5">
    <!-- Header -->
    <header class="sticky-top bg-white border-bottom p-3 d-flex align-items-center">
      <button class="btn btn-link p-0 text-dark me-3" @click="goBack">
        <Icon icon="ph:caret-left-bold" width="24" height="24" />
      </button>
      <h1 class="h5 mb-0 fw-bold">我的優惠券</h1>
    </header>

    <!-- Tabs -->
    <div class="tabs-container px-3 mt-3">
      <div class="nav nav-pills nav-fill bg-light rounded-pill p-1 shadow-sm">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="nav-link rounded-pill py-2 border-0"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Coupon List -->
    <div v-if="activeTab === 'available'" class="coupon-list p-3">
      <div 
        v-for="coupon in coupons" 
        :key="coupon.id" 
        class="coupon-card d-flex align-items-center p-3 mb-3 border rounded-3 bg-white"
      >
        <div class="coupon-img-wrapper rounded overflow-hidden flex-shrink-0" style="width: 72px; height: 72px;">
          <img :src="coupon.img" class="w-100 h-100 object-fit-cover" :alt="coupon.title">
        </div>
        <div class="ms-3 flex-grow-1 overflow-hidden">
          <div :class="['small fw-bold mb-1', `card-subtitle--${coupon.colorKey}`]">
            {{ coupon.sub }}
          </div>
          <h2 class="h6 mb-1 text-truncate fw-bold">{{ coupon.title }}</h2>
          <div class="d-flex align-items-center text-secondary small">
            <Icon icon="ph:coins-fill" class="me-1 text-warning" />
            <span>{{ coupon.point }} 點數兌換</span>
          </div>
        </div>
        <Icon icon="ph:caret-right-bold" class="text-secondary opacity-50 ms-2" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-5 mt-5">
      <Icon icon="ph:ticket-light" width="64" height="64" class="text-secondary opacity-25 mb-3" />
      <p class="text-secondary">目前沒有紀錄</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.coupons-view {
  min-height: 100vh;
  background-color: #F8F9FA;
}

.nav-pills {
  .nav-link {
    color: var(--bs-secondary-color);
    font-size: 0.9375rem;
    
    &.active {
      background-color: var(--bs-white);
      color: var(--bs-primary);
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
  }
}

.coupon-card {
  transition: transform 0.1s ease-in-out;
  
  &:active {
    transform: scale(0.98);
    background-color: var(--bs-gray-100) !important;
  }
}
</style>
