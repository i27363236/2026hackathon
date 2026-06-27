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
import { getProductById, getShelfByProductId } from '../../data/catalog.js'
import { useGiftsStore } from '../../stores/gifts.js'
import coinImg from '../../img/coin.png'

const route = useRoute()
const router = useRouter()
const gifts = useGiftsStore()

const product = computed(() => getProductById(route.query.id) ?? null)
const merchant = computed(() => getShelfByProductId(route.query.id)?.title ?? '')
const isMoney = computed(() => product.value?.purchaseType === 'money')
const priceText = computed(() =>
  isMoney.value ? `NT$ ${product.value?.price ?? 0}` : `${product.value?.price ?? 0} 捷運點`,
)
const actionLabel = computed(() => (isMoney.value ? '購買' : '兌換'))

onMounted(() => {
  if (route.query.id && gifts.draftGift?.productId !== route.query.id) {
    gifts.startDraft(route.query.id)
  } else {
    gifts.ensureDraft()
  }
})

const sheetOpen = ref(false)
const giftMode = ref(false) // false → 自己使用; true → 送禮

const qty = computed(() => gifts.draftGift?.qty ?? 1)
function decrease() {
  gifts.updateDraft({ qty: Math.max(1, qty.value - 1) })
}
function increase() {
  gifts.updateDraft({ qty: qty.value + 1 })
}

function onPrimary() {
  if (!sheetOpen.value) {
    sheetOpen.value = true
    return
  }
  gifts.updateDraft({ isGift: giftMode.value, qty: qty.value })
  router.push({ name: 'purchase-checkout' })
}
</script>

<template>
  <div class="product-view d-flex flex-column h-100">
    <div class="content flex-grow-1 overflow-auto">
      <div class="pv-container">
        <!-- product image -->
        <div class="pv-image-wrap">
          <div class="pv-image-card">
            <div class="pv-image" :style="product?.img ? { background: product.img } : {}" />
          </div>
        </div>

        <!-- title + merchant -->
        <div class="pv-info">
          <h1 class="pv-title">{{ product?.name || '查無此商品' }}</h1>
          <div v-if="merchant" class="pv-merchant">
            <span class="pv-merchant-logo">
              <Icon icon="ph:storefront-light" width="20" height="20" />
            </span>
            <span class="text-body-secondary">{{ merchant }}</span>
          </div>
        </div>

        <!-- 商品說明 -->
        <div class="pv-intro">
          <h2 class="pv-section-title">商品說明</h2>
          <p class="pv-desc">{{ product?.desc }}</p>
        </div>
      </div>
    </div>

    <!-- dim backdrop while the sheet is expanded -->
    <div v-if="sheetOpen" class="pv-overlay" @click="sheetOpen = false" />

    <!-- sticky bottom bar / expandable sheet -->
    <div class="pv-bottom bg-body">
      <div class="pv-bottom-inner">
        <!-- expanded sheet content -->
        <div v-if="sheetOpen" class="pv-sheet">
          <div class="pv-qty-row">
            <span class="text-body">數量</span>
            <div class="pv-stepper">
              <button type="button" class="pv-step-btn" :disabled="qty <= 1" @click="decrease">
                <Icon icon="ph:minus-light" width="20" height="20" />
              </button>
              <span class="pv-step-val">{{ qty }}</span>
              <button type="button" class="pv-step-btn pv-step-plus" @click="increase">
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
              <span class="pv-usage-label">自己使用</span>
            </button>
            <button
              type="button"
              class="pv-usage-tile"
              :class="{ active: giftMode }"
              @click="giftMode = true"
            >
              <Icon icon="ph:gift-light" width="24" height="24" />
              <span class="pv-usage-label">送禮</span>
            </button>
          </div>
        </div>

        <!-- summary + primary action -->
        <div class="pv-action-row">
          <div class="pv-summary">
            <div class="pv-summary-name text-truncate">{{ product?.name }}</div>
            <div class="pv-summary-price">
              <img v-if="!isMoney" :src="coinImg" alt="" width="19" height="20" />
              <span>{{ priceText }}</span>
            </div>
          </div>
          <button
            type="button"
            class="btn btn-primary fw-bold pv-action-btn"
            :disabled="!product"
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

/* product image — full-bleed on phone */
.pv-image-card {
  background: var(--bs-secondary-bg);
}
.pv-image {
  width: 100%;
  height: 262px;
  background-size: cover;
  background-position: center;
}

.pv-info {
  padding: 24px 16px;
}
.pv-title {
  font-size: 28px;
  font-weight: 700;
  line-height: 34px;
  letter-spacing: -0.4px;
  color: var(--bs-body-color);
  margin: 0 0 12px;
}
.pv-merchant {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 17px;
}
.pv-merchant-logo {
  width: 32px;
  height: 32px;
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
.pv-section-title {
  font-size: 22px;
  font-weight: 700;
  line-height: 28px;
  color: var(--bs-body-color);
  margin: 0 0 8px;
}
.pv-desc {
  font-size: 17px;
  line-height: 22px;
  color: var(--bs-secondary-color);
  margin: 0;
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
  padding: 20px 16px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.pv-qty-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 17px;
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
  font-weight: 700;
  font-size: 17px;
  color: var(--bs-body-color);
}

.pv-usage {
  display: flex;
  gap: 8px;
}
.pv-usage-tile {
  flex: 1;
  border: 1px solid var(--bs-border-color);
  border-radius: 12px;
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
.pv-usage-label {
  font-size: 11px;
  line-height: 13px;
}

.pv-action-row {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 12px;
  align-items: center;
  padding: 12px 16px;
}
.pv-summary {
  min-width: 0;
}
.pv-summary-name {
  font-size: 12px;
  line-height: 16px;
  color: var(--bs-body-color);
}
.pv-summary-price {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
  font-size: 17px;
  font-weight: 700;
  color: var(--bs-warning);
}
.pv-action-btn {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* tablet / iPad — centered column, image in a dark gradient card */
@media (min-width: 768px) {
  .pv-container {
    max-width: 640px;
    margin: 0 auto;
  }
  .pv-image-wrap {
    padding: 24px 16px 0;
  }
  .pv-image-card {
    background: linear-gradient(180deg, #1d1b1b 0%, #4b4544 100%);
    border-radius: 4px;
    box-shadow: 0 6px 24px 2px rgba(0, 0, 0, 0.16);
    padding: 24px;
    display: flex;
    justify-content: center;
  }
  .pv-image {
    width: 310px;
    height: auto;
    aspect-ratio: 320 / 215;
    border-radius: 4px;
  }
  .pv-info {
    text-align: center;
  }
  .pv-merchant {
    justify-content: center;
  }
  .pv-bottom-inner {
    max-width: 640px;
    margin: 0 auto;
  }
}
</style>
