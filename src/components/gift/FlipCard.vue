<script setup>
import { ref } from 'vue'

const props = defineProps({
  flipped: { type: Boolean, default: false },
})

const internal = ref(props.flipped)
function toggle() {
  internal.value = !internal.value
}
defineExpose({ toggle })
</script>

<template>
  <div class="flip" :class="{ 'is-flipped': internal }" @click="toggle">
    <div class="flip-inner">
      <div class="face face--front">
        <slot name="front" />
      </div>
      <div class="face face--back">
        <slot name="back" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.flip {
  perspective: 1400px;
  cursor: pointer;
}
.flip-inner {
  position: relative;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}
.flip.is-flipped .flip-inner {
  transform: rotateY(180deg);
}
.face {
  backface-visibility: hidden;
}
.face--back {
  position: absolute;
  inset: 0;
  transform: rotateY(180deg);
}
</style>
