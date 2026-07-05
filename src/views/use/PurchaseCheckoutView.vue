<script setup>
// 結帳 — two modes driven by the draft's purchaseType:
//  • money (Figma 2362-1849): NT$ subtotal, 捷運點 applied as an NT$ discount via a stepper,
//    payment + invoice cards, total in NT$.
//  • points: the original points-based layout (小計 / 折抵 / 總計 in 捷運點).
// Both stamp the purchase via purchaseDraft(); isGift then decides the next step:
// gift → card editor; self → success.
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useGiftsStore } from '@/stores/gifts.js'
import coinImg from '@/img/coin.png'

const router = useRouter()
const gifts = useGiftsStore()

const draft = computed(() => gifts.draftGift)
const subtotal = computed(() => gifts.draftTotal)
const isMoney = computed(() => draft.value?.purchaseType === 'money')

// 捷運點 balance — illustrative, like the source mockup. 1 點 = NT$1 discount.
const POINTS_BALANCE = 115
const maxApplicable = computed(() => Math.min(POINTS_BALANCE, subtotal.value))

// money mode: how many 捷運點 to apply, adjustable via a stepper (defaults to full discount).
const pointsApplied = ref(Math.min(POINTS_BALANCE, gifts.draftTotal))
function decPoints() {
  pointsApplied.value = Math.max(0, pointsApplied.value - 1)
}
function incPoints() {
  pointsApplied.value = Math.min(maxApplicable.value, pointsApplied.value + 1)
}

// points mode: simple on/off toggle for the discount.
const usePoints = ref(true)

const discount = computed(() =>
  isMoney.value
    ? Math.min(pointsApplied.value, maxApplicable.value)
    : usePoints.value
      ? maxApplicable.value
      : 0,
)
const total = computed(() => subtotal.value - discount.value)

const paymentMethod = ref('credit_card')
const invoiceType = ref('electronic')

const paymentOptions = [
  { id: 'credit_card', label: '信用卡', sub: '1996 **** **** 2026', change: true },
  { id: 'apple_pay', label: 'Apple Pay', sub: '' },
  { id: 'line_pay', label: 'LINE Pay', sub: '' },
]
const invoiceOptions = [
  { id: 'electronic', label: '電子發票', sub: '/1LMETRO', change: true },
  { id: 'phone', label: '手機條碼載具', sub: '' },
  { id: 'paper', label: '紙本發票', sub: '' },
]

const confirmLabel = computed(() => {
  if (draft.value?.isGift) return '結帳並包裝'
  return isMoney.value ? '購買' : '確認兌換'
})

function confirm() {
  gifts.purchaseDraft()
  router.push({ name: draft.value?.isGift ? 'use-gift-setup' : 'purchase-success' })
}
</script>

