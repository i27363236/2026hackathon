<script setup>
// Contextual options for the gift-card editor's detail column: pen settings while drawing,
// otherwise the sticker / photo / stamp / background panel selected on the toolbar.
// 上傳自己的照片已移到工具列的獨立功能(GiftSetupView),不再擠在「捷運回憶」面板裡。
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import StampBuilder from '@/components/editor/StampBuilder.vue'
import ColorPaletteButton from '@/components/editor/ColorPaletteButton.vue'
import { STICKERS, BG_PRESETS, PEN_TOOLS } from '@/data/giftEditorPresets.js'
import { stationPhotos } from '@/data/stationPhotos.js'

const props = defineProps({
  tool: { type: String, required: true }, // 'select' | 'pen' | 'eraser'
  panel: { type: String, required: true }, // '' | 'sticker' | 'photo' | 'stamp' | 'bg'
})
const penColor = defineModel('penColor', { type: String, required: true })
const penWidth = defineModel('penWidth', { type: Number, required: true })
const penStyle = defineModel('penStyle', { type: String, required: true })
const emit = defineEmits(['add-sticker', 'add-photo', 'add-stamp', 'set-bg', 'select-pen-tool'])

// The pen rail (drawing) shows for both the pen and eraser modes. Eraser is its own tool;
// the other three are penStyle values on the 'pen' tool.
const showPenRail = computed(() => props.tool === 'pen' || props.tool === 'eraser')
const activePenTool = computed(() => (props.tool === 'eraser' ? 'eraser' : penStyle.value))
</script>

<template>
  <div class="detail-col flex-shrink-0" :class="{ 'is-pen': showPenRail }">
    <!-- pen rail: colour palette → tool icons → size slider (vertical on tablet) -->
    <div v-if="showPenRail" class="pen-rail px-2.5 py-3">
      <ColorPaletteButton v-model="penColor" :size="40" aria-label="畫筆顏色" />
      <span class="pen-divider" />
      <div class="pen-tools">
        <button
          v-for="pt in PEN_TOOLS"
          :key="pt.key"
          type="button"
          class="pen-tool-btn d-inline-flex align-items-center justify-content-center rounded-3"
          :class="{ active: activePenTool === pt.key }"
          :aria-label="pt.label"
          @click="emit('select-pen-tool', pt.key)"
        >
          <Icon :icon="pt.icon" width="24" height="24" />
        </button>
      </div>
      <span class="pen-divider" />
      <!-- brush size: the wedge behind the slider is fat where the brush is thick -->
      <div class="pen-size-wrap">
        <input
          v-model.number="penWidth"
          type="range"
          min="2"
          max="14"
          class="form-range pen-size"
          aria-label="筆刷粗細"
        />
      </div>
    </div>

    <!-- contextual panels -->
    <div v-else class="panel p-4">
      <div v-if="panel === 'sticker'" class="grid-3">
        <button
          v-for="s in STICKERS"
          :key="s"
          type="button"
          class="sticker-btn"
          @click="emit('add-sticker', s)"
        >
          {{ s }}
        </button>
      </div>

      <div v-else-if="panel === 'photo'">
        <div v-if="stationPhotos.length" class="grid-3">
          <button
            v-for="p in stationPhotos"
            :key="p.id"
            type="button"
            class="photo-btn"
            @click="emit('add-photo', p.src)"
          >
            <img :src="p.src" :alt="p.name" />
          </button>
        </div>
        <p v-else class="text-body-secondary small mb-0">車站照片即將推出，敬請期待。</p>
      </div>

      <StampBuilder v-else-if="panel === 'stamp'" @add="emit('add-stamp', $event)" />

      <div v-else-if="panel === 'bg'" class="grid-3">
        <button
          v-for="(p, i) in BG_PRESETS"
          :key="i"
          type="button"
          class="bg-swatch"
          :style="{
            background:
              p.type === 'gradient'
                ? `linear-gradient(160deg, ${p.value[0]}, ${p.value[1]})`
                : p.type === 'image'
                  ? `center/cover url(${p.value})`
                  : p.value,
          }"
          @click="emit('set-bg', p)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Pen rail — a floating pill: horizontal strip on mobile, centred vertical rail on tablet. */
.pen-rail {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: var(--bs-body-bg);
  border-radius: var(--bs-border-radius-xl);
  box-shadow: var(--bs-box-shadow-sm);
}
.pen-tools {
  display: flex;
  flex-direction: row;
  gap: 8px;
}
.pen-tool-btn {
  width: 44px;
  height: 44px;
  border: 0;
  background: transparent;
  color: var(--bs-secondary-color);
  cursor: pointer;
}
.pen-tool-btn.active {
  background: var(--bs-primary-bg-subtle);
  color: var(--bs-primary);
}
.pen-divider {
  align-self: stretch;
  width: 1px;
  background: var(--bs-border-color);
}
/* Wedge behind the size slider — fat where the brush is thick, so it reads at a glance. */
.pen-size-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 28px;
}
.pen-size-wrap::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--bs-primary-bg-subtle);
  clip-path: polygon(0 40%, 100% 0, 100% 100%, 0 60%);
}
.pen-size {
  position: relative;
  z-index: 1;
  width: 100%;
  background: transparent;
}
.pen-size::-webkit-slider-runnable-track {
  background: transparent;
}
.pen-size::-moz-range-track {
  background: transparent;
}
@media (min-width: 768px) {
  .pen-rail {
    flex-direction: column;
  }
  .pen-tools {
    flex-direction: column;
  }
  .pen-divider {
    align-self: auto;
    width: 40px;
    height: 1px;
  }
  .pen-size-wrap {
    width: 36px;
    height: 160px;
  }
  /* fat at the top → thin at the bottom */
  .pen-size-wrap::before {
    clip-path: polygon(0 0, 100% 0, 68% 100%, 32% 100%);
  }
  .pen-size {
    width: auto;
    height: 100%;
    writing-mode: vertical-lr;
    direction: rtl;
  }
}

/* 貼紙 / 照片 / 背景一律三欄,格子撐滿面板寬度、比例鎖定 */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
.grid-3 > * {
  width: 100%;
  aspect-ratio: 1;
  padding: 0;
  border: 0;
  border-radius: var(--bs-border-radius-sm);
  background: transparent;
  overflow: hidden;
}
.sticker-btn {
  font-size: 28px;
  line-height: 1;
  background: var(--bs-secondary-bg);
}
.photo-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.bg-swatch {
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
}
/* Detail menu: a bottom strip on mobile (capped + scroll)… */
.detail-col {
  border-top: 1px solid var(--bs-border-color);
  background: var(--bs-body-bg);
  max-height: 45vh;
  overflow-y: auto;
}
/* Pen mode: the rail is a floating pill, so drop the panel chrome and let the column
   shrink to the pill, centred with a gap from the screen edge. */
.detail-col.is-pen {
  border-top: 0;
  background: transparent;
  overflow: visible;
  max-height: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}
@media (min-width: 768px) {
  /* …a full-height right rail on tablet+. */
  .detail-col {
    width: 320px;
    max-height: none;
    border-top: 0;
    border-left: 1px solid var(--bs-border-color);
  }
  .detail-col.is-pen {
    width: auto;
    border-left: 0;
  }
}
</style>
