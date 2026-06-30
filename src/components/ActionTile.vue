<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  label: { type: String, required: true },
  icon: { type: String, required: true },
  variant: { type: String, default: 'blue' }, // 'blue' | 'green' | 'gray'
  to: { type: [String, Object], default: null },
})
</script>

<template>
  <component
    :is="to ? 'RouterLink' : 'div'"
    :to="to || undefined"
    class="action-tile position-relative rounded-2 overflow-hidden text-decoration-none"
    :class="`action-tile--${variant}`"
  >
    <h4 class="action-tile__label ps-4 pt-3 m-0">{{ label }}</h4>
    <Icon :icon="icon" width="64" class="action-tile__icon position-absolute" style="opacity: 0.8;" />
  </component>
</template>

<style scoped>
.action-tile {
  display: block;
  height: 6.25rem;
  max-width: 185px;
}

.action-tile--blue {
  background: linear-gradient(to top, #005886, #0079a9);
  color: #fff;
}

.action-tile--green {
  background: linear-gradient(to top, #005f00, #007e00);
  color: #fff;
}

.action-tile--gray {
  background: linear-gradient(to bottom, var(--gray-100), var(--gray-300));
  color: #000;
}

.action-tile__icon {
  bottom: 8px;
  right: 8px;
}

.action-tile__label {
  font-size: 20px;
  font-weight: 700;
  line-height: 26px;
  letter-spacing: 0.45px;
  white-space: nowrap;
}
</style>
