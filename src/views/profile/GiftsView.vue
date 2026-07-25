<script setup>
import { ref } from 'vue'
import PointsAmount from '@/components/points/PointsAmount.vue'

const quantity = ref(1)
const decrease = () => { if (quantity.value > 1) quantity.value-- }
const increase = () => { quantity.value++ }
</script>

<template>
  
  <div class="ticket-header-bg py-4 d-flex justify-content-center align-items-center">
    <div class="container-content px-3 text-center">
      <img 
        src="../../img/誠品100元抵用券.png" 
        alt="誠品生活 100元抵用券" 
        class="img-fluid rounded shadow-sm ticket-img" 
      />
    </div>
  </div>

  <div class="bg-white flex-grow-1">
    <div class="container-content py-4 px-3">
      </div>
  </div>


  <div class="bg-white flex-grow">
    <div class="container-content py-4 px-3">
      <h2 class="fs-4 fw-bold text-dark mb-3">誠品生活 │ 100元優惠券</h2>

      <div class="brand-row d-flex align-items-center gap-2 mb-3">
        <img src="../../img/eslite.png" alt="" />
        <span class="text-dark small">誠品</span>
      </div>

      <div class="points-row mb-4">
        <PointsAmount :value="100" tone="cost" size="price" />
      </div>

      <div class="quantity-section border-top border-bottom py-3 d-flex justify-content-between align-items-center my-4">
        <span class="fw-bold text-dark">數量</span>
        <div class="d-flex align-items-center gap-2">
          <button
            @click="decrease"
            class="btn btn-light btn-sm d-flex align-items-center justify-content-center btn-counter"
          >
            -
          </button>
          <span class="mx-3 fw-bold fs-5 text-dark">{{ quantity }}</span>
          <button
            @click="increase"
            class="btn btn-light text-info btn-sm d-flex align-items-center justify-content-center btn-counter"
          >
            +
          </button>
        </div>
      </div>

      <div class="description-section mb-5">
        <h3 class="fs-6 fw-bold text-dark mb-2">商品說明</h3>
        <p class="text-dark small lh-base">
          扣點領券後，憑券於誠品生活指定門市消費不限金額即可折抵100元。
        </p>
      </div>
    </div>
  </div>

  <div class="bg-white border-top p-3 shadow-sm">
    <div class="container-content d-flex align-items-center justify-content-between gap-3">
      <div class="price-summary flex-shrink-0">
        <div class="small fw-bold text-dark">誠品生活 │ 100元優惠券</div>
        <div class="mt-1">
          <PointsAmount :value="10" tone="cost" size="caption" />
        </div>
      </div>

      <div
        class="action-buttons d-flex gap-2 flex-grow-1 justify-content-end"
        style="max-width: 420px"
      >
        <button
          class="btn btn-outline-primary flex-grow-1 fw-bold py-2"
        >
          送禮
        </button>
        <button
          class="btn btn-primary flex-grow-1 fw-bold py-2"
        >
          兌換
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 上半部票券圖底色 — 刻意的深灰黑,還原票券背後底色,非設計 token */
.ticket-header-bg {
  /* stylelint-disable-next-line scale-unlimited/declaration-strict-value */
  background-color: #2e2c2b;
}

/* 票券圖片寬度限制，避免太大 */
.ticket-img {
  max-height: 240px;
  object-fit: contain;
}

/* 圖片與圖標尺寸控制 */
.brand-logo {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.icon-m {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.icon-m-small {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

/* 數量加減按鈕樣式 */
.btn-counter {
  width: 32px;
  height: 32px;
  border: 1px solid var(--bs-border-color);
  background-color: var(--bs-gray-100);
  font-weight: bold;
}
.btn-counter:hover {
  background-color: var(--bs-gray-200);
}

/* 確保底部的 Fixed 欄位不會擋住內容 */
.exchange-detail-page {
  padding-bottom: 100px;
}
</style>
