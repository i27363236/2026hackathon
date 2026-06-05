<script setup>
// // TEMP: remove before ship — see docs/plan.md Phase 5.
// Lets us test the editor → preview → send flow without the (teammate-owned) ProductView
// and PurchaseCheckoutView. Seeds a purchased draft, then opens the editor.
import { useRouter } from 'vue-router'
import { useGiftsStore } from './stores/gifts.js'

const router = useRouter()
const gifts = useGiftsStore()

function launchEditor() {
  gifts.startDraft('cat-021') // 檸檬塔
  gifts.purchaseDraft()
  router.push({ name: 'use-gift-setup' })
}
</script>

<template>
  <RouterView />

  <!-- TEMP launch button -->
  <button type="button" class="temp-launch btn btn-primary rounded-pill shadow" @click="launchEditor">
    🧪 編輯卡片
  </button>
</template>

<style scoped>
.temp-launch {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 1080;
}
</style>
