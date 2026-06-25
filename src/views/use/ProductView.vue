<script setup>
// 商品詳情 — follows the source design (profile/GiftsView.vue): dark header with the product
// image, title + category row + points row, a quantity stepper, a description, and a footer
// price-summary with 送禮 / 兌換 buttons. Driven by the catalog product from ?id=.
// 送禮 / 兌換 only differ in the isGift flag, which later decides whether checkout routes
// through the card editor.
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { getProductById, getShelfByProductId } from '../../data/catalog.js'
import { useGiftsStore } from '../../stores/gifts.js'
import coinImg from '../../img/coin.png'

const route = useRoute()
const router = useRouter()
const gifts = useGiftsStore()

const product = computed(() => getProductById(route.query.id) ?? null)
const category = computed(() => getShelfByProductId(route.query.id)?.title ?? '')

onMounted(() => {
  if (route.query.id && gifts.draftGift?.productId !== route.query.id) {
    gifts.startDraft(route.query.id)
  } else {
    gifts.ensureDraft()
  }
})

const qty = computed(() => gifts.draftGift?.qty ?? 1)
function decrease() {
  gifts.updateDraft({ qty: Math.max(1, qty.value - 1) })
}
function increase() {
  gifts.updateDraft({ qty: qty.value + 1 })
}

function proceed(isGift) {
  gifts.updateDraft({ isGift })
  router.push({ name: 'purchase-checkout' })
}
</script>

<template>
  <div class="product-view d-flex flex-column h-100">
    <div class="content flex-grow-1 overflow-auto">
      <!-- dark header with the product image -->
      <div class="ticket-header-bg py-5 d-flex justify-content-center align-items-center">
        <div class="container max-width-container px-4 text-center">
          <div
            class="ticket-img rounded shadow-sm mx-auto d-flex align-items-end justify-content-end p-3"
            :style="product?.img ? { background: product.img } : {}"
          >
            <span class="ticket-size rounded-circle d-flex align-items-center justify-content-center fw-bold">
              {{ product?.sizeLabel || 'M' }}
            </span>
          </div>
        </div>
      </div>

      <div class="bg-body">
        <div class="container max-width-container py-5 px-4">
          <h1 class="fs-4 fw-bold text-body mb-3">{{ product?.name || '查無此商品' }}</h1>

          <div v-if="category" class="brand-row d-flex align-items-center gap-2 mb-3">
            <span class="brand-dot rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
              <Icon icon="ph:storefront-light" width="16" height="16" />
            </span>
            <span class="text-body-secondary small">{{ category }}</span>
          </div>

          <div class="points-row d-flex align-items-center gap-2 mb-4">
            <img :src="coinImg" alt="" width="24" height="24" />
            <span class="fs-4 fw-bold text-warning">{{ product?.price ?? 0 }}</span>
            <span class="small mt-1 text-body">捷運點</span>
          </div>

          <div class="quantity-section border-top border-bottom py-3 d-flex justify-content-between align-items-center my-4">
            <span class="fw-bold text-body">數量</span>
            <div class="d-flex align-items-center gap-2">
              <button
                type="button"
                class="btn btn-light btn-sm d-flex align-items-center justify-content-center btn-counter"
                :disabled="qty <= 1"
                @click="decrease"
              >
                <Icon icon="ph:minus-light" width="18" height="18" />
              </button>
              <span class="mx-3 fw-bold fs-5 text-body" style="min-width: 24px; text-align: center">{{ qty }}</span>
              <button
                type="button"
                class="btn btn-light text-info btn-sm d-flex align-items-center justify-content-center btn-counter"
                @click="increase"
              >
                <Icon icon="ph:plus-light" width="18" height="18" />
              </button>
            </div>
          </div>

          <div class="description-section mb-5">
            <h2 class="fs-6 fw-bold text-body mb-2">商品說明</h2>
            <p class="text-body small lh-base mb-0">{{ product?.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- footer: price-summary + 送禮 / 兌換 -->
    <div class="footer bg-body border-top p-3 shadow-sm">
      <div class="container max-width-container d-flex align-items-center justify-content-between gap-3">
        <div class="price-summary flex-shrink-0">
          <div class="small fw-bold text-body text-truncate" style="max-width: 140px">{{ product?.name }}</div>
          <div class="d-flex align-items-center gap-1 mt-1">
            <img :src="coinImg" alt="" width="16" height="16" />
            <span class="text-warning fw-bold small">{{ product?.price ?? 0 }} 捷運點</span>
          </div>
        </div>

        <div class="action-buttons d-flex gap-2 flex-grow-1 justify-content-end" style="max-width: 420px">
          <button
            type="button"
            class="btn flex-grow-1 fw-bold py-2 btn-gift d-flex align-items-center justify-content-center gap-1"
            :disabled="!product"
            @click="proceed(true)"
          >
            <Icon icon="ph:gift-light" width="18" height="18" /> 送禮
          </button>
          <button
            type="button"
            class="btn btn-info text-white flex-grow-1 fw-bold py-2 btn-exchange"
            :disabled="!product"
            @click="proceed(false)"
          >
            兌換
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.max-width-container {
  max-width: 720px;
}
.ticket-header-bg {
  background-color: #2e2c2b;
}
.ticket-img {
  width: 200px;
  height: 200px;
  background: #f2ede7;
  object-fit: contain;
}
.ticket-size {
  width: 32px;
  height: 32px;
  font-size: 14px;
  background: #ffd60a;
  color: #3a2e00;
}
.brand-dot {
  width: 24px;
  height: 24px;
  background: var(--bs-secondary-bg);
  color: var(--bs-secondary-color);
}
.btn-counter {
  width: 32px;
  height: 32px;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
}
.btn-counter:hover {
  background-color: #f3f4f6;
}
.btn-gift {
  background-color: #fdfbf7;
  border: 1px solid #f1ede4;
  color: #1e70a4;
}
.btn-gift:hover {
  background-color: #f5f1e6;
}
.btn-exchange {
  background-color: #007bbd;
  border: none;
}
.btn-exchange:hover {
  background-color: #00669e;
}
.footer {
  position: sticky;
  bottom: 0;
}
</style>
