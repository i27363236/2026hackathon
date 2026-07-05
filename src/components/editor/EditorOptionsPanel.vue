<script setup>
// Contextual options for the gift-card editor's detail column: pen settings while drawing,
// otherwise the sticker / photo / stamp / background panel selected on the toolbar.
import { Icon } from '@iconify/vue'
import StampBuilder from '@/components/editor/StampBuilder.vue'
import { STICKERS, BG_PRESETS } from '@/data/giftEditorPresets.js'
import { stationPhotos } from '@/data/stationPhotos.js'

defineProps({
  tool: { type: String, required: true }, // 'select' | 'pen'
  panel: { type: String, required: true }, // '' | 'sticker' | 'photo' | 'stamp' | 'bg'
})
const penColor = defineModel('penColor', { type: String, required: true })
const penWidth = defineModel('penWidth', { type: Number, required: true })
const emit = defineEmits(['add-sticker', 'add-photo', 'add-stamp', 'set-bg'])

// User uploads their own photo from the device (捷運回憶 panel).
function onPhotoUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => emit('add-photo', reader.result)
  reader.readAsDataURL(file)
  e.target.value = '' // allow re-selecting the same file
}
</script>

<template>
  <div class="detail-col flex-shrink-0">
    <!-- pen options -->
    <div v-if="tool === 'pen'" class="px-4 py-3 d-flex align-items-center gap-3">
      <span class="small fw-bold">畫筆</span>
      <input v-model="penColor" type="color" class="form-control form-control-color form-control-sm p-0 border-0" />
      <input v-model.number="penWidth" type="range" min="2" max="14" class="form-range flex-grow-1" />
    </div>

    <!-- contextual panels -->
    <div v-else class="panel p-4">
      <div v-if="panel === 'sticker'" class="d-flex gap-2 flex-wrap">
        <button
          v-for="s in STICKERS"
          :key="s"
          type="button"
          class="sticker-btn btn btn-outline-secondary btn-sm"
          @click="emit('add-sticker', s)"
        >
          {{ s }}
        </button>
      </div>

      <div v-else-if="panel === 'photo'">
        <label class="btn btn-outline-primary btn-sm rounded-pill w-100 mb-2 d-inline-flex align-items-center justify-content-center gap-2">
          <Icon icon="ph:upload-simple-light" width="20" height="20" />
          上傳自己的照片
          <input type="file" accept="image/*" class="d-none" @change="onPhotoUpload" />
        </label>
        <div v-if="stationPhotos.length" class="d-flex gap-2 flex-wrap">
          <button
            v-for="p in stationPhotos"
            :key="p.id"
            type="button"
            class="btn btn-outline-secondary btn-sm p-1"
            @click="emit('add-photo', p.src)"
          >
            <img :src="p.src" :alt="p.name" width="56" height="56" style="object-fit: cover" />
          </button>
        </div>
        <p v-else class="text-body-secondary small mb-0">車站照片即將推出，敬請期待。</p>
      </div>

      <StampBuilder v-else-if="panel === 'stamp'" @add="emit('add-stamp', $event)" />

      <div v-else-if="panel === 'bg'" class="d-flex gap-2 flex-wrap">
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
.sticker-btn {
  font-size: 22px;
  width: 44px;
  line-height: 1;
}
.bg-swatch {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: 1px solid var(--bs-gray-300);
  padding: 0;
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
