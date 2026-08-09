<script setup>
// 雙把手價格區間滑桿 —— 兩個疊在一起的原生 <input type="range">。
// 軌道與填色是自己畫的 div,兩個 input 只留下拇指(thumb):input 本身
// pointer-events:none,只有 thumb 收事件,否則上層那個會把下層整條吃掉。
//
// 顏色一律走 var(--bs-*):scoped 樣式讀不到 SCSS 變數,而 stylelint 會擋原始色碼
// 與原始 border-radius px 值(見 stylelint.config.js)。
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Array, required: true }, // [lo, hi]
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  step: { type: Number, default: 10 },
  unit: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

// 兩個把手不能交錯 —— 各自被對方夾住。
const lo = computed({
  get: () => props.modelValue[0],
  set: (v) => emit('update:modelValue', [Math.min(v, props.modelValue[1]), props.modelValue[1]]),
})

const hi = computed({
  get: () => props.modelValue[1],
  set: (v) => emit('update:modelValue', [props.modelValue[0], Math.max(v, props.modelValue[0])]),
})

const span = computed(() => props.max - props.min || 1)
const pct = (v) => ((v - props.min) / span.value) * 100
</script>

<template>
  <div>
    <div class="prs position-relative">
      <div class="prs-track rounded-pill" />
      <div
        class="prs-fill rounded-pill"
        :style="{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }"
      />
      <input
        v-model.number="lo"
        type="range"
        class="prs-input"
        :min="min"
        :max="max"
        :step="step"
        :aria-label="`最低價格${unit}`"
      />
      <input
        v-model.number="hi"
        type="range"
        class="prs-input"
        :min="min"
        :max="max"
        :step="step"
        :aria-label="`最高價格${unit}`"
      />
    </div>

    <div class="d-flex justify-content-between caption-2 text-body-secondary mt-3">
      <span>{{ min }}</span>
      <span class="fw-bold text-body">{{ lo }} – {{ hi }} {{ unit }}</span>
      <span>{{ max }}</span>
    </div>
  </div>
</template>

<style scoped>
.prs {
  height: 24px;
}

.prs-track,
.prs-fill {
  position: absolute;
  top: 50%;
  height: 4px;
  translate: 0 -50%;
}

.prs-track {
  left: 0;
  right: 0;
  background-color: var(--bs-border-color);
}

.prs-fill {
  background-color: var(--bs-primary);
}

/* 兩條 input 完全重疊,只有 thumb 可點 */
.prs-input {
  position: absolute;
  inset: 0;
  width: 100%;
  margin: 0;
  appearance: none;
  background: transparent;
  pointer-events: none;
}

.prs-input:focus {
  outline: none;
}

.prs-input::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: var(--bs-border-radius-pill);
  background-color: var(--bs-body-bg);
  border: 2px solid var(--bs-primary);
  box-shadow: var(--bs-box-shadow-sm);
  cursor: pointer;
  pointer-events: auto;
}

.prs-input::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: var(--bs-border-radius-pill);
  background-color: var(--bs-body-bg);
  border: 2px solid var(--bs-primary);
  box-shadow: var(--bs-box-shadow-sm);
  cursor: pointer;
  pointer-events: auto;
}

.prs-input:focus-visible::-webkit-slider-thumb {
  box-shadow: 0 0 0 var(--bs-focus-ring-width) var(--bs-focus-ring-color);
}

.prs-input:focus-visible::-moz-range-thumb {
  box-shadow: 0 0 0 var(--bs-focus-ring-width) var(--bs-focus-ring-color);
}
</style>
