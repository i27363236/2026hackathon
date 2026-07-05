<script setup>
// Gift coupon face — QR code (Figma node 2415-2352).
// Big white QR area + a coupon stub and title/expiry below.
// Shares the image-derived lighter gradient background with ProductFace.
import { computed, toRef } from 'vue'
import { useCardColors } from '@/utils/imageColor.js'
import qrCodeImg from '@/img/qr-code-example.png'

const props = defineProps({
  name: { type: String, default: '' },
  price: { type: [String, Number], default: '' },
  unit: { type: String, default: '元' },
  img: { type: String, default: '' },
  expiredDate: { type: String, default: '' }, // ISO string
})

const { gradient, textColor } = useCardColors(toRef(props, 'img'))

const expiryDuration = computed(() => {
  if (!props.expiredDate) return ''
  const months = Math.max(1, Math.round((new Date(props.expiredDate) - Date.now()) / (30 * 86400000)))
  return `${months}個月`
})

const expiryDate = computed(() => {
  if (!props.expiredDate) return ''
  const d = new Date(props.expiredDate)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}到期`
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

    <!-- thumbnail + info -->
    <div class="d-flex align-items-center gap-4 pt-4">
      <div
        class="thumb flex-shrink-0"
        :style="{ background: img || '#999', backgroundSize: 'cover', backgroundPosition: 'center' }"
      ></div>
      <div class="min-w-0 flex-grow-1">
        <p class="qr-title fw-bold mb-2 text-truncate">{{ name }}</p>
        <div class="d-flex align-items-center gap-2">
          <span class="qr-expiry fw-bold">{{ expiryDuration }}</span>
          <span class="dot rounded-circle flex-shrink-0"></span>
          <span class="qr-expiry">{{ expiryDate }}</span>
        </div>
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
.thumb {
  width: 73px;
  aspect-ratio: 109 / 73;
  border-radius: 4px;
}
.dot {
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.7);
}
.qr-title {
  font-size: 22px;
  line-height: 28px;
  letter-spacing: 0.45px;
  color: white;
}
.qr-expiry {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}
</style>
