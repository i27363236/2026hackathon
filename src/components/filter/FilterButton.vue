<script setup>
// 開啟篩選面板的膠囊鈕。啟用中的條件數量直接顯示在鈕上 —— 面板收起後
// 使用者仍看得出「現在有幾個條件在生效」,這是放在頁面內而非工具列的主因。
import { Icon } from '@iconify/vue'

defineProps({
  count: { type: Number, default: 0 },
})

defineEmits(['click'])
</script>

<template>
  <button
    type="button"
    class="btn btn-light rounded-pill d-inline-flex align-items-center gap-2 px-5 py-2 flex-shrink-0"
    :aria-label="count ? `篩選,已套用 ${count} 個條件` : '篩選'"
    @click="$emit('click')"
  >
    <Icon icon="ph:sliders-horizontal-light" width="24" height="24" />
    <span class="fw-bold">篩選</span>
    <span v-if="count" class="badge rounded-pill bg-primary text-white">{{ count }}</span>
  </button>
</template>