<template>
  <div class="checkout-view d-flex flex-column h-100 bg-body">
    <!-- ============================ money checkout ============================ -->
    <template v-if="isMoney">
      <div class="content flex-grow-1 overflow-auto bg-body">
        <div class="one-col">
          <!-- product -->
          <section class="co-section d-flex align-items-center gap-3">
            <div class="co-thumb flex-shrink-0" :style="draft?.img ? { background: draft.img } : {}" />
            <h2 class="m-0 text-truncate">{{ draft?.name || '—' }}</h2>
          </section>

          <!-- 訂單明細 -->
          <section class="co-section">
            <h3 class="mb-4">訂單明細</h3>
            <div class="co-row">
              <span class="text-body-secondary">小計</span>
              <span class="text-body">NT$ {{ subtotal }}</span>
            </div>
            <div class="co-row">
              <span class="text-body-secondary">數量</span>
              <span class="text-body">{{ draft?.qty ?? 1 }}</span>
            </div>
            <div class="co-row">
              <span class="text-body-secondary">捷運點折抵</span>
              <span class="text-success">−NT$ {{ discount }}</span>
            </div>
            <div class="co-divider" />
            <div class="co-row fw-bold">
              <span class="text-body">總計</span>
              <span class="text-primary">NT$ {{ total }}</span>
            </div>
          </section>

          <!-- 付款方式 -->
          <section class="co-section">
            <h3 class="mb-4">付款方式</h3>
            <div v-for="opt in paymentOptions" :key="opt.id" class="co-option">
              <input
                class="form-check-input mt-1"
                type="radio"
                name="payment"
                :id="`pay-${opt.id}`"
                :value="opt.id"
                v-model="paymentMethod"
              />
              <label class="co-option-label" :for="`pay-${opt.id}`">
                <span class="d-block text-body">{{ opt.label }}</span>
                <span v-if="opt.sub" class="caption-1 text-body-secondary">{{ opt.sub }}</span>
              </label>
              <button
                v-if="opt.change"
                type="button"
                class="btn btn-link p-0 fw-bold text-decoration-none text-nowrap text-body-secondary"
              >
                更改
              </button>
            </div>
          </section>

          <!-- 捷運點折抵 -->
          <section class="co-section">
            <h3 class="mb-3">捷運點折抵</h3>
            <div class="d-flex align-items-center gap-1 mb-3">
              <img :src="coinImg" alt="" width="20" height="20" />
              <span class="caption-1 text-body-secondary">您目前有 {{ POINTS_BALANCE }} 捷運點</span>
            </div>
            <div class="co-row align-items-center">
              <span class="text-body">數量</span>
              <div class="co-stepper">
                <button type="button" class="co-step-btn" :disabled="discount <= 0" @click="decPoints">
                  <Icon icon="ph:minus-light" width="20" height="20" />
                </button>
                <span class="co-step-val fw-bold">{{ discount }}</span>
                <button
                  type="button"
                  class="co-step-btn co-step-plus"
                  :disabled="discount >= maxApplicable"
                  @click="incPoints"
                >
                  <Icon icon="ph:plus-light" width="20" height="20" />
                </button>
              </div>
            </div>
          </section>

          <!-- 發票資訊 -->
          <section class="co-section">
            <h3 class="mb-4">發票資訊</h3>
            <div v-for="opt in invoiceOptions" :key="opt.id" class="co-option">
              <input
                class="form-check-input mt-1"
                type="radio"
                name="invoice"
                :id="`inv-${opt.id}`"
                :value="opt.id"
                v-model="invoiceType"
              />
              <label class="co-option-label" :for="`inv-${opt.id}`">
                <span class="d-block text-body">{{ opt.label }}</span>
                <span v-if="opt.sub" class="caption-1 text-body-secondary">{{ opt.sub }}</span>
              </label>
              <button
                v-if="opt.change"
                type="button"
                class="btn btn-link p-0 fw-bold text-decoration-none text-nowrap text-body-secondary"
              >
                更改
              </button>
            </div>
          </section>
        </div>
      </div>

      <div class="footer bg-body border-top">
        <div class="one-col">
          <div class="co-action-row">
            <div class="co-summary">
              <div class="caption-1 text-body fw-bold">總計</div>
              <div class="fs-4 fw-bold text-primary mt-1">NT$ {{ total }}</div>
            </div>
            <button
              type="button"
              class="btn btn-primary fw-bold"
              :disabled="!draft"
              @click="confirm"
            >
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- ============================ points checkout ============================ -->
    <template v-else>
      <div class="content flex-grow-1 overflow-auto bg-body">
        <div class="one-col px-4 py-4 d-flex flex-column gap-3">
          <!-- line item -->
          <div class="bg-body p-4 d-flex align-items-center gap-3">
            <div class="item-thumb flex-shrink-0" :style="draft?.img ? { background: draft.img } : {}" />
            <div class="min-w-0">
              <h2 class="m-0 text-truncate">{{ draft?.name || '—' }}</h2>
              <div class="small text-body-secondary">捷運點 {{ draft?.price ?? 0 }} × {{ draft?.qty ?? 1 }} 件</div>
            </div>
          </div>

          <!-- 訂單明細 -->
          <div class="bg-body p-5">
            <h3 class="mb-4">訂單明細</h3>
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

          <!-- 捷運點折抵 -->
          <div class="bg-body p-5">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h3 class="m-0">捷運點折抵</h3>
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
            <div v-if="usePoints" class="d-flex justify-content-between text-body pt-2 caption-1">
              <span>本次折抵 {{ discount }} 捷運點</span>
              <span class="text-success">-捷運點 {{ discount }}</span>
            </div>
          </div>

          <!-- 發票資訊 -->
          <div class="bg-body p-5">
            <h3 class="mb-4">發票資訊</h3>
            <div
              v-for="opt in invoiceOptions"
              :key="opt.id"
              class="form-check d-flex align-items-start gap-2 py-2 border-bottom border-light-subtle"
            >
              <input class="form-check-input mt-1" type="radio" name="invoice-pt" :id="`pt-${opt.id}`" :value="opt.id" v-model="invoiceType" />
              <label class="form-check-label w-100" :for="`pt-${opt.id}`">
                <span class="d-block fw-bold text-body small">{{ opt.label }}</span>
                <span v-if="opt.sub" class="caption-1 text-body-secondary">{{ opt.sub }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- footer -->
      <div class="footer bg-body border-top">
        <div class="one-col">
          <div class="co-action-row">
            <div class="co-summary">
              <div class="caption-1 text-body fw-bold">應付金額</div>
              <div class="fs-4 fw-bold text-primary mt-1">捷運點 {{ total }}</div>
            </div>
            <button
              type="button"
              class="btn btn-primary fw-bold"
              :disabled="!draft"
              @click="confirm"
            >
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* one-column width: full-bleed on phone, capped + centred on tablet (≥md) */
.one-col {
  width: 100%;
}
@media (min-width: 768px) {
  .one-col {
    max-width: 630px;
    margin-inline: auto;
  }
}
.min-w-0 {
  min-width: 0;
}
.item-thumb {
  width: 80px;
  height: 50px;
  background: #f2ede7;
}
.footer {
  position: sticky;
  bottom: 0;
}
.co-action-row {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 12px;
  align-items: center;
  padding: 12px 16px;
}
.co-summary {
  min-width: 0;
}

/* ---- money checkout ---- */
.co-section {
  padding: 20px 16px;
}
.co-section:first-child {
  padding-top: 16px;
}
.co-thumb {
  width: 66px;
  height: 44px;
  border-radius: 4px;
  background: #f2ede7;
}
.co-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.co-row:last-child {
  margin-bottom: 0;
}
.co-divider {
  height: 1px;
  background: var(--bs-border-color);
  margin: 4px 0 12px;
}
.co-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}
.co-option:last-child {
  margin-bottom: 0;
}
.co-option-label {
  flex: 1;
  min-width: 0;
  cursor: pointer;
}
.co-stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}
.co-step-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--bs-border-color);
  background: var(--bs-secondary-bg);
  color: var(--bs-secondary-color);
  display: flex;
  align-items: center;
  justify-content: center;
}
.co-step-btn:disabled {
  opacity: 0.5;
}
.co-step-plus {
  color: var(--bs-primary);
}
.co-step-val {
  min-width: 32px;
  text-align: center;
}
.form-check-input:checked {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}
</style>
