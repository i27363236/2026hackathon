<script setup>
// 獎章區塊 — 仿 Apple Fitness「獎章」卡:卡片內含標題列(標題 + 右側箭頭,可選連結)與
// 一整排水平獎章項目(獎章圖 + 多行標題 + 灰色說明)。成就與送出的禮物共用此元件。
import { Icon } from '@iconify/vue'

defineProps({
  title: { type: String, required: true },
  items: { type: Array, required: true }, // [{ img, title, caption, locked? }]
  to: { type: [String, Object], default: null }, // 有值時標題列變為連結
  hideText: { type: Boolean, default: false }, // 只顯示獎章圖(紀念章用)
})
</script>

<template>
  <section class="medal-card card">
    <component :is="to ? 'RouterLink' : 'div'" :to="to || undefined" class="medal-header">
      <h2 class="medal-title">{{ title }}</h2>
      <span class="circle-arrow-btn">
        <Icon icon="ph:caret-right-light" width="16" height="16" />
      </span>
    </component>

    <div class="medal-row">
      <div v-for="(item, i) in items" :key="i" class="medal-item" :class="{ 'medal-item--locked': item.locked }">
        <img :src="item.img" alt="" class="medal-img mb-3" />
        <template v-if="!hideText">
          <div class="medal-item-title mb-2">{{ item.title }}</div>
          <div class="medal-item-caption">{{ item.caption }}</div>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.medal-card {
  background-color: var(--bs-white);
  border-radius: var(--bs-border-radius-xl);
  box-sizing: border-box;
  border: none;
  padding: .5rem 1rem .75rem 1rem;
}

.medal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  margin-bottom: .5rem;
}

.medal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--bs-body-color);
  margin: 0;
}

.circle-arrow-btn {
  width: 1.5rem;
  height: 1.5rem;
  background-color: var(--bs-gray-100);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--bs-secondary-color);
  flex-shrink: 0;
}

/* 獎章列:固定三等分,3 枚剛好均分;不足 3 枚時靠左依序排 */
.medal-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.medal-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.medal-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
}

.medal-item-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--bs-body-color);
  line-height: 1.1;
}

.medal-item-caption {
  font-size: 11px;
  color: var(--bs-secondary-color);
}

/* 尚未達成的獎章:灰階並降低對比 */
.medal-item--locked .medal-img {
  filter: grayscale(1);
  opacity: 0.45;
}

.medal-item--locked .medal-item-title,
.medal-item--locked .medal-item-caption {
  color: var(--bs-tertiary-color);
}
</style>
