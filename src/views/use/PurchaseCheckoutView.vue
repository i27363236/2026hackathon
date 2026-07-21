<script setup>
// 結帳 — two modes driven by the draft's purchaseType:
//  • money (Figma 2362-1849): NT$ subtotal, 捷運點 applied as an NT$ discount via a stepper,
//    payment + invoice cards, total in NT$.
//  • points: 純點數兌換 — 沒有金流,所以不顯示「捷運點折抵」與「發票資訊」。
// 送禮時(isGift)在這裡收「收禮人暱稱 / 想說的話」— 這是使用者決定要送誰的時間點,
// 比放在卡片預覽頁更早也更合理(預覽頁只負責看成品)。
// Both stamp the purchase via purchaseDraft(); isGift then decides the next step:
// gift → card editor; self → success.
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGiftsStore } from '@/stores/gifts.js'
import { usePointsStore } from '@/stores/points.js'
import CheckoutOptionGroup from '@/components/checkout/CheckoutOptionGroup.vue'
import CheckoutFooter from '@/components/checkout/CheckoutFooter.vue'
import CheckoutGiftFields from '@/components/checkout/CheckoutGiftFields.vue'
import PointsStepper from '@/components/checkout/PointsStepper.vue'
import coinImg from '@/img/coin.png'

const router = useRouter()
const gifts = useGiftsStore()
const points = usePointsStore()

const draft = computed(() => gifts.draftGift)
const subtotal = computed(() => gifts.draftTotal)
const isMoney = computed(() => draft.value?.purchaseType === 'money')

// 捷運點餘額來自單一來源 stores/points.js。1 點 = NT$1 discount。
const maxApplicable = computed(() => Math.min(points.balance, subtotal.value))

// money mode: how many 捷運點 to apply, adjustable via a stepper (defaults to full discount).
const pointsApplied = ref(Math.min(points.balance, gifts.draftTotal))

// 折抵只存在於金流結帳;純點數兌換直接付小計。
const discount = computed(() =>
  isMoney.value ? Math.min(pointsApplied.value, maxApplicable.value) : 0,
)
const total = computed(() => subtotal.value - discount.value)

// 送禮資訊 — 收禮人必填(訪談洞察:送禮不能沒有對象)。
const isGift = computed(() => !!draft.value?.isGift)
const recipientName = ref('')
const message = ref('')
const canConfirm = computed(
  () => !!draft.value && (!isGift.value || recipientName.value.trim().length > 0),
)

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
  if (!canConfirm.value) return
  // points 模式扣商品全額(小計);money 模式只扣折抵掉的點數 — 讓餘額真的隨消費變動。
  const spent = isMoney.value ? discount.value : subtotal.value
  if (spent > 0) points.spend(spent, `兌換 ${draft.value?.name ?? ''}`)
  if (isGift.value) {
    gifts.updateDraft({ recipient: recipientName.value.trim(), message: message.value.trim() })
  }
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
            <CheckoutOptionGroup v-model="paymentMethod" name="payment" :options="paymentOptions" />
          </section>

          <!-- 捷運點折抵 -->
          <section class="co-section">
            <h3 class="mb-3">捷運點折抵</h3>
            <div class="d-flex align-items-center gap-1 mb-3">
              <img :src="coinImg" alt="" width="20" height="20" />
              <span class="caption-1 text-body-secondary">您目前有 {{ points.balance }} 捷運點</span>
            </div>
            <div class="co-row align-items-center">
              <span class="text-body">數量</span>
              <PointsStepper v-model="pointsApplied" :max="maxApplicable" />
            </div>
          </section>

          <!-- 發票資訊 -->
          <section class="co-section">
            <h3 class="mb-4">發票資訊</h3>
            <CheckoutOptionGroup v-model="invoiceType" name="invoice" :options="invoiceOptions" />
          </section>

          <!-- 送禮資訊 -->
          <section v-if="isGift" class="co-section">
            <h3 class="mb-4">送禮資訊</h3>
            <CheckoutGiftFields v-model:recipient="recipientName" v-model:message="message" />
          </section>
        </div>
      </div>

      <CheckoutFooter
        label="總計"
        :value="`NT$ ${total}`"
        :confirm-label="confirmLabel"
        :disabled="!canConfirm"
        @confirm="confirm"
      />
    </template>

    <!-- ============================ points checkout ============================ -->
    <template v-else>
      <div class="content flex-grow-1 overflow-auto bg-body">
        <div class="one-col px-4 py-4 d-flex flex-column gap-3">
          <!-- line item -->
          <div class="bg-body p-5 d-flex align-items-center gap-3">
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
            <div class="d-flex justify-content-between fw-bold text-body pt-3 border-top">
              <span>總計</span>
              <span class="text-primary">捷運點 {{ total }}</span>
            </div>
            <div class="d-flex align-items-center gap-1 mt-4">
              <img :src="coinImg" alt="" width="20" height="20" />
              <span class="text-body small">您目前有 {{ points.balance }} 捷運點</span>
            </div>
          </div>

          <!-- 送禮資訊 -->
          <div v-if="isGift" class="bg-body p-5">
            <h3 class="mb-4">送禮資訊</h3>
            <CheckoutGiftFields v-model:recipient="recipientName" v-model:message="message" />
          </div>
          <div class="p-5">
            <button
              type="button"
              class="btn btn-primary fw-bold w-100"
              :disabled="!canConfirm"
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
  background: var(--surface-cream);
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
  background: var(--surface-cream);
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
.form-check-input:checked {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}
</style>
