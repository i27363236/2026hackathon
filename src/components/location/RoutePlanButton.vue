<script setup>
// 「規劃路線」— 正式版應該叫起「台北捷運Go」的路線規劃。Demo 沒有串接,
// 所以按下去改用 Bootstrap Popover 說明這顆鈕的意圖(不假裝成功,也不靜默無反應)。
// trigger: 'focus' 在觸控裝置上點別處即關閉,<button> 本身可聚焦,不需額外 tabindex。
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { Popover } from 'bootstrap'
import { Icon } from '@iconify/vue'

const el = ref(null)
let popover = null

onMounted(() => {
  popover = new Popover(el.value, {
    content: '將開啟「台北捷運Go」為你規劃路線（Demo 未串接）',
    trigger: 'focus',
    placement: 'top',
  })
})

onBeforeUnmount(() => {
  popover?.dispose()
  popover = null
})
</script>

<template>
  <button
    ref="el"
    type="button"
    class="btn btn-link text-primary p-0 fw-bold d-flex align-items-center gap-2 flex-shrink-0 text-decoration-none"
  >
    <Icon icon="ph:traffic-sign" width="20" height="20" />
    規劃路線
  </button>
</template>
