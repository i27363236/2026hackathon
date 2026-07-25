<script setup>
// 獎章區塊 — 仿 Apple Fitness「獎章」卡:卡片內含標題列(標題 + 右側箭頭,可選連結)與
// 一整排水平獎章項目(獎章圖 + 多行標題 + 灰色說明)。成就與送出的禮物共用此元件。
import { Icon } from '@iconify/vue'

defineProps({
  title: { type: String, required: true },
  items: { type: Array, required: true }, // [{ img, title, caption }]
  to: { type: [String, Object], default: null }, // 有值時標題列變為連結
})
</script>

<template>
  <section class="medal-card card">
    <component :is="to ? 'RouterLink' : 'div'" :to="to || undefined" class="medal-header">
      <h2 class="medal-title">{{ title }}</h2>
      <span class="circle-arrow-btn">
        <Icon icon="ph:caret-right-light" width="18" height="18" />
      </span>
    </component>

    <div class="medal-row">
      <div v-for="(item, i) in items" :key="i" class="medal-item">
        <img :src="item.img" alt="" class="medal-img" />
        <div class="medal-item-title">{{ item.title }}</div>
        <div class="medal-item-caption">{{ item.caption }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.medal-card {
  background-color: var(--bs-white);
  border-radius: var(--bs-border-radius-xl);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  border: none;
  padding: 20px;
}

.medal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  margin-bottom: 16px;
}

.medal-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--bs-body-color);
  margin: 0;
}

.circle-arrow-btn {
  width: 32px;
  height: 32px;
  background-color: var(--bs-gray-100);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--bs-secondary-color);
  flex-shrink: 0;
}

/* 水平獎章列:超出寬度時可橫向捲動,不顯示捲軸 */
.medal-row {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.medal-row::-webkit-scrollbar {
  display: none;
}

.medal-item {
  flex: 0 0 auto;
  width: 108px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
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
  line-height: 1.3;
}

.medal-item-caption {
  font-size: 11px;
  color: var(--bs-secondary-color);
}
</style>
