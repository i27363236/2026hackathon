<script setup>
// 捷運點折抵數量調整器(金流結帳用),範圍夾在 0 ~ max。
import { Icon } from '@iconify/vue'

const props = defineProps({
  max: { type: Number, required: true },
})
const model = defineModel({ type: Number, required: true })

function dec() {
  model.value = Math.max(0, model.value - 1)
}
function inc() {
  model.value = Math.min(props.max, model.value + 1)
}
</script>

<template>
  <div class="co-stepper">
    <button type="button" class="co-step-btn" :disabled="model <= 0" @click="dec">
      <Icon icon="ph:minus-light" width="20" height="20" />
    </button>
    <span class="co-step-val fw-bold">{{ model }}</span>
    <button type="button" class="co-step-btn co-step-plus" :disabled="model >= max" @click="inc">
      <Icon icon="ph:plus-light" width="20" height="20" />
    </button>
  </div>
</template>

<style scoped>
.co-stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}
.co-step-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--bs-border-color);
  background: var(--bs-secondary-bg);
  color: var(--bs-secondary-color);
  display: flex;
  align-items: center;
  justify-content: center;
}
.co-step-btn:disabled {
  opacity: 0.5;
}
.co-step-plus {
  color: var(--bs-primary);
}
.co-step-val {
  min-width: 32px;
  text-align: center;
}
</style>
