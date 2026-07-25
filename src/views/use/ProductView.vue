<script setup>
// 商品詳情 — follows the Figma frames (ProductView 2319-1809 / 3386-10081 / tablet 3384-9344):
// full-width product image, title + merchant row, 商品說明, and a sticky bottom bar that holds
// a collapsed "選擇數量" button. Tapping it expands a bottom sheet (over a dim overlay) with a
// quantity stepper, a 自己使用 / 送禮 toggle, and the purchase action.
// purchaseType decides the action: 'money' → 購買 (NT$ checkout); 'points' → 兌換.
// 自己使用 / 送禮 set the isGift flag, which later decides whether checkout routes through the
// card editor.
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { getProductById } from '@/data/catalog.js'
import { useGiftsStore } from '@/stores/gifts.js'
import { usePointsStore } from '@/stores/points.js'
import { useCardColors } from '@/utils/imageColor.js'
import PointsAmount from '@/components/points/PointsAmount.vue'

const route = useRoute()
const router = useRouter()
const gifts = useGiftsStore()

const product = computed(() => getProductById(route.query.id) ?? null)
const merchant = computed(() => product.value?.merchant ?? '')
const validDays = computed(() => product.value?.validDays ?? 0)
const isMoney = computed(() => product.value?.purchaseType === 'money')
const priceText = computed(() =>
  isMoney.value ? `NT$ ${product.value?.price ?? 0}` : `${product.value?.price ?? 0} 捷運點`,
)
const actionLabel = computed(() => (isMoney.value ? '購買' : '兌換'))

// image-derived card background (extends the product photo's own color rather than a
// generic fixed gradient) — same utility already used by gift/ProductFace.vue + QrFace.vue.
const productImg = computed(() => product.value?.img ?? '')
const { gradient } = useCardColors(productImg)

onMounted(() => {
  if (route.query.id && gifts.draftGift?.productId !== route.query.id) {
    gifts.startDraft(route.query.id)
  } else {
    gifts.ensureDraft()
  }
})

const sheetOpen = ref(false)
const giftMode = ref(false) // false → 自己使用; true → 送禮

const points = usePointsStore()

const qty = computed(() => gifts.draftGift?.qty ?? 1)

// 點數商品:數量上限就是餘額買得起的件數 — 讓「加不上去」取代事後的紅字警告。
const maxQty = computed(() => {
  const price = product.value?.price ?? 0
  if (isMoney.value || !price) return Infinity
  return Math.floor(points.balance / price)
})
// 連一件都買不起 → 主按鈕直接停用。
const insufficientPoints = computed(() => !isMoney.value && !!product.value && maxQty.value < 1)

function decrease() {
  gifts.updateDraft({ qty: Math.max(1, qty.value - 1) })
}
function increase() {
  if (qty.value >= maxQty.value) return
  gifts.updateDraft({ qty: qty.value + 1 })
}

function onPrimary() {
  if (insufficientPoints.value) return
  if (!sheetOpen.value) {
    sheetOpen.value = true
    return
  }
  gifts.updateDraft({ isGift: giftMode.value, qty: qty.value })
  router.push({ name: 'purchase-checkout' })
}
</script>

