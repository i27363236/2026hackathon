<script setup>
// 共用 bottom sheet — 收下原本 GiftReceivedView 與 SmartRecommendations 各自手刻的
// overlay + slide-up 版本。chrome 由這裡統一提供:grab handle、左上關閉鈕、置中標題。
//
// RWD:手機貼底滿版(下緣直角);≥md 改成離底浮起的置中面板(四角圓),對齊 iPad 設計稿。
// 內容放 default slot,捲動由這裡的 .sheet-body 負責。
import ToolbarButton from '@/components/ToolbarButton.vue'

defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
})

defineEmits(['close'])
</script>

<template>
  <Transition name="fade">
    <div v-if="open" class="sheet-overlay" @click="$emit('close')" />
  </Transition>
  <Transition name="slide-up">
    <div
      v-if="open"
      class="bottom-sheet bg-body shadow-lg d-flex flex-column"
      role="dialog"
      aria-modal="true"
    >
      <div class="sheet-handle rounded-pill bg-body-tertiary mx-auto mt-3 flex-shrink-0" />

      <div class="position-relative d-flex align-items-center px-5 py-4 flex-shrink-0">
        <ToolbarButton icon="ph:x-light" aria-label="關閉" @click="$emit('close')" />
        <h3 v-if="title" class="sheet-title h6 fw-bold mb-0 position-absolute start-50 translate-middle-x">
          {{ title }}
        </h3>
      </div>

      <div class="sheet-body overflow-auto px-5 pb-6">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.sheet-overlay {
  position: fixed;
  inset: 0;
  background: var(--overlay);
  z-index: 1040;
}

.bottom-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1050;
  max-width: 560px;
  margin-inline: auto;
  max-height: 75dvh;
  border-radius: var(--bs-border-radius-xl);
  /* 貼底時下緣切齊視窗邊緣,不留圓角缺口 */
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.sheet-handle {
  width: 40px;
  height: 4px;
}

/* 標題置中不受左側關閉鈕影響;過長時省略而非把鈕擠掉 */
.sheet-title {
  max-width: 60%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* 平板以上:離底浮起的置中面板 */
@media (min-width: 768px) {
  .bottom-sheet {
    bottom: 24px;
    max-width: 720px;
    max-height: 80dvh;
    border-bottom-left-radius: var(--bs-border-radius-xl);
    border-bottom-right-radius: var(--bs-border-radius-xl);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
