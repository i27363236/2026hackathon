<script setup>
// Large event card — matches Figma node 2184-10035 (大家都參加 row):
// text block on top (colored 小標題 / 活動名稱 / 活動標語) then a 300×169 rounded image.
// Same prop shape as RowCard; subtitle color comes from .card-subtitle--variant-N (see
// _card-colors.scss) via colorKey. Fixed width so the row scrolls horizontally.
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
  <div class="event-large-card flex-shrink-0">
    <div class="pb-3">
      <p
        v-if="subtitle"
        class="caption-1 mb-1 fw-bold"
        :class="VARIANTS.includes(colorKey) ? 'card-subtitle--' + colorKey : ''"
      >
        {{ subtitle }}
      </p>
      <h4 class="mb-1">{{ title }}</h4>
      <p v-if="detail" class="mb-0 text-body-secondary">{{ detail }}</p>
    </div>
    <div class="event-large-card-img rounded-5 bg-body-tertiary" :style="img ? { background: img } : {}" />
  </div>
</template>

<style scoped>
.event-large-card {
  width: 300px;
}
.event-large-card-img {
  aspect-ratio: 300 / 169;
}
</style>
