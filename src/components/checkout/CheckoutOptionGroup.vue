<script setup>
// 結帳的單選清單 — 付款方式 / 發票資訊共用。
//  variant 'card':金流結帳用(較寬鬆的間距,可選「更改」連結)
//  variant 'list':點數結帳的發票用(有下框線的緊湊列)
defineProps({
  options: { type: Array, required: true }, // [{ id, label, sub, change? }]
  name: { type: String, required: true }, // radio group name(同頁需唯一)
  variant: { type: String, default: 'card' }, // 'card' | 'list'
})
const model = defineModel({ type: String, required: true })
</script>

<template>
  <template v-if="variant === 'card'">
    <div v-for="opt in options" :key="opt.id" class="co-option">
      <input
        class="form-check-input mt-1"
        type="radio"
        :name="name"
        :id="`${name}-${opt.id}`"
        :value="opt.id"
        v-model="model"
      />
      <label class="co-option-label" :for="`${name}-${opt.id}`">
        <span class="d-block text-body">{{ opt.label }}</span>
        <span v-if="opt.sub" class="caption-1 text-body-secondary">{{ opt.sub }}</span>
      </label>
      <button
        v-if="opt.change"
        type="button"
        class="btn btn-link p-0 fw-bold text-decoration-none text-nowrap text-body-secondary"
      >
        更改
      </button>
    </div>
  </template>

  <template v-else>
    <div
      v-for="opt in options"
      :key="opt.id"
      class="co-list-item form-check d-flex align-items-start gap-2 py-2 border-bottom border-light-subtle"
    >
      <input class="form-check-input mt-1" type="radio" :name="name" :id="`${name}-${opt.id}`" :value="opt.id" v-model="model" />
      <label class="form-check-label w-100" :for="`${name}-${opt.id}`">
        <span class="d-block fw-bold text-body">{{ opt.label }}</span>
        <span v-if="opt.sub" class="text-body-secondary">{{ opt.sub }}</span>
      </label>
    </div>
  </template>
</template>

<style scoped>
.co-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}
.co-option:last-child {
  margin-bottom: 0;
}
/* 清單最後一項不畫下框線 — 區塊本身已有間距,多一條線只會像斷掉的表格 */
.co-list-item:last-child {
  border-bottom: 0 !important;
}
.co-option-label {
  flex: 1;
  min-width: 0;
  cursor: pointer;
}
.form-check-input:checked {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}
</style>
