<script setup>
// 點數交易列 — PointsView 最近紀錄與 PointsHistoryView 明細共用。
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  tx: { type: Object, required: true },
})

const CATEGORY_ICONS = {
  ride: 'ph:train-light',
  checkin: 'ph:calendar-check-light',
  event: 'ph:star-light',
  redeem: 'ph:gift-light',
}
const icon = computed(
  () => CATEGORY_ICONS[props.tx.category] ?? (props.tx.type === 'earn' ? 'ph:train-light' : 'ph:gift-light'),
)
</script>

<template>
  <div class="list-group-item d-flex align-items-center gap-4">
    <div
      class="flex-shrink-0 icon-box-sm rounded-circle d-flex align-items-center justify-content-center"
      :class="tx.type === 'earn' ? 'bg-primary-subtle' : 'bg-light'"
    >
      <Icon :icon="icon" :class="tx.type === 'earn' ? 'text-primary' : 'text-secondary'" width="20" height="20" />
    </div>
    <div class="flex-grow-1 min-w-0">
      <div class="fw-bold text-dark small mb-1">{{ tx.title }}</div>
      <div class="text-muted smaller">
        <slot name="caption">{{ tx.date }}</slot>
      </div>
    </div>
    <div class="flex-shrink-0 fw-bold" :class="tx.type === 'earn' ? 'text-primary' : 'text-dark'">
      {{ tx.amount > 0 ? '+' : '' }}{{ tx.amount }} P
    </div>
  </div>
</template>

<style scoped>
.icon-box-sm {
  width: 40px;
  height: 40px;
}
.smaller {
  font-size: 0.75rem;
}
.min-w-0 {
  min-width: 0;
}
</style>
