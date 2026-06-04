<script setup>
// Events / coupons row item — matches Figma node 2433-6128:
// cream rounded image on top, then colored 小標題 / bold 活動名稱 / gray 活動細節.
// Fixed size (never varies between items). Subtitle color comes from the global
// .card-subtitle--variant-N classes (see _card-colors.scss) via colorKey.
defineProps({
  subtitle: { type: String, default: '' },
  title: { type: String, default: '' },
  detail: { type: String, default: '' },
  img: { type: String, default: '' },
  colorKey: { type: String, default: '' },
})

const VARIANTS = ['variant-1', 'variant-2', 'variant-3', 'variant-4', 'variant-5', 'variant-6']
</script>

<template>
  <div class="row-card flex-shrink-0">
    <div class="row-card-img rounded-4" :style="img ? { background: img } : {}" />
    <div class="pt-3">
      <p
        v-if="subtitle"
        class="row-card-subtitle mb-1"
        :class="VARIANTS.includes(colorKey) ? 'card-subtitle--' + colorKey : ''"
      >
        {{ subtitle }}
      </p>
      <p class="row-card-title fw-bold mb-1">{{ title }}</p>
      <p v-if="detail" class="row-card-detail text-body-secondary mb-0">{{ detail }}</p>
    </div>
  </div>
</template>

<style scoped>
.row-card {
  width: 160px;
}
.row-card-img {
  height: 120px;
  background: #f2ede7;
}
.row-card-subtitle {
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
}
.row-card-title {
  font-size: 16px;
  line-height: 22px;
}
.row-card-detail {
  font-size: 12px;
  line-height: 16px;
}
</style>