<template>
  <div class="product-view d-flex flex-column h-100 bg-body">
    <div class="content flex-grow-1 overflow-auto">
      <div class="pv-container container-form">
        <!-- product image -->
        <div class="pv-image-wrap">
          <div class="pv-image-card" :style="{ background: gradient }">
            <div class="pv-image" :style="product?.img ? { background: product.img } : {}" />
          </div>
        </div>

        <!-- title + merchant -->
        <div class="pv-info">
          <h1 class="h2 fw-bold mb-4">{{ product?.name || '查無此商品' }}</h1>
          <div v-if="merchant" class="pv-merchant">
            <span class="pv-merchant-logo">
              <Icon icon="ph:storefront-light" width="20" height="20" />
            </span>
            <span class="text-body-secondary">{{ merchant }}</span>
          </div>
        </div>

        <!-- 商品說明 -->
        <div class="pv-intro">
          <h2 class="h3 fw-bold mb-3">商品說明</h2>
          <p class="text-body-secondary mb-0">{{ product?.desc }}</p>
        </div>

        <!-- 有效期限 — 效期自購買日起算 -->
        <div v-if="validDays" class="pv-intro pt-0">
          <h2 class="h3 fw-bold mb-3">有效期限</h2>
          <p class="text-body-secondary mb-0">購買後 {{ validDays }} 天內使用</p>
        </div>
      </div>
    </div>

    <!-- dim backdrop while the sheet is expanded -->
    <Transition name="fade">
      <div v-if="sheetOpen" class="pv-overlay" @click="sheetOpen = false" />
    </Transition>

    <!-- sticky bottom bar / expandable sheet -->
    <div class="pv-bottom bg-body">
      <div class="pv-bottom-inner container-form">
        <!-- expanded sheet content -->
        <Transition name="sheet">
          <div v-if="sheetOpen" class="pv-sheet-wrap">
            <div class="pv-sheet">
              <div class="pv-qty-row">
                <span class="text-body">數量</span>
                <div class="pv-stepper">
                  <button
                    type="button"
                    class="pv-step-btn"
                    aria-label="減少數量"
                    :disabled="qty <= 1"
                    @click="decrease"
                  >
                    <Icon icon="ph:minus-light" width="20" height="20" />
                  </button>
                  <span class="pv-step-val fw-bold">{{ qty }}</span>
                  <button
                    type="button"
                    class="pv-step-btn pv-step-plus"
                    aria-label="增加數量"
                    :disabled="qty >= maxQty"
                    @click="increase"
                  >
                    <Icon icon="ph:plus-light" width="20" height="20" />
                  </button>
                </div>
              </div>

              <div class="pv-usage">
                <button
                  type="button"
                  class="pv-usage-tile"
                  :class="{ active: !giftMode }"
                  @click="giftMode = false"
                >
                  <Icon icon="ph:user-light" width="24" height="24" />
                  <span class="caption-2">自己使用</span>
                </button>
                <button
                  type="button"
                  class="pv-usage-tile"
                  :class="{ active: giftMode }"
                  @click="giftMode = true"
                >
                  <Icon icon="ph:gift-light" width="24" height="24" />
                  <span class="caption-2">送禮</span>
                </button>
              </div>
            </div>
          </div>
        </Transition>

        <!-- summary + primary action -->
        <div class="pv-action-row">
          <div class="pv-summary">
            <div class="text-body text-truncate">{{ product?.name }}</div>
            <div class="pv-summary-price text-warning fw-bold">
              <PointsAmount v-if="!isMoney" :value="product?.price ?? 0" tone="cost" />
              <span v-else>{{ priceText }}</span>
            </div>
            <div v-if="!isMoney" class="caption-1 mt-1 text-body-tertiary">
              目前擁有 {{ points.balance }} 捷運點
            </div>
          </div>
          <button
            type="button"
            class="btn btn-primary fw-bold w-100 flex-shrink-1"
            :disabled="!product || insufficientPoints"
            @click="onPrimary"
          >
            {{ sheetOpen ? actionLabel : '選擇數量' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pv-container {
  width: 100%;
}

/* product image — full-bleed on phone; background is bound inline to the
   image-derived gradient (see productImg/useCardColors in <script setup>) */
.pv-image {
  width: 100%;
  height: 262px;
  background-size: cover;
  background-position: center;
}

.pv-info {
  padding: 24px 16px;
}
.pv-merchant {
  display: flex;
  align-items: center;
  gap: .5rem;
}
.pv-merchant-logo {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--bs-secondary-bg);
  color: var(--bs-secondary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pv-intro {
  padding: 16px;
}

/* overlay */
.pv-overlay {
  position: fixed;
  inset: 0;
  background: var(--overlay);
  z-index: 1040;
}

/* bottom bar */
.pv-bottom {
  position: sticky;
  bottom: 0;
  border-top: 1px solid var(--bs-border-color);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.07);
  z-index: 1050;
}
.pv-bottom-inner {
  width: 100%;
}
.pv-sheet {
  overflow: hidden;
  min-height: 0;
  padding: 20px 16px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.pv-qty-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pv-stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}
.pv-step-btn {
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
.pv-step-btn:disabled {
  opacity: 0.5;
}
.pv-step-plus {
  color: var(--bs-primary);
}
.pv-step-val {
  min-width: 24px;
  text-align: center;
}

.pv-usage {
  display: flex;
  gap: 8px;
}
.pv-usage-tile {
  flex: 1;
  border: 1px solid var(--bs-border-color);
  border-radius: var(--bs-border-radius-lg);
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: var(--bs-body-bg);
  color: var(--bs-secondary-color);
}
.pv-usage-tile.active {
  border-color: var(--bs-primary);
  background: var(--bs-primary-bg-subtle);
  color: var(--bs-primary);
  font-weight: 700;
}

.pv-action-row {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 12px;
  align-items: end;
  padding: 16px;
}
.pv-summary {
  min-width: 0;
}
.pv-summary-price {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
}

/* bottom-sheet expand/collapse — animate real content height via grid-template-rows */
.pv-sheet-wrap {
  display: grid;
  grid-template-rows: 1fr;
}
.sheet-enter-active,
.sheet-leave-active {
  transition: grid-template-rows 0.3s ease, opacity 0.3s ease;
}
.sheet-enter-from,
.sheet-leave-to {
  grid-template-rows: 0fr;
  opacity: 0;
}

/* overlay fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* tablet / iPad — image in an image-color gradient card (.container-form caps the width) */
@media (min-width: 768px) {
  .pv-image-wrap {
    padding: 24px 16px 0;
  }
  .pv-image-card {
    border-radius: var(--bs-border-radius-sm);
    box-shadow: 0 6px 24px 2px rgba(0, 0, 0, 0.16);
    padding: 24px;
    display: flex;
    justify-content: center;
  }
  .pv-image {
    width: 310px;
    height: auto;
    aspect-ratio: 320 / 215;
    border-radius: var(--bs-border-radius-sm);
  }
  .pv-info {
    text-align: center;
  }
  .pv-merchant {
    justify-content: center;
  }
}
</style>
