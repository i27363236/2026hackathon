<script setup>
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="checkout-page bg-light min-vh-100 d-flex flex-column pb-5">
    <div class="bg-white border-bottom sticky-top py-3">
      <div
        class="container max-width-container px-3 d-flex align-items-center position-relative"
      >
        <a href="#" class="position-absolute start-0 ps-3 text-dark">
          <Icon icon="ph:caret-left-light" width="24" height="24" />
        </a>
        <h1 class="fs-5 fw-bold m-auto text-dark">確認購買</h1>
      </div>
    </div>

    <div class="container max-width-container py-4 px-3 flex-grow-1">
      <div
        class="bg-white rounded-3 p-5 shadow-sm d-flex align-items-center gap-3 mb-3"
      >
        <img
          src="../../img/誠品100元抵用券.png"
          alt="商品圖片"
          class="rounded border"
          style="width: 80px; height: 50px; object-fit: cover"
        />
        <div>
          <h2 class="fs-6 fw-bold text-dark mb-1">誠品生活 │ 100元優惠券</h2>
          <div class="text-dark small">NT$ 50 × 1 件</div>
        </div>
      </div>

      <div class="bg-white rounded-3 p-5 shadow-sm mb-3">
        <h3 class="fs-6 fw-bold text-dark mb-3">訂單明細</h3>

        <div class="d-flex justify-content-between small text-dark mb-2">
          <span>小計</span>
          <span class="text-dark">NT$ 100</span>
        </div>
        <div class="d-flex justify-content-between small text-dark mb-2">
          <span>數量</span>
          <span class="text-dark">1 件</span>
        </div>
        <div
          class="d-flex justify-content-between small text-dark pb-3 border-bottom"
        >
          <span>捷運點折抵</span>
          <span class="text-success">-NT$ 100</span>
        </div>

        <div class="d-flex justify-content-between fw-bold text-dark mt-3 fs-5">
          <span>總計</span>
          <span class="text-primary">NT$ 0</span>
        </div>
      </div>

      <div class="bg-white rounded-3 p-5 shadow-sm mb-3">
        <h3 class="fs-6 fw-bold text-dark mb-3">付款方式</h3>

        <div
          class="form-check d-flex align-items-start gap-2 py-2 border-bottom border-light"
        >
          <input
            class="form-check-input mt-1"
            type="radio"
            name="payment"
            id="creditCard"
            value="credit_card"
            v-model="paymentMethod"
          />
          <label class="form-check-label w-100" for="creditCard">
            <span class="d-block fw-bold text-dark small">信用卡</span>
            <span class="text-dark x-small">**** **** **** 1234</span>
          </label>
        </div>

        <div
          class="form-check d-flex align-items-center gap-2 py-3 border-bottom border-light"
        >
          <input
            class="form-check-input"
            type="radio"
            name="payment"
            id="applePay"
            value="apple_pay"
            v-model="paymentMethod"
          />
          <label
            class="form-check-label fw-bold text-dark small"
            for="applePay"
          >
            Apple Pay
          </label>
        </div>

        <div class="form-check d-flex align-items-center gap-2 py-3">
          <input
            class="form-check-input"
            type="radio"
            name="payment"
            id="linePay"
            value="line_pay"
            v-model="paymentMethod"
          />
          <label class="form-check-label fw-bold text-dark small" for="linePay">
            LINE Pay
          </label>
        </div>
      </div>

      <div class="bg-white rounded-3 p-5 shadow-sm mb-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h3 class="fs-6 fw-bold text-dark m-0">捷運點折抵</h3>
          <div class="form-check form-switch p-0 m-0">
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="pointsSwitch"
              v-model="usePoints"
              style="width: 2.5em; height: 1.25em; cursor: pointer"
            />
          </div>
        </div>

        <div class="d-flex align-items-center gap-1 my-2">
          <img src="../../img/coin.png" alt="">
          <span class="text-dark small">您目前有 115 捷運點</span>
        </div>

        <div class="d-flex justify-content-between x-small text-dark pt-2">
          <span>本次折抵 100 捷運點</span>
          <span class="text-success">-NT$ 100</span>
        </div>
      </div>

      <div class="bg-white rounded-3 p-5 shadow-sm mb-5">
        <h3 class="fs-6 fw-bold text-dark mb-3">發票資訊</h3>

        <div
          class="form-check d-flex align-items-start gap-2 py-2 border-bottom border-light"
        >
          <input
            class="form-check-input mt-1"
            type="radio"
            name="invoice"
            id="electronicInv"
            value="electronic"
            v-model="invoiceType"
          />
          <label class="form-check-label w-100" for="electronicInv">
            <span class="d-block fw-bold text-dark small">電子發票</span>
            <span class="text-dark x-small">會員載具</span>
          </label>
        </div>

        <div
          class="form-check d-flex align-items-center gap-2 py-3 border-bottom border-light"
        >
          <input
            class="form-check-input"
            type="radio"
            name="invoice"
            id="phoneInv"
            value="phone"
            v-model="invoiceType"
          />
          <label
            class="form-check-label fw-bold text-dark small"
            for="phoneInv"
          >
            手機條碼載具
          </label>
        </div>

        <div class="form-check d-flex align-items-center gap-2 py-3">
          <input
            class="form-check-input"
            type="radio"
            name="invoice"
            id="paperInv"
            value="paper"
            v-model="invoiceType"
          />
          <label
            class="form-check-label fw-bold text-dark small"
            for="paperInv"
          >
            紙本發票
          </label>
        </div>
      </div>

      <div class="fixed-bottom bg-white border-top p-3 shadow-sm">
        <div
          class="container max-width-container d-flex align-items-center justify-content-between gap-3"
        >
          <div class="price-summary">
            <div class="x-small text-dark fw-bold">應付金額</div>
            <div class="fs-4 fw-bold text-primary mt-1">NT$ 0</div>
          </div>

          <button
            class="btn btn-info text-white fw-bold py-2 px-4 btn-confirm"
            style="background-color: #007bbd; border: none; min-width: 140px"
          >
            確認購買
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* 限制卡片區塊在大螢幕（如 iPad）上的寬度與設計稿比例同步 */
.max-width-container {
  max-width: 720px;
}

/* 額外輔助的小字體 */
.x-small {
  font-size: 0.75rem;
}

/* 覆寫 Bootstrap 預設的藍色調以對齊設計稿的捷運藍/純黑風格 */
.text-primary {
  color: #007bbd !important;
}

/* 修正 Radio 勾選時的顏色 */
.form-check-input:checked {
  background-color: #007bbd;
  border-color: #007bbd;
}

/* 確保底部的固定欄不會擋到最後的發票選單內容 */
.checkout-page {
  padding-bottom: 100px !important;
}

.btn-confirm:hover {
  background-color: #00669e !important;
}
</style>
