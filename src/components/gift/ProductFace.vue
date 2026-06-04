<script setup>
// Gift back face — product info (Figma node 2415-2043).
// Image-derived lighter gradient background; text auto black/white for readability.
import { computed, toRef } from 'vue'
import { useCardColors } from '../../utils/imageColor.js'

const props = defineProps({
  name: { type: String, default: '' },
  price: { type: [String, Number], default: '' },
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
    class="product-face rounded-4 overflow-hidden w-100 h-100 d-flex flex-column p-5"
    :style="{ background: gradient, color: textColor }"
  >
    <!-- product image -->
    <div class="product-img rounded-3 flex-grow-1" :style="img ? { background: img } : {}" />

    <!-- info -->
    <div class="pt-4">
      <p class="product-title fw-bold mb-1">{{ name }}</p>
      <p class="product-expiry mb-3 opacity-75">{{ expiry }}</p>
      <p class="product-points fw-bold mb-0">捷運點 {{ price }} 點</p>
    </div>
  </div>
</template>

<style scoped>
.product-face {
  aspect-ratio: 3 / 4;
}
.product-img {
  background: rgba(255, 255, 255, 0.35);
  min-height: 0;
}
.product-title {
  font-size: 18px;
  line-height: 24px;
}
.product-expiry {
  font-size: 13px;
}
.product-points {
  font-size: 15px;
}
</style>
