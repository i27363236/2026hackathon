<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('unused') // 'unused' | 'history'

const coupons = ref([
  {
    id: 1,
    store: '路易莎咖啡',
    title: '50元現金折價券',
    expiryDate: '2024/12/31',
    image: 'https://placehold.co/400x400?text=Louisa',
    status: 'unused',
    code: 'LSA-8829-102'
  },
  {
    id: 2,
    store: '全家便利商店',
    title: '中杯美式咖啡',
    expiryDate: '2024/08/15',
    image: 'https://placehold.co/400x400?text=FamilyMart',
    status: 'unused',
    code: 'FM-1102-993'
  },
  {
    id: 3,
    store: '台北捷運',
    title: '24小時旅遊票',
    expiryDate: '2024/06/01',
    image: 'https://placehold.co/400x400?text=Metro',
    status: 'used',
    code: 'MRT-0091-223'
  }
])

const filteredCoupons = computed(() => {
  return coupons.value.filter(c => 
    activeTab.value === 'unused' ? c.status === 'unused' : c.status !== 'unused'
  )
})

const goBack = () => router.back()
</script>

<template>
  <div class="my-coupons pb-5">
    <!-- Header -->
    <header class="d-flex align-items-center p-3 sticky-top bg-white border-bottom shadow-sm">
      <button class="btn btn-link text-dark p-0 me-3" @click="goBack">
        <Icon icon="f7:arrow-left" width="24" height="24" />
      </button>
      <h1 class="h5 fw-bold mb-0">我的優惠券</h1>
    </header>

    <!-- Tabs -->
    <div class="px-3 py-4">
      <div class="nav-tabs-custom d-flex bg-light rounded-pill p-1">
        <button 
          class="btn flex-grow-1 rounded-pill py-2 transition-all"
          :class="activeTab === 'unused' ? 'bg-white shadow-sm fw-bold text-primary' : 'text-secondary border-0'"
          @click="activeTab = 'unused'"
        >
          未使用
        </button>
        <button 
          class="btn flex-grow-1 rounded-pill py-2 transition-all"
          :class="activeTab === 'history' ? 'bg-white shadow-sm fw-bold text-primary' : 'text-secondary border-0'"
          @click="activeTab = 'history'"
        >
          使用紀錄
        </button>
      </div>
    </div>

    <!-- Coupon List -->
    <div class="px-3">
      <div v-if="filteredCoupons.length > 0" class="d-flex flex-column gap-3">
        <div 
          v-for="coupon in filteredCoupons" 
          :key="coupon.id" 
          class="coupon-card card border-0 shadow-sm rounded-4 overflow-hidden"
          :class="{ 'opacity-75 grayscale': activeTab === 'history' }"
        >
          <div class="d-flex h-100">
            <!-- Left: Image -->
            <div class="coupon-img-wrapper">
              <img :src="coupon.image" class="h-100 w-100 object-fit-cover" :alt="coupon.title">
            </div>
            
            <!-- Right: Content -->
            <div class="card-body p-3 d-flex flex-column justify-content-between">
              <div>
                <div class="text-muted smaller mb-1 text-truncate">{{ coupon.store }}</div>
                <h3 class="h6 fw-bold text-dark mb-1">{{ coupon.title }}</h3>
                <div class="smaller text-secondary d-flex align-items-center">
                  <Icon icon="f7:clock" class="me-1" width="14" />
                  有效期至 {{ coupon.expiryDate }}
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center mt-2">
                <span class="text-primary fw-mono smaller">{{ coupon.code }}</span>
                <button 
                  v-if="coupon.status === 'unused'"
                  class="btn btn-sm btn-primary rounded-pill px-3"
                >
                  使用
                </button>
                <span v-else class="badge bg-secondary rounded-pill px-3 py-2">
                  {{ coupon.status === 'used' ? '已使用' : '已過期' }}
                </span>
              </div>
            </div>
          </div>
          <div class="coupon-divider"></div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <Icon icon="f7:ticket" width="64" height="64" class="text-light mb-3" />
        <p class="text-secondary">目前沒有優惠券</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.my-coupons {
  background-color: #f8f9fa;
  min-height: 100dvh;
  .nav-tabs-custom { border: 1px solid rgba(0,0,0,0.05); }
  .coupon-card {
    height: 140px;
    position: relative;
    transition: transform 0.2s ease;
    &:active { transform: scale(0.98); }
    .coupon-img-wrapper { width: 110px; flex-shrink: 0; }
    &.grayscale { filter: grayscale(1); }
  }
  .coupon-divider {
    position: absolute;
    left: 110px; top: 0; bottom: 0; width: 1px;
    border-left: 2px dashed #f8f9fa;
    &::before, &::after { content: ''; position: absolute; left: -6px; width: 10px; height: 10px; background: #f8f9fa; border-radius: 50%; }
    &::before { top: -5px; } &::after { bottom: -5px; }
  }
  .smaller { font-size: 0.75rem; }
  .fw-mono { font-family: monospace; letter-spacing: 1px; }
  .transition-all { transition: all 0.3s ease; }
}
</style>