<script setup>
// Contextual options for the gift-card editor's detail column: pen settings while drawing,
// otherwise the sticker / photo / stamp / background panel selected on the toolbar.
// 上傳自己的照片已移到工具列的獨立功能(GiftSetupView),不再擠在「捷運回憶」面板裡。
import StampBuilder from '@/components/editor/StampBuilder.vue'
import { STICKERS, BG_PRESETS } from '@/data/giftEditorPresets.js'
import { stationPhotos } from '@/data/stationPhotos.js'

defineProps({
  tool: { type: String, required: true }, // 'select' | 'pen'
  panel: { type: String, required: true }, // '' | 'sticker' | 'photo' | 'stamp' | 'bg'
})
const penColor = defineModel('penColor', { type: String, required: true })
const penWidth = defineModel('penWidth', { type: Number, required: true })
const penStyle = defineModel('penStyle', { type: String, required: true })
const emit = defineEmits(['add-sticker', 'add-photo', 'add-stamp', 'set-bg'])
</script>

<template>
  <div class="detail-col flex-shrink-0">
    <!-- pen options -->
    <div v-if="tool === 'pen'" class="px-4 py-3">
      <div class="d-flex align-items-center gap-3">
        <span class="small fw-bold text-nowrap">畫筆</span>
        <input v-model="penColor" type="color" class="form-control form-control-color form-control-sm p-0 border-0" />
        <input v-model.number="penWidth" type="range" min="2" max="14" class="form-range flex-grow-1" />
      </div>
      <div class="d-flex gap-2 mt-3">
        <button
          type="button"
          class="btn btn-sm flex-fill"
          :class="penStyle === 'pen' ? 'btn-primary' : 'btn-outline-dark'"
          @click="penStyle = 'pen'"
        >
          一般筆
        </button>
        <button
          type="button"
          class="btn btn-sm flex-fill"
          :class="penStyle === 'highlighter' ? 'btn-primary' : 'btn-outline-dark'"
          @click="penStyle = 'highlighter'"
        >
          螢光筆
        </button>
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
@media (min-width: 768px) {
  /* …a full-height right rail on tablet+. */
  .detail-col {
    width: 320px;
    max-height: none;
    border-top: 0;
    border-left: 1px solid var(--bs-border-color);
  }
}
</style>
