<script setup>
// 我的優惠券(/coupons)— 兌換總覽:優惠券與「我的禮物」合併列在同一頁,
// 讓使用者建立「可兌換的東西都在這一頁」的心智模型。
// 三個頁籤沿用原設計;可使用頁籤中禮物列在優惠券上方。
// 首頁摘要卡的「優惠券」點進來的就是這頁;工具列標題/返回由 AppLayout 依 route meta 顯示。
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { getCoupons } from '@/data/coupons.js'
import { useGiftStore } from '@/data/gifts.js'
import ContentCard from '@/components/cards/ContentCard.vue'
import StampBadge from '@/components/common/StampBadge.vue'
import PointsAmount from '@/components/points/PointsAmount.vue'

const coupons = ref(getCoupons())
const giftStore = useGiftStore()
const { availableNearGifts, availableOtherGifts, historyCoupons, historySentGifts } =
  storeToRefs(giftStore)

const activeTab = ref('available')
const tabs = [
  { id: 'available', label: '可使用' },
  { id: 'used', label: '已使用' },
  { id: 'expired', label: '已過期' }
]

const availableGifts = computed(() => [...availableNearGifts.value, ...availableOtherGifts.value])
// 已送出的禮物視同「已使用」;已過期單獨一籤
const usedGifts = computed(() => [
  ...historyCoupons.value.filter((g) => g.status === 'used'),
  ...historySentGifts.value
])
const expiredGifts = computed(() => historyCoupons.value.filter((g) => g.status === 'expired'))

const giftsForTab = computed(() => {
  if (activeTab.value === 'available') return availableGifts.value
  if (activeTab.value === 'used') return usedGifts.value
  return expiredGifts.value
})

const STAMP_TEXT = { used: '已使用', sent: '已送出', expired: '已過期' }
</script>

<template>
  <div class="coupons-view container-content pb-5">
    <!-- Tabs(工具列標題由 AppLayout 提供,不再自帶 header) -->
    <div class="tabs-container px-3 pt-7">
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

    <!-- 我的禮物(列在優惠券上方) -->
    <div v-if="giftsForTab.length > 0" class="p-3">
      <h2 class="h6 fw-bold text-body-secondary mb-3">我的禮物</h2>
      <ContentCard
        v-for="gift in giftsForTab"
        :key="gift.id"
        variant="row-horizontal"
        class="mb-3"
        :class="{ 'opacity-75': activeTab !== 'available' }"
        :to="{ name: 'profile-gifts-history' }"
        :img="gift.img"
        subtitle="禮物"
        :title="gift.title"
      >
        <template #detail>
          <div class="d-flex align-items-center text-secondary small">
            <Icon icon="ph:clock-light" class="me-1" width="18" height="18" />
            <span>使用期限 {{ gift.expiry }}</span>
          </div>
        </template>
        <template #trailing>
          <StampBadge v-if="STAMP_TEXT[gift.status]" :text="STAMP_TEXT[gift.status]" />
          <Icon v-else icon="ph:caret-right-light" class="text-secondary opacity-50" width="24" height="24" />
        </template>
      </ContentCard>
    </div>

    <!-- 優惠券 -->
    <div v-if="activeTab === 'available'" class="coupon-list p-3 pt-0">
      <h2 class="h6 fw-bold text-body-secondary mb-3">優惠券</h2>
      <ContentCard
        v-for="coupon in coupons"
        :key="coupon.id"
        variant="row-horizontal"
        class="mb-3"
        :img="coupon.img"
        :subtitle="coupon.sub"
        :color-key="coupon.colorKey"
        :title="coupon.title"
      >
        <template #detail>
          <div class="d-flex align-items-center text-secondary small">
            <PointsAmount :value="coupon.point" tone="muted" size="caption" />
            <span class="ms-1">兌換</span>
          </div>
        </template>
        <template #trailing>
          <Icon icon="ph:caret-right-light" class="text-secondary opacity-50" width="24" height="24" />
        </template>
      </ContentCard>
    </div>

    <!-- Empty State -->
    <div v-if="activeTab !== 'available' && giftsForTab.length === 0" class="text-center py-5 mt-5">
      <Icon icon="ph:ticket-light" width="64" height="64" class="text-secondary opacity-25 mb-3" />
      <p class="text-secondary">目前沒有紀錄</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.coupons-view {
  min-height: 100dvh;
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
</style>
