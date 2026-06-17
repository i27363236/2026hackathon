<script setup>
// Gift coupon face — QR code (Figma node 2415-2352).
// Big white QR area + a coupon stub and title/expiry below.
// Shares the image-derived lighter gradient background with ProductFace.
import { computed, toRef } from 'vue'
import { useCardColors } from '../../utils/imageColor.js'
import qrCodeImg from '../../img/qr-code-example.png'

const props = defineProps({
  name: { type: String, default: '' },
  price: { type: [String, Number], default: '' },
  unit: { type: String, default: '元' },
  img: { type: String, default: '' },
  expiredDate: { type: String, default: '' }, // ISO string
})

const { gradient, textColor } = useCardColors(toRef(props, 'img'))

const expiry = computed(() => {
  if (!props.expiredDate) return ''
  const d = new Date(props.expiredDate)
  const date = `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
  const months = Math.max(1, Math.round((d.getTime() - Date.now()) / (30 * 86400000)))
  return `${months} 個月 · ${date}到期`
})
</script>

<template>
  <div
    class="qr-face rounded-1 overflow-hidden w-100 h-100 d-flex flex-column p-5"
    :style="{ background: gradient, color: textColor }"
  >
    <!-- QR code -->
    <div class="qr-area bg-white rounded-3 d-flex align-items-center justify-content-center flex-grow-1">
      <img :src="qrCodeImg" alt="QR Code" class="qr-img" />
    </div>

    <!-- coupon stub + info -->
    <div class="d-flex align-items-center gap-4 pt-4">
      <div class="stub bg-white text-dark rounded-3 text-center px-3 py-2 flex-shrink-0">
        <div class="stub-small lh-1">不限金額</div>
        <div class="fw-bold lh-1 my-1"><span class="stub-value">{{ price }}</span>{{ unit }}</div>
        <div class="stub-small lh-1">抵用券</div>
      </div>
      <div class="min-w-0">
        <p class="qr-title fw-bold mb-1 text-truncate">{{ name }}</p>
        <p class="qr-expiry mb-0 opacity-75">{{ expiry }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qr-face {
  aspect-ratio: 2 / 3;
}
.qr-area {
  min-height: 0;
}
.qr-img {
  width: 80%;
  height: auto;
  object-fit: contain;
}
.min-w-0 {
  min-width: 0;
}
.stub {
  border: 1px solid var(--bs-gray-300);
}
.stub-small {
  font-size: 11px;
}
.stub-value {
  font-size: 20px;
}
.qr-title {
  font-size: 15px;
}
.qr-expiry {
  font-size: 12px;
}
</style>
