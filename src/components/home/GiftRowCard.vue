<script setup>
// Gift row item — matches Figma node 2303-4987: cream rounded image on top, then a
// bottom row with name + detail on the left and a circular size badge + price on the right.
// Routes into the (teammate-owned) ProductView. Price color uses the colorKey variant.
defineProps({
  id: { type: [String, Number], default: '' },
  name: { type: String, default: '' },
  detail: { type: String, default: '' },
  price: { type: [String, Number], default: '' },
  sizeLabel: { type: String, default: 'M' },
  img: { type: String, default: '' },
  colorKey: { type: String, default: '' },
})

const VARIANTS = ['variant-1', 'variant-2', 'variant-3', 'variant-4', 'variant-5', 'variant-6']
</script>

<template>
  <RouterLink
    :to="{ name: 'use-product', query: { id } }"
    class="gift-row-card flex-shrink-0 text-decoration-none text-body"
  >
    <div class="gift-row-img rounded-4" :style="img ? { background: img } : {}" />
    <div class="d-flex align-items-end justify-content-between gap-2 pt-3">
      <div class="gift-row-text">
        <p class="gift-row-title fw-bold mb-1 text-truncate">{{ name }}</p>
        <p class="gift-row-detail text-body-secondary mb-0 text-truncate">{{ detail }}</p>
      </div>
      <div class="d-flex align-items-center gap-1 flex-shrink-0">
        <span class="gift-row-size rounded-circle d-flex align-items-center justify-content-center fw-bold">
          {{ sizeLabel }}
        </span>
        <span
          class="gift-row-price fw-bold"
          :class="VARIANTS.includes(colorKey) ? 'card-subtitle--' + colorKey : ''"
        >
          {{ price }}
        </span>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.gift-row-card {
  width: 165px;
  display: block;
}
.gift-row-img {
  height: 120px;
  background: #f2ede7;
}
.gift-row-text {
  min-width: 0;
}
.gift-row-title {
  font-size: 14px;
  line-height: 18px;
}
.gift-row-detail {
  font-size: 11px;
  line-height: 14px;
}
.gift-row-size {
  width: 22px;
  height: 22px;
  font-size: 12px;
  background: #ffd60a;
  color: #3a2e00;
}
.gift-row-price {
  font-size: 18px;
}
</style>
