<script setup>
// 通用內容卡片 — 合併原 home/RowCard、home/EventLargeCard、home/GiftRowCard 三種卡片。
// variant: 'row'  = 160px,圖上(120px 高)文下 — 活動/優惠券橫列
//          'large'= 300px,文上圖下(300/169) — 大型活動卡
//          'gift' = 165px,圖上 + 名稱/價格列 — 商品卡
//          'row-horizontal' = 滿版清單列,縮圖左 + 文字中 + 尾端(#trailing slot:箭頭或戳印)
//            — 取代 CouponsView / GiftsHistoryView 各自複製的 .coupon-card 列。
//            detail 線可用 detail prop(純文字)或 #detail slot(如放 <PointsAmount>)。
// colorKey: variant-1…variant-6 → .card-subtitle--N(見 _card-colors.scss;
//           row/large/row-horizontal 上色 subtitle)
// price/purchaseType: gift 專用 — 'points'(預設)用 <PointsAmount tone="cost">,
//           'money' 顯示 NT$ 純文字(見 catalog.js 的 purchaseType 說明)
// img: CSS background 簡寫(url(...) center/cover),直接綁到 :style
// to:  有值時整張卡是 RouterLink,否則是 div — 目的路由由呼叫端決定
import { computed } from 'vue'
import PointsAmount from '@/components/points/PointsAmount.vue'

const props = defineProps({
  variant: { type: String, default: 'row' }, // 'row' | 'large' | 'gift'
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  detail: { type: String, default: '' },
  img: { type: String, default: '' },
  colorKey: { type: String, default: '' },
  price: { type: [String, Number], default: '' }, // gift 專用
  purchaseType: { type: String, default: 'points' }, // gift 專用:'points' | 'money'(NT$,見 catalog.js)
  to: { type: [String, Object], default: null },
})

const VARIANTS = ['variant-1', 'variant-2', 'variant-3', 'variant-4', 'variant-5', 'variant-6']
const subtitleClass = computed(() =>
  VARIANTS.includes(props.colorKey) ? `card-subtitle--${props.colorKey}` : '',
)

// row-horizontal 是滿版清單列(自帶 flex/border/padding);其餘 variant 是可橫向捲動的固定寬卡片。
const rootClass = computed(() =>
  props.variant === 'row-horizontal'
    ? 'content-card content-card--row-horizontal d-flex align-items-center p-3 border rounded-3 bg-white text-decoration-none text-body'
    : `content-card content-card--${props.variant} flex-shrink-0 text-decoration-none text-body`,
)
</script>

<template>
  <component
    :is="to ? 'RouterLink' : 'div'"
    :to="to || undefined"
    :class="rootClass"
  >
    <!-- row-horizontal:縮圖左、文字中、尾端 slot(箭頭/戳印) -->
    <template v-if="variant === 'row-horizontal'">
      <div class="chr-thumb rounded-2 bg-body-tertiary flex-shrink-0" :style="img ? { background: img } : {}" />
      <div class="ms-3 flex-grow-1 overflow-hidden">
        <p v-if="subtitle" class="caption-1 mb-1 fw-bold" :class="subtitleClass">{{ subtitle }}</p>
        <h3 class="h6 fw-bold mb-1 text-truncate">{{ title }}</h3>
        <p v-if="detail" class="caption-1 text-body-secondary mb-0 text-truncate">{{ detail }}</p>
        <slot name="detail" />
      </div>
      <div v-if="$slots.trailing" class="ms-2 flex-shrink-0 d-flex align-items-center">
        <slot name="trailing" />
      </div>
    </template>

    <!-- large:文字在上、圖在下 -->
    <template v-else-if="variant === 'large'">
      <div class="pb-3">
        <p v-if="subtitle" class="caption-1 mb-1 fw-bold" :class="subtitleClass">{{ subtitle }}</p>
        <h4 class="mb-1">{{ title }}</h4>
        <p v-if="detail" class="mb-0 text-body-secondary">{{ detail }}</p>
      </div>
      <div class="card-img--large rounded-5 bg-body-tertiary" :style="img ? { background: img } : {}" />
    </template>

    <!-- gift:圖上、名稱 + 價格列在下 -->
    <template v-else-if="variant === 'gift'">
      <div class="card-img--gift rounded-4" :style="img ? { background: img } : {}" />
      <div class="d-flex align-items-end justify-content-between gap-2 pt-3">
        <div class="gift-text">
          <h5 class="mb-1 lh-1 text-truncate">{{ title }}</h5>
          <p class="caption-1 text-body-secondary mb-0 text-truncate">{{ detail }}</p>
        </div>
        <div class="flex-shrink-0">
          <span v-if="purchaseType === 'money'" class="fw-bold text-warning">NT$ {{ price }}</span>
          <PointsAmount v-else :value="price" tone="cost" size="caption" :show-label="false" />
        </div>
      </div>
    </template>

    <!-- row(預設):圖上、文字在下 -->
    <template v-else>
      <div class="card-img--row rounded-4 bg-body-tertiary" :style="img ? { background: img } : {}" />
      <div class="pt-3 ps-2">
        <p v-if="subtitle" class="caption-1 mb-1 fw-bold" :class="subtitleClass">{{ subtitle }}</p>
        <h5 class="mb-1 lh-1">{{ title }}</h5>
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
.content-card--row-horizontal {
  width: 100%;
}
.chr-thumb {
  width: 72px;
  height: 72px;
  background-size: cover;
  background-position: center;
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
</style>
