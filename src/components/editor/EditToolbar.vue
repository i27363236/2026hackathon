<script setup>
// Card editor toolbar. Renders labelled tool buttons (icon + caption) plus an
// optional secondary action group (undo / delete). Orientation is set by the
// parent: 'vertical' for the desktop left rail, 'horizontal' for the mobile
// bottom bar.
import { Icon } from '@iconify/vue'

defineProps({
  tools: { type: Array, required: true }, // [{ key, icon, label }]
  actions: { type: Array, default: () => [] }, // [{ key, icon, label, disabled, danger }]
  active: { type: String, default: '' },
  orientation: { type: String, default: 'vertical' }, // 'vertical' | 'horizontal'
})

defineEmits(['select', 'action'])
</script>

<template>
  <div class="edit-toolbar" :class="`is-${orientation}`">
    <div class="tool-group">
      <button
        v-for="t in tools"
        :key="t.key"
        type="button"
        class="toolbar-item"
        :class="{ active: active === t.key }"
        @click="$emit('select', t.key)"
      >
        <span class="icon-slot"><Icon :icon="t.icon" width="24" height="24" /></span>
        <span class="item-label">{{ t.label }}</span>
      </button>
    </div>

    <div v-if="actions.length" class="tool-group action-group">
      <button
        v-for="a in actions"
        :key="a.key"
        type="button"
        class="toolbar-item"
        :class="{ danger: a.danger }"
        :disabled="a.disabled"
        @click="$emit('action', a.key)"
      >
        <span class="icon-slot"><Icon :icon="a.icon" width="24" height="24" /></span>
        <span class="item-label">{{ a.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.edit-toolbar {
  display: flex;
  gap: 4px;
}
.tool-group {
  display: flex;
  gap: 2px;
}

.toolbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 0 0 auto;
  width: 61px;
  padding: 8px;
  border: 0;
  background: transparent;
  border-radius: var(--bs-border-radius-lg);
  color: var(--bs-secondary-color);
  cursor: pointer;
}
.icon-slot {
  display: flex;
  align-items: center;
  justify-content: center;
}
.item-label {
  font-size: 11px;
  line-height: 13px;
  font-weight: 400;
}
.toolbar-item.active {
  background: var(--bs-primary-bg-subtle);
  color: var(--bs-primary);
}
.toolbar-item.active .item-label {
  font-weight: 700;
}
.toolbar-item.danger {
  color: var(--bs-danger);
}
.toolbar-item:disabled {
  opacity: 0.4;
  cursor: default;
}

/* Vertical — tablet left rail: flush, full height, secondary background, centered. */
.edit-toolbar.is-vertical {
  flex-direction: column;
  justify-content: center;
  height: 100%;
  background: var(--bs-secondary-bg);
  padding: 8px;
}
.edit-toolbar.is-vertical .tool-group {
  flex-direction: column;
  width: 100%;
}
.edit-toolbar.is-vertical .action-group {
  margin-top: 2px;
  padding-top: 4px;
  border-top: 1px solid var(--bs-border-color);
}

/* Horizontal — mobile bottom bar. Centers when it fits, scrolls when the
   phone is too narrow to show every tool. */
.edit-toolbar.is-horizontal {
  flex-direction: row;
  align-items: center;
  justify-content: safe center;
  width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
}
.edit-toolbar.is-horizontal::-webkit-scrollbar {
  display: none;
}
.edit-toolbar.is-horizontal .tool-group {
  flex-direction: row;
  flex-wrap: nowrap;
}
</style>
