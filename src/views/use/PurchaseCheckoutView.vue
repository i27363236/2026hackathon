<script setup>
// 結帳 — follows the source design (profile/GiftsAvailableView.vue): line-item card,
// 訂單明細, 付款方式, 捷運點折抵, and 發票資訊 cards, plus a footer with 應付金額 + 確認購買.
// Driven by the in-progress draft (product × qty). purchaseDraft() stamps the purchase;
// isGift then decides the next step: gift → card editor; self → success.
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useGiftsStore } from '../../stores/gifts.js'
import coinImg from '../../img/coin.png'

const router = useRouter()
const gifts = useGiftsStore()

const draft = computed(() => gifts.draftGift)
const subtotal = computed(() => gifts.draftTotal)

// 捷運點折抵 — illustrative balance, like the source mockup.
const POINTS_BALANCE = 115
const usePoints = ref(true)
const discount = computed(() => (usePoints.value ? Math.min(POINTS_BALANCE, subtotal.value) : 0))
const total = computed(() => subtotal.value - discount.value)

const paymentMethod = ref('credit_card')
const invoiceType = ref('electronic')

const paymentOptions = [
  { id: 'credit_card', label: '信用卡', sub: '**** **** **** 1234' },
  { id: 'apple_pay', label: 'Apple Pay', sub: '' },
  { id: 'line_pay', label: 'LINE Pay', sub: '' },
]
const invoiceOptions = [
  { id: 'electronic', label: '電子發票', sub: '會員載具' },
  { id: 'phone', label: '手機條碼載具', sub: '' },
  { id: 'paper', label: '紙本發票', sub: '' },
]

function confirm() {
  gifts.purchaseDraft()
  router.push({ name: draft.value?.isGift ? 'use-gift-setup' : 'purchase-success' })
}
</script>

<template>
  <div class="checkout-view d-flex flex-column h-100">
    <div class="content flex-grow-1 overflow-auto bg-body-secondary">
      <div class="container max-width-container px-4 py-4 d-flex flex-column gap-3" style="max-width: 720px">
        <!-- line item -->
        <div class="bg-body rounded-3 p-4 shadow-sm d-flex align-items-center gap-3">
          <div class="item-thumb rounded flex-shrink-0" :style="draft?.img ? { background: draft.img } : {}" />
          <div class="min-w-0">
            <h2 class="fs-6 fw-bold text-body mb-1 text-truncate">{{ draft?.name || '—' }}</h2>
            <div class="small text-body-secondary">捷運點 {{ draft?.price ?? 0 }} × {{ draft?.qty ?? 1 }} 件</div>
          </div>
        </div>

        <!-- 訂單明細 -->
        <div class="bg-body rounded-3 p-5 shadow-sm">
          <h3 class="fs-6 fw-bold text-body mb-3">訂單明細</h3>
          <div class="d-flex justify-content-between small text-body mb-2">
            <span>小計</span>
            <span>捷運點 {{ subtotal }}</span>
          </div>
          <div class="d-flex justify-content-between small text-body mb-2">
            <span>數量</span>
            <span>{{ draft?.qty ?? 1 }} 件</span>
          </div>
          <div class="d-flex justify-content-between small text-body pb-3 border-bottom">
            <span>捷運點折抵</span>
            <span class="text-success">-捷運點 {{ discount }}</span>
          </div>
          <div class="d-flex justify-content-between fw-bold text-body mt-3 fs-5">
            <span>總計</span>
            <span class="text-primary">捷運點 {{ total }}</span>
          </div>
        </div>

        <!-- 付款方式 -->
        <div class="bg-body rounded-3 p-5 shadow-sm">
          <h3 class="fs-6 fw-bold text-body mb-3">付款方式</h3>
          <div
            v-for="opt in paymentOptions"
            :key="opt.id"
            class="form-check d-flex align-items-start gap-2 py-2 border-bottom border-light-subtle"
          >
            <input class="form-check-input mt-1" type="radio" name="payment" :id="opt.id" :value="opt.id" v-model="paymentMethod" />
            <label class="form-check-label w-100" :for="opt.id">
              <span class="d-block fw-bold text-body small">{{ opt.label }}</span>
              <span v-if="opt.sub" class="text-body-secondary" style="font-size: 12px">{{ opt.sub }}</span>
            </label>
          </div>
        </div>

        <!-- 捷運點折抵 -->
        <div class="bg-body rounded-3 p-5 shadow-sm">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h3 class="fs-6 fw-bold text-body m-0">捷運點折抵</h3>
            <div class="form-check form-switch p-0 m-0">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                v-model="usePoints"
                style="width: 2.5em; height: 1.25em; cursor: pointer"
              />
            </div>
          </div>
          <div class="d-flex align-items-center gap-1 my-2">
            <img :src="coinImg" alt="" width="20" height="20" />
            <span class="text-body small">您目前有 {{ POINTS_BALANCE }} 捷運點</span>
          </div>
          <div v-if="usePoints" class="d-flex justify-content-between text-body pt-2" style="font-size: 12px">
            <span>本次折抵 {{ discount }} 捷運點</span>
            <span class="text-success">-捷運點 {{ discount }}</span>
          </div>
        </div>

        <!-- 發票資訊 -->
        <div class="bg-body rounded-3 p-5 shadow-sm">
          <h3 class="fs-6 fw-bold text-body mb-3">發票資訊</h3>
          <div
            v-for="opt in invoiceOptions"
            :key="opt.id"
            class="form-check d-flex align-items-start gap-2 py-2 border-bottom border-light-subtle"
          >
            <input class="form-check-input mt-1" type="radio" name="invoice" :id="opt.id" :value="opt.id" v-model="invoiceType" />
            <label class="form-check-label w-100" :for="opt.id">
              <span class="d-block fw-bold text-body small">{{ opt.label }}</span>
              <span v-if="opt.sub" class="text-body-secondary" style="font-size: 12px">{{ opt.sub }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- footer -->
    <div class="footer bg-body border-top p-3 shadow-sm">
      <div class="container max-width-container d-flex align-items-center justify-content-between gap-3" style="max-width: 720px">
        <div class="price-summary">
          <div class="text-body fw-bold" style="font-size: 12px">應付金額</div>
          <div class="fs-4 fw-bold text-primary mt-1">捷運點 {{ total }}</div>
        </div>
        <button
          type="button"
          class="btn btn-info text-white fw-bold py-2 px-4 rounded-2 d-flex align-items-center justify-content-center gap-2"
          style="min-width: 140px"
          :disabled="!draft"
          @click="confirm"
        >
          <Icon :icon="draft?.isGift ? 'ph:gift-light' : 'ph:check-light'" width="18" height="18" />
          {{ draft?.isGift ? '結帳並包裝' : '確認購買' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.max-width-container {
  max-width: 720px;
}
.item-thumb {
  width: 80px;
  height: 50px;
  background: #f2ede7;
}
.min-w-0 {
  min-width: 0;
}
.form-check-input:checked {
  background-color: #007bbd;
  border-color: #007bbd;
}
.text-primary {
  color: #007bbd !important;
}
.btn-info {
  background-color: #007bbd;
  border: none;
}
.btn-info:hover {
  background-color: #00669e !important;
}
.footer {
  position: sticky;
  bottom: 0;
}
</style>
