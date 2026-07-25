<script setup>
// 紅色鋼印徽章 — 蓋章微歪斜效果,用於禮物/優惠券狀態(如「已使用」「已過期」)。
// 取代原先在 CouponsView / GiftsHistoryView 各自複製的 .stamp-badge。
// 文字用 text prop 或預設 slot;顏色一律 $danger(var(--bs-danger))。
defineProps({
  text: { type: String, default: '' },
})
</script>

<template>
  <span class="stamp-badge caption-2 fw-bold rounded-1">
    <slot>{{ text }}</slot>
  </span>
</template>

<style scoped>
.stamp-badge {
  display: inline-block;
  flex-shrink: 0;
  white-space: nowrap;
  padding: 2px 6px;
  border: 1.5px solid var(--bs-danger);
  color: var(--bs-danger);
  background-color: rgba(var(--bs-white-rgb), 0.9);
  letter-spacing: 0.5px;
  transform: rotate(-12deg);
}
</style>
