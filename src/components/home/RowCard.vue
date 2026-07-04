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
    <div class="row-card-img rounded-4 bg-body-tertiary" :style="img ? { background: img } : {}" />
    <div class="pt-3 ps-2">
      <p
        v-if="subtitle"
        class="caption-1 mb-1 fw-bold"
        :class="VARIANTS.includes(colorKey) ? 'card-subtitle--' + colorKey : ''"
      >
        {{ subtitle }}
      </p>
      <h5 class="mb-1" style="line-height: 1.1;">{{ title }}</h5>
      <p v-if="detail" class="caption-1 text-body-secondary mb-0">{{ detail }}</p>
    </div>
  </div>
</template>

<style scoped>
.row-card {
  width: 160px;
}
.row-card-img {
  height: 120px;
}
</style>
