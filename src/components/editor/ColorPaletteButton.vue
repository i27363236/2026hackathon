<script setup>
// Canonical colour picker for the gift-card editor — one shared "palette" swatch so every
// function that picks a colour (pen rail, stamp builder) looks the same. A rainbow ring frames
// the currently-selected colour; a full-size, invisible native <input type="color"> sits on top
// so tapping opens the device colour picker and two-way binds the value.
const color = defineModel({ type: String, required: true })

defineProps({
  size: { type: Number, default: 36 },
  ariaLabel: { type: String, default: '選擇顏色' },
})
</script>

<template>
  <span
    class="palette-btn d-inline-block position-relative rounded-circle"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <!-- selected colour, shown inside the rainbow ring -->
    <span class="palette-fill rounded-circle" :style="{ background: color }" />
    <input
      v-model="color"
      type="color"
      class="palette-input position-absolute top-0 start-0 w-100 h-100 m-0 p-0 border-0 rounded-circle"
      :aria-label="ariaLabel"
    />
  </span>
</template>

<style scoped>
/* Rainbow ring built from hsl() stops (no raw hex — keeps the stylelint guardrail happy). */
.palette-btn {
  background: conic-gradient(
    hsl(0deg 85% 60%),
    hsl(60deg 85% 60%),
    hsl(120deg 85% 60%),
    hsl(180deg 85% 60%),
    hsl(240deg 85% 60%),
    hsl(300deg 85% 60%),
    hsl(360deg 85% 60%)
  );
  box-shadow: var(--bs-box-shadow-sm);
}
.palette-fill {
  position: absolute;
  inset: 3px;
  box-shadow: inset 0 0 0 2px var(--bs-body-bg);
}
.palette-input {
  opacity: 0;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background: none;
}
</style>
