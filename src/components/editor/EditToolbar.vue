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
  width: 61px;
  padding: 8px;
  border: 0;
  background: transparent;
  border-radius: 12px;
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

/* Vertical — desktop left rail, styled as a floating card. */
.edit-toolbar.is-vertical {
  flex-direction: column;
  background: var(--bs-secondary-bg);
  border: 1px solid var(--bs-border-color);
  border-radius: 20px;
  padding: 8px;
  box-shadow: 0 1px 4px 1px rgba(0, 0, 0, 0.15);
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

/* Horizontal — mobile bottom bar. */
.edit-toolbar.is-horizontal {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.edit-toolbar.is-horizontal .tool-group {
  flex-direction: row;
}
</style>
