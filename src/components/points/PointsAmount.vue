<script setup>
// 捷運點金額 — 顯示點數的「唯一」方式。呼叫端只挑 tone + size,不自行決定顏色/字級/圖示。
// 圖示永遠是 metro-point.png(捷運點品牌標記),文字單位永遠是「捷運點」。
// 不要再用 coin.png / ph:coin* / 裸字「P」來表示點數。
//
// tone(顏色語意):
//   default = 餘額 / 一般數值(黑,text-body)
//   cost    = 商品價格,要花掉的點(橘,$warning)
//   credit  = 賺得的點 / 強調的結帳總額(藍,$primary)
//   muted   = 「您目前有 X 捷運點」這類輔助說明(灰,text-body-secondary)
//   inherit = 跟隨父層 currentColor(用於卡面等由圖片決定文字色的情境,如 ProductFace)
// size(字級):hero(餘額大字)/ price(顯眼價格)/ inline(內文)/ caption(小字說明)
// value 直接原樣輸出 — 需要千分位請由呼叫端傳入 value.toLocaleString()。
import { computed } from 'vue'
import metroPointImg from '@/img/metro-point.png'

const props = defineProps({
  value: { type: [Number, String], required: true },
  tone: { type: String, default: 'default' }, // default | cost | credit | muted | inherit
  size: { type: String, default: 'inline' }, // hero | price | inline | caption
  showIcon: { type: Boolean, default: true },
  showLabel: { type: Boolean, default: true },
})

const TONE_CLASS = {
  default: 'text-body',
  cost: 'text-warning',
  credit: 'text-primary',
  muted: 'text-body-secondary',
  inherit: '',
}
const SIZE = {
  hero: { num: 'display-3', icon: 32, gap: 'gap-2' },
  price: { num: 'fs-4 fw-bold', icon: 24, gap: 'gap-2' },
  inline: { num: 'fw-bold', icon: 20, gap: 'gap-2' },
  caption: { num: 'small', icon: 16, gap: 'gap-1' },
}

const toneClass = computed(() => TONE_CLASS[props.tone] ?? TONE_CLASS.default)
const sizeCfg = computed(() => SIZE[props.size] ?? SIZE.inline)
</script>

<template>
  <span class="points-amount d-inline-flex align-items-center" :class="[toneClass, sizeCfg.gap]">
    <img
      v-if="showIcon"
      :src="metroPointImg"
      :alt="showLabel ? '' : '捷運點'"
      :style="{ width: sizeCfg.icon + 'px', height: sizeCfg.icon + 'px', objectFit: 'contain' }"
    />
    <span :class="sizeCfg.num">{{ value }}</span>
    <span v-if="showLabel" class="points-label">捷運點</span>
  </span>
</template>
