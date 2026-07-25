<script setup>
// 結帳頁固定底欄 — 金流與點數兩種模式共用。
defineProps({
  label: { type: String, required: true }, // 總計 / 應付金額
  value: { type: String, required: true }, // NT$ 175 / 捷運點 65
  confirmLabel: { type: String, required: true },
  disabled: { type: Boolean, default: false },
})
defineEmits(['confirm'])
</script>

<template>
  <div class="footer bg-body border-top">
    <div class="container-form">
      <div class="co-action-row">
        <div class="co-summary">
          <div class="caption-1 text-body fw-bold">{{ label }}</div>
          <div class="fs-4 fw-bold text-primary mt-1">{{ value }}</div>
        </div>
        <button type="button" class="btn btn-primary fw-bold" :disabled="disabled" @click="$emit('confirm')">
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.footer {
  position: sticky;
  bottom: 0;
}
.co-action-row {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 12px;
  align-items: center;
  padding: 12px 16px;
}
.co-summary {
  min-width: 0;
}
</style>
