<script setup>
// Custom stamp builder panel (Figma node 3432-6763). Top→bottom:
//   preview → colour + shape row → station name → icon weight → icon grid → add.
// The stamp renders as an OUTLINED frame in the chosen colour with a transparent
// interior; the icon + name are tinted to the same colour. Emits a spec the parent
// (GiftSetupView) turns into a Konva group.
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import ColorPaletteButton from '@/components/editor/ColorPaletteButton.vue'
import { STAMP_SHAPES } from './stampShapes.js'
import { stampIcons } from '@/data/stampIcons.js'

const emit = defineEmits(['add'])

// Phosphor weight variants — 'regular' has no suffix. Only applies to type:'ph' icons.
const WEIGHTS = [
  { key: 'thin', label: '極細' },
  { key: 'light', label: '細' },
  { key: 'regular', label: '標準' },
  { key: 'bold', label: '粗' },
  { key: 'fill', label: '實心' },
]

const name = ref('')
const color = ref('#0079a9')
const shape = ref(STAMP_SHAPES[0].key)
const weight = ref('regular')
const iconEntry = ref(stampIcons[0])

const selectedShape = computed(() => STAMP_SHAPES.find((s) => s.key === shape.value))

// Full Iconify name for a Phosphor entry, e.g. 'ph:train' / 'ph:train-light'.
const phName = (entry) => `ph:${entry.name}${weight.value === 'regular' ? '' : `-${weight.value}`}`
// Tinted, sized markup for a custom 'svg' entry (imported ?raw).
const iconSvg = (entry, size) =>
  entry.src.replace(/currentColor/g, color.value).replace('<svg ', `<svg width="${size}" height="${size}" `)

function add() {
  emit('add', {
    name: name.value.trim() || '車站',
    icon: iconEntry.value,
    shape: shape.value,
    color: color.value,
    weight: weight.value,
  })
  name.value = ''
}
</script>

<template>
  <div class="stamp-builder position-relative">
    <!-- add: plus icon, top-right -->
    <button
      type="button"
      class="add-btn btn btn-primary rounded-circle d-inline-flex align-items-center justify-content-center p-0"
      aria-label="加入印章"
      @click="add"
    >
      <Icon icon="ph:plus-light" width="24" height="24" />
    </button>

    <!-- preview -->
    <div class="stamp-preview mx-auto mb-3">
      <svg class="preview-frame" viewBox="0 0 100 100">
        <path :d="selectedShape.d" :stroke="color" fill="none" stroke-width="2" stroke-linejoin="round" />
      </svg>
      <div class="preview-content" :style="{ color }">
        <span class="preview-icon d-inline-flex">
          <Icon v-if="iconEntry.type === 'ph'" :icon="phName(iconEntry)" width="30" height="30" />
          <span v-else v-html="iconSvg(iconEntry, 30)" />
        </span>
        <span class="preview-name text-truncate">{{ name || '車站' }}</span>
      </div>
    </div>

    <!-- colour + shape row -->
    <div class="d-flex align-items-center gap-2 overflow-auto flex-nowrap pb-1 mb-2 shape-row">
      <ColorPaletteButton v-model="color" :size="36" class="flex-shrink-0" aria-label="印章顏色" />
      <button
        v-for="s in STAMP_SHAPES"
        :key="s.key"
        type="button"
        class="shape-btn flex-shrink-0 d-inline-flex align-items-center justify-content-center"
        :class="{ active: shape === s.key }"
        :aria-label="s.label"
        @click="shape = s.key"
      >
        <svg viewBox="0 0 100 100" width="26" height="26">
          <path :d="s.d" :stroke="color" fill="none" stroke-width="6" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <!-- station name -->
    <label class="form-label small fw-bold mb-1">車站名稱</label>
    <input
      v-model="name"
      type="text"
      class="form-control form-control-sm rounded-3 mb-2"
      placeholder="例如：中山站"
      maxlength="6"
    />

    <!-- icon weight -->
    <div class="small fw-bold mb-1">粗細</div>
    <div class="d-flex gap-2 mb-2">
      <button
        v-for="w in WEIGHTS"
        :key="w.key"
        type="button"
        class="btn btn-sm flex-fill px-1"
        :class="weight === w.key ? 'btn-primary' : 'btn-outline-dark'"
        @click="weight = w.key"
      >
        {{ w.label }}
      </button>
    </div>

    <!-- icon grid -->
    <div class="small fw-bold mb-1">圖示</div>
    <div class="icon-grid mb-3">
      <button
        v-for="ic in stampIcons"
        :key="ic.id"
        type="button"
        class="icon-btn d-inline-flex align-items-center justify-content-center"
        :class="{ active: iconEntry.id === ic.id }"
        :aria-label="ic.label"
        @click="iconEntry = ic"
      >
        <Icon v-if="ic.type === 'ph'" :icon="phName(ic)" width="24" height="24" :style="{ color }" />
        <span v-else class="d-inline-flex" v-html="iconSvg(ic, 24)" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.add-btn {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  width: 44px;
  height: 44px;
}
.stamp-preview {
  position: relative;
  width: 120px;
  height: 120px;
}
.preview-frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.preview-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 0 18px;
}
.preview-name {
  font-size: 12px;
  font-weight: 700;
  max-width: 100%;
}

.shape-row {
  scrollbar-width: none;
}
.shape-row::-webkit-scrollbar {
  display: none;
}
/* 圖示格撐滿面板寬度,不再是固定 40px 的零散排列 */
.icon-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}
.icon-grid .icon-btn {
  width: 100%;
  height: auto;
  aspect-ratio: 1;
}
.shape-btn,
.icon-btn {
  width: 40px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--bs-border-color);
  border-radius: var(--bs-border-radius);
  background: var(--bs-body-bg);
  color: var(--bs-body-color);
  cursor: pointer;
}
.shape-btn.active,
.icon-btn.active {
  border-color: var(--bs-primary);
  background: var(--bs-primary-bg-subtle);
}
</style>
