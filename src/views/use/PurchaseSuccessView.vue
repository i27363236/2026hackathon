<script setup>
// 購買成功 — shared end of both paths. The gift path arrives here from GiftPreviewView
// (after sendGift persists the gift, passing its id); the self-purchase path arrives
// straight from checkout with the draft still in hand. Resolve whichever applies.
// 送禮成功時放緞帶動畫(canvas-confetti,動態載入所以不進主 bundle)。
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useGiftsStore } from '@/stores/gifts.js'
import coinImg from '@/img/coin.png'

const route = useRoute()
const router = useRouter()
const gifts = useGiftsStore()

const order = computed(() => {
  const byId = route.query.id ? gifts.getGiftById(route.query.id) : null
  return byId ?? gifts.draftGift ?? gifts.gifts[gifts.gifts.length - 1] ?? null
})
const isGift = computed(() => !!order.value?.isGift)
const isMoney = computed(() => order.value?.purchaseType === 'money')
const recipient = computed(() => order.value?.recipient || '對方')
const total = computed(() => (order.value?.price || 0) * (order.value?.qty || 1))
const totalText = computed(() => (isMoney.value ? `NT$ ${total.value}` : `捷運點 ${total.value}`))

// 兩側對噴的細長方片 — 旋轉下墜時看起來像 3D 翻飛的緞帶。
onMounted(async () => {
  if (!isGift.value) return
  const { default: confetti } = await import('canvas-confetti')
  const base = { particleCount: 60, spread: 55, startVelocity: 55, ticks: 220, scalar: 1.6, shapes: ['square'] }
  confetti({ ...base, angle: 60, origin: { x: 0, y: 0.7 } })
  confetti({ ...base, angle: 120, origin: { x: 1, y: 0.7 } })
})

function goHome() {
  router.push({ name: 'home' })
}
function viewReceived() {
  router.push({ name: 'use-gift-received', query: order.value?.id ? { id: order.value.id } : {} })
}
</script>

<template>
  <div class="success-view h-100 overflow-auto">
    <div class="content d-flex flex-column align-items-center justify-content-center text-center px-5 py-5">
      <span class="success-badge rounded-circle d-flex align-items-center justify-content-center mb-5">
        <Icon icon="ph:check-light" width="48" height="48" class="text-white" />
      </span>

      <h1 class="h4 fw-bold text-body mb-2">{{ isGift ? '禮物已送出！' : '購買成功！' }}</h1>
      <p class="text-body-secondary mb-5">
        <template v-if="isGift">
          <strong class="text-body">{{ recipient }}</strong> 已經收到你的禮物與卡片
        </template>
        <template v-else>可在「我的禮物」中查看</template>
      </p>

      <div class="order-card bg-body-secondary rounded-4 p-5 w-100" style="max-width: 380px">
        <div class="d-flex align-items-center gap-3 text-start">
          <div class="item-thumb rounded-3 flex-shrink-0" :style="order?.img ? { background: order.img } : {}" />
          <div class="min-w-0 flex-grow-1">
            <div class="fw-bold text-body text-truncate">{{ order?.name || '—' }}</div>
            <div class="small text-body-secondary">數量 {{ order?.qty ?? 1 }}</div>
          </div>
          <div
            class="d-flex align-items-center gap-1 flex-shrink-0"
            :class="isMoney ? 'text-body' : 'text-warning'"
          >
            <img v-if="!isMoney" :src="coinImg" alt="" width="19" height="20" />
            <span>{{ totalText }}</span>
          </div>
        </div>
      </div>

      <!-- Demo 說明:正式版送禮者看不到收禮畫面,這裡破例開一個入口方便展示 -->
      <div v-if="isGift" class="alert alert-info text-start mt-6 w-100" style="max-width: 380px">
        <p class="mb-3">正式版中，送禮者無法看到收禮人實際開啟的畫面。此為 Demo 版本，可在此預覽。</p>
        <button type="button" class="btn btn-outline-primary btn-sm rounded-pill" @click="viewReceived">
          預覽收禮頁面
        </button>
      </div>

      <button type="button" class="btn btn-link fw-bold mt-5" @click="goHome">回首頁</button>
    </div>
  </div>
</template>

<style scoped>
.content {
  min-height: 100%;
}
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
</style>
