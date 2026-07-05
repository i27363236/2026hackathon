<script setup>
// 通用內容卡片 — 合併原 home/RowCard、home/EventLargeCard、home/GiftRowCard 三種卡片。
// variant: 'row'  = 160px,圖上(120px 高)文下 — 活動/優惠券橫列
//          'large'= 300px,文上圖下(300/169) — 大型活動卡
//          'gift' = 165px,圖上 + 名稱/徽章/價格列 — 商品卡
// colorKey: variant-1…variant-6 → .card-subtitle--N(見 _card-colors.scss;
//           row/large 上色 subtitle,gift 上色價格)
// img: CSS background 簡寫(url(...) center/cover),直接綁到 :style
// to:  有值時整張卡是 RouterLink,否則是 div — 目的路由由呼叫端決定
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'row' }, // 'row' | 'large' | 'gift'
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  detail: { type: String, default: '' },
  img: { type: String, default: '' },
  colorKey: { type: String, default: '' },
  price: { type: [String, Number], default: '' }, // gift 專用
  sizeLabel: { type: String, default: 'M' }, // gift 專用
  to: { type: [String, Object], default: null },
})

const VARIANTS = ['variant-1', 'variant-2', 'variant-3', 'variant-4', 'variant-5', 'variant-6']
const subtitleClass = computed(() =>
  VARIANTS.includes(props.colorKey) ? `card-subtitle--${props.colorKey}` : '',
)
</script>

<template>
  <component
    :is="to ? 'RouterLink' : 'div'"
    :to="to || undefined"
    class="content-card flex-shrink-0 text-decoration-none text-body"
    :class="`content-card--${variant}`"
  >
    <!-- large:文字在上、圖在下 -->
    <template v-if="variant === 'large'">
      <div class="pb-3">
        <p v-if="subtitle" class="caption-1 mb-1 fw-bold" :class="subtitleClass">{{ subtitle }}</p>
        <h4 class="mb-1">{{ title }}</h4>
        <p v-if="detail" class="mb-0 text-body-secondary">{{ detail }}</p>
      </div>
      <div class="card-img--large rounded-5 bg-body-tertiary" :style="img ? { background: img } : {}" />
    </template>

    <!-- gift:圖上、名稱 + 尺寸徽章 + 價格列在下 -->
    <template v-else-if="variant === 'gift'">
      <div class="card-img--gift rounded-4" :style="img ? { background: img } : {}" />
      <div class="d-flex align-items-end justify-content-between gap-2 pt-3">
        <div class="gift-text">
          <p class="gift-title fw-bold mb-1 text-truncate">{{ title }}</p>
          <p class="gift-detail text-body-secondary mb-0 text-truncate">{{ detail }}</p>
        </div>
        <div class="d-flex align-items-center gap-1 flex-shrink-0">
          <span class="gift-size rounded-circle d-flex align-items-center justify-content-center fw-bold">
            {{ sizeLabel }}
          </span>
          <span class="gift-price fw-bold" :class="subtitleClass">{{ price }}</span>
        </div>
      </div>
    </template>

    <!-- row(預設):圖上、文字在下 -->
    <template v-else>
      <div class="card-img--row rounded-4 bg-body-tertiary" :style="img ? { background: img } : {}" />
      <div class="pt-3 ps-2">
        <p v-if="subtitle" class="caption-1 mb-1 fw-bold" :class="subtitleClass">{{ subtitle }}</p>
        <h5 class="mb-1" style="line-height: 1.1;">{{ title }}</h5>
        <p v-if="detail" class="caption-1 text-body-secondary mb-0">{{ detail }}</p>
      </div>
    </template>
  </component>
</template>

<style scoped>
.content-card {
  display: block;
}
.content-card--row {
  width: 160px;
}
.content-card--large {
  width: 300px;
}
.content-card--gift {
  width: 165px;
}

.card-img--row {
  height: 120px;
}
.card-img--large {
  aspect-ratio: 300 / 169;
}
.card-img--gift {
  height: 120px;
  background: var(--surface-cream);
}

.gift-text {
  min-width: 0;
}
.gift-title {
  font-size: 14px;
  line-height: 18px;
}
.gift-detail {
  font-size: 11px;
  line-height: 14px;
}
.gift-size {
  width: 22px;
  height: 22px;
  font-size: 12px;
  background: var(--badge-size-bg);
  color: var(--badge-size-color);
}
.gift-price {
  font-size: 18px;
}
</style>
