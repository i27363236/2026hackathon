<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  title: { type: String, default: '' },
  expiry: { type: String, default: '' },
  value: { type: [String, Number], default: '' },
  unit: { type: String, default: '元' },
})
</script>

<template>
  <div class="coupon-card rounded-4 overflow-hidden w-100 h-100 d-flex flex-column">
    <!-- QR area -->
    <div class="qr-area bg-white d-flex align-items-center justify-content-center flex-grow-1 p-6">
      <div class="qr position-relative">
        <Icon icon="ph:qr-code" width="180" height="180" />
        <span class="qr-logo rounded-circle bg-warning d-flex align-items-center justify-content-center position-absolute top-50 start-50 translate-middle">
          <Icon icon="ph:coin-fill" class="text-white" width="22" height="22" />
        </span>
      </div>
    </div>

    <!-- info area -->
    <div class="info text-white d-flex align-items-center gap-4 p-5">
      <div class="stub bg-light text-dark rounded-3 text-center px-3 py-2 flex-shrink-0">
        <div class="small lh-1">不限金額</div>
        <div class="fw-bold lh-1 my-1"><span class="fs-4">{{ value }}</span>{{ unit }}</div>
        <div class="small lh-1">抵用券</div>
      </div>
      <div class="min-w-0">
        <p class="fw-bold mb-1 text-truncate">{{ title }}</p>
        <p class="small opacity-75 mb-0">{{ expiry }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.coupon-card {
  background: var(--bs-gray-800);
  aspect-ratio: 3 / 4;
}
.qr-area {
  border-bottom: 2px dashed var(--bs-gray-500);
}
.min-w-0 {
  min-width: 0;
}
.stub {
  border: 1px solid var(--bs-gray-300);
}
</style>
