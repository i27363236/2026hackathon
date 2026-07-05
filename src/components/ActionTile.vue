<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  label: { type: String, required: true },
  icon: { type: String, required: true },
  variant: { type: String, default: 'blue' }, // 'blue' | 'green' | 'gray'
  to: { type: [String, Object], default: null },
  disabled: { type: Boolean, default: false },
})

// Disabled (or target-less) tiles render as a non-interactive div, like a disabled link.
const target = computed(() => (props.disabled ? null : props.to))
</script>

<template>
  <component
    :is="target ? 'RouterLink' : 'div'"
    :to="target || undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    :tabindex="disabled ? -1 : undefined"
    class="action-tile position-relative rounded-2 overflow-hidden text-decoration-none"
    :class="[`action-tile--${variant}`, { 'action-tile--disabled pe-none': disabled }]"
  >
    <h4 class="ps-4 pt-4 m-0" :class="{ 'text-body-tertiary': disabled }">{{ label }}</h4>
    <Icon :icon="icon" width="64" class="action-tile__icon position-absolute" style="opacity: 0.4;" />
  </component>
</template>

<style scoped>
.action-tile {
  display: block;
  height: 6.25rem;
}

.action-tile--blue {
  background: var(--tile-gradient-blue);
  color: #fff;
}

.action-tile--green {
  background: var(--tile-gradient-green);
  color: #fff;
}

.action-tile--gray {
  background: var(--tile-gradient-gray);
  color: #000;
}

.action-tile--disabled {
  opacity: 0.55;
}

.action-tile__icon {
  bottom: 8px;
  right: 8px;
}
</style>
