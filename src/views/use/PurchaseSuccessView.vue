<script setup>
// 購買成功 — shared end of both paths. The gift path arrives here from GiftPreviewView
// (after sendGift persists the gift, passing its id); the self-purchase path arrives
// straight from checkout with the draft still in hand. Resolve whichever applies.
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useGiftsStore } from '@/stores/gifts.js'

const route = useRoute()
const router = useRouter()
const gifts = useGiftsStore()

const order = computed(() => {
  const byId = route.query.id ? gifts.getGiftById(route.query.id) : null
  return byId ?? gifts.draftGift ?? gifts.gifts[gifts.gifts.length - 1] ?? null
})
const isGift = computed(() => !!order.value?.isGift)
const total = computed(() => (order.value?.price || 0) * (order.value?.qty || 1))

function goHome() {
  router.push({ name: 'home' })
}
function viewReceived() {
  router.push({ name: 'use-gift-received', query: order.value?.id ? { id: order.value.id } : {} })
}
</script>

<template>
  <div class="success-view d-flex flex-column h-100">
    <div class="content flex-grow-1 overflow-auto d-flex flex-column align-items-center justify-content-center text-center px-5 py-5">
      <span class="success-badge rounded-circle d-flex align-items-center justify-content-center mb-5">
        <Icon icon="ph:check-light" width="48" height="48" class="text-white" />
      </span>

      <h1 class="h4 fw-bold text-body mb-2">{{ isGift ? '禮物已送出！' : '購買成功！' }}</h1>
      <p class="text-body-secondary mb-5">
        {{ isGift ? '對方會收到你的禮物與卡片' : '可在「我的禮物」中查看' }}
      </p>

      <div class="order-card bg-body-secondary rounded-4 p-5 w-100" style="max-width: 380px">
        <div class="d-flex align-items-center gap-3 text-start">
          <div class="item-thumb rounded-3 flex-shrink-0" :style="order?.img ? { background: order.img } : {}" />
          <div class="min-w-0 flex-grow-1">
            <div class="fw-bold text-body text-truncate">{{ order?.name || '—' }}</div>
            <div class="small text-body-secondary">數量 {{ order?.qty ?? 1 }}</div>
          </div>
          <div class="fw-bold text-primary flex-shrink-0">捷運點 {{ total }}</div>
        </div>
      </div>
    </div>

    <div class="footer border-top bg-body p-4">
      <div class="container d-flex flex-column gap-3" style="max-width: 380px">
        <button
          v-if="isGift"
          type="button"
          class="btn btn-primary rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
          @click="viewReceived"
        >
          <Icon icon="ph:eye-light" width="20" height="20" /> 預覽收禮畫面
        </button>
        <button
          type="button"
          class="btn rounded-pill py-3 fw-bold"
          :class="isGift ? 'btn-outline-secondary' : 'btn-primary'"
          @click="goHome"
        >
          回首頁
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.success-badge {
  width: 88px;
  height: 88px;
  background: var(--bs-success);
}
.item-thumb {
  width: 56px;
  height: 56px;
  background: #f2ede7;
}
.min-w-0 {
  min-width: 0;
}
.footer {
  position: sticky;
  bottom: 0;
}
</style>
