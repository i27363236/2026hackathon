<script setup>
// Gift card editor — a Konva canvas (via vue-konva) for the personalized card "note" side.
// Features: handwrite (pen), stickers, MRT station photos, custom stamps, background select.
// On finish, the canvas is flattened to a PNG dataURL and stored on the draft gift.
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
// Local vue-konva imports keep Konva in this lazy chunk (not the Home bundle).
import { Stage, Layer, Rect, Line, Text, Image, Group, Circle, Transformer } from 'vue-konva'
import StampBuilder from '../../components/editor/StampBuilder.vue'
import { useGiftsStore } from '../../stores/gifts.js'
import { stationPhotos } from '../../data/stationPhotos.js'
import { giftBackgrounds } from '../../data/giftBackgrounds.js'

const router = useRouter()
const gifts = useGiftsStore()

const STAGE_W = 300
const STAGE_H = 400
const STAMP_COLOR = '#0079a9'

const stageRef = ref(null)
const transformerRef = ref(null)

const tool = ref('select') // 'select' | 'pen'
const panel = ref('') // '' | 'sticker' | 'photo' | 'stamp' | 'bg'
const penColor = ref('#e3002c')
const penWidth = ref(4)

const bg = ref({ type: 'color', value: '#ffffff' })
const lines = ref([]) // { id, points, stroke, strokeWidth }
const items = ref([]) // { id, type, ... }
const selectedId = ref('')
const history = ref([]) // { kind: 'line' | 'item', id }

let drawing = false
let uid = 0
const nextId = (p) => `${p}-${uid++}`

const STICKERS = ['🎁', '🎀', '⭐', '❤️', '🌸', '☕', '🍰', '✨', '🎉', '🥐']
const BG_PRESETS = [
  { type: 'color', value: '#ffffff' },
  { type: 'color', value: '#ffe9ec' },
  { type: 'color', value: '#e7f7ff' },
  { type: 'color', value: '#eafbe7' },
  { type: 'gradient', value: ['#cdeefe', '#e7f7ff'] },
  { type: 'gradient', value: ['#ffd9e8', '#fff0d9'] },
  // real background assets get merged in once data/giftBackgrounds.js is populated
  ...giftBackgrounds.map((b) => ({ type: 'image', value: b.src, name: b.name })),
]

function setTool(t) {
  tool.value = t
  if (t === 'pen') selectedId.value = ''
}
function togglePanel(p) {
  panel.value = panel.value === p ? '' : p
}

// ---- background config ----
function bgConfig() {
  const base = { x: 0, y: 0, width: STAGE_W, height: STAGE_H, name: 'bg' }
  if (bg.value.type === 'gradient') {
    return {
      ...base,
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: STAGE_W, y: STAGE_H },
      fillLinearGradientColorStops: [0, bg.value.value[0], 1, bg.value.value[1]],
    }
  }
  return { ...base, fill: bg.value.type === 'color' ? bg.value.value : '#ffffff' }
}
function setBg(preset) {
  bg.value = preset
}

// ---- adding items ----
function addSticker(emoji) {
  const id = nextId('item')
  items.value.push({
    id,
    type: 'sticker',
    text: emoji,
    x: STAGE_W / 2,
    y: STAGE_H / 2,
    fontSize: 48,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
  })
  history.value.push({ kind: 'item', id })
  select(id)
}

function addStamp({ name, icon, shape }) {
  const id = nextId('item')
  items.value.push({
    id,
    type: 'stamp',
    label: name,
    icon,
    shape,
    x: STAGE_W / 2,
    y: STAGE_H / 2,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
  })
  history.value.push({ kind: 'item', id })
  panel.value = ''
  select(id)
}

function addPhoto(src) {
  const img = new window.Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    const id = nextId('item')
    const ratio = img.height / img.width
    const w = 140
    items.value.push({
      id,
      type: 'photo',
      image: img,
      x: STAGE_W / 2,
      y: STAGE_H / 2,
      width: w,
      height: w * ratio,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    })
    history.value.push({ kind: 'item', id })
    select(id)
  }
  img.src = src
}

// ---- node configs ----
const draggable = () => tool.value === 'select'

function stickerConfig(it) {
  return {
    name: it.id,
    text: it.text,
    x: it.x,
    y: it.y,
    fontSize: it.fontSize,
    rotation: it.rotation,
    scaleX: it.scaleX,
    scaleY: it.scaleY,
    offsetX: it.fontSize / 2,
    offsetY: it.fontSize / 2,
    draggable: draggable(),
  }
}
function photoConfig(it) {
  return {
    name: it.id,
    image: it.image,
    x: it.x,
    y: it.y,
    width: it.width,
    height: it.height,
    offsetX: it.width / 2,
    offsetY: it.height / 2,
    rotation: it.rotation,
    scaleX: it.scaleX,
    scaleY: it.scaleY,
    cornerRadius: 8,
    draggable: draggable(),
  }
}
function stampGroupConfig(it) {
  return {
    name: it.id,
    x: it.x,
    y: it.y,
    offsetX: 45,
    offsetY: 45,
    rotation: it.rotation,
    scaleX: it.scaleX,
    scaleY: it.scaleY,
    draggable: draggable(),
  }
}
function stampShapeConfig(it) {
  if (it.shape === 'circle') {
    return { x: 45, y: 45, radius: 42, fill: STAMP_COLOR, stroke: '#ffffff', strokeWidth: 3 }
  }
  return {
    x: 4,
    y: 4,
    width: 82,
    height: 82,
    fill: STAMP_COLOR,
    stroke: '#ffffff',
    strokeWidth: 3,
    cornerRadius: it.shape === 'badge' ? 18 : 4,
  }
}
const stampIconConfig = (it) => ({
  text: it.icon,
  x: 0,
  y: 20,
  width: 90,
  align: 'center',
  fontSize: 28,
})
const stampLabelConfig = (it) => ({
  text: it.label,
  x: 0,
  y: 52,
  width: 90,
  align: 'center',
  fontSize: 13,
  fontStyle: 'bold',
  fill: '#ffffff',
})

// ---- selection / transformer ----
function select(id) {
  if (tool.value !== 'select') return
  selectedId.value = id
  nextTick(() => {
    const stage = stageRef.value?.getStage()
    const tr = transformerRef.value?.getNode()
    if (!stage || !tr) return
    const node = id ? stage.findOne('.' + id) : null
    tr.nodes(node ? [node] : [])
    tr.getLayer()?.batchDraw()
  })
}

function persistTransform(it, e) {
  const n = e.target
  it.x = n.x()
  it.y = n.y()
  it.rotation = n.rotation()
  it.scaleX = n.scaleX()
  it.scaleY = n.scaleY()
}

function removeSelected() {
  if (!selectedId.value) return
  const id = selectedId.value
  items.value = items.value.filter((i) => i.id !== id)
  lines.value = lines.value.filter((l) => l.id !== id)
  history.value = history.value.filter((h) => h.id !== id)
  select('')
}

function undo() {
  const last = history.value.pop()
  if (!last) return
  if (last.kind === 'line') lines.value = lines.value.filter((l) => l.id !== last.id)
  else items.value = items.value.filter((i) => i.id !== last.id)
  if (selectedId.value === last.id) select('')
}

// ---- stage pointer (drawing + deselect) ----
function onStageDown(e) {
  const stage = e.target.getStage()
  if (tool.value === 'pen') {
    drawing = true
    const pos = stage.getPointerPosition()
    const id = nextId('line')
    lines.value.push({ id, points: [pos.x, pos.y], stroke: penColor.value, strokeWidth: penWidth.value })
    history.value.push({ kind: 'line', id })
    return
  }
  // select tool: clicking empty space deselects
  if (e.target === stage || e.target.name() === 'bg') select('')
}
function onStageMove(e) {
  if (!drawing) return
  const pos = e.target.getStage().getPointerPosition()
  const line = lines.value[lines.value.length - 1]
  line.points = line.points.concat([pos.x, pos.y])
}
function onStageUp() {
  drawing = false
}

// ---- finish: flatten to PNG and continue ----
async function done() {
  select('')
  await nextTick()
  const stage = stageRef.value?.getStage()
  if (stage) {
    const dataUrl = stage.toDataURL({ pixelRatio: 2 })
    gifts.attachCardImage(dataUrl)
    gifts.updateDraft({ background: JSON.stringify(bg.value) })
  }
  router.push({ name: 'use-gift-preview' })
}
</script>

<template>
  <div class="gift-editor d-flex flex-column h-100">
    <!-- canvas -->
    <div class="canvas-area flex-grow-1 overflow-auto d-flex align-items-center justify-content-center p-5" style="min-height: 0">
      <div class="stage-frame rounded-4 shadow-sm overflow-hidden">
        <Stage
          ref="stageRef"
          :config="{ width: STAGE_W, height: STAGE_H }"
          @mousedown="onStageDown"
          @touchstart="onStageDown"
          @mousemove="onStageMove"
          @touchmove="onStageMove"
          @mouseup="onStageUp"
          @touchend="onStageUp"
        >
          <Layer>
            <Rect :config="bgConfig()" />

            <Line
              v-for="l in lines"
              :key="l.id"
              :config="{
                points: l.points,
                stroke: l.stroke,
                strokeWidth: l.strokeWidth,
                lineCap: 'round',
                lineJoin: 'round',
                tension: 0.4,
              }"
            />

            <template v-for="it in items" :key="it.id">
              <Text
                v-if="it.type === 'sticker'"
                :config="stickerConfig(it)"
                @click="select(it.id)"
                @tap="select(it.id)"
                @dragend="persistTransform(it, $event)"
                @transformend="persistTransform(it, $event)"
              />
              <Image
                v-else-if="it.type === 'photo'"
                :config="photoConfig(it)"
                @click="select(it.id)"
                @tap="select(it.id)"
                @dragend="persistTransform(it, $event)"
                @transformend="persistTransform(it, $event)"
              />
              <Group
                v-else-if="it.type === 'stamp'"
                :config="stampGroupConfig(it)"
                @click="select(it.id)"
                @tap="select(it.id)"
                @dragend="persistTransform(it, $event)"
                @transformend="persistTransform(it, $event)"
              >
                <Circle v-if="it.shape === 'circle'" :config="stampShapeConfig(it)" />
                <Rect v-else :config="stampShapeConfig(it)" />
                <Text :config="stampIconConfig(it)" />
                <Text :config="stampLabelConfig(it)" />
              </Group>
            </template>

            <Transformer ref="transformerRef" :config="{ rotateEnabled: true, borderStroke: '#0079a9' }" />
          </Layer>
        </Stage>
      </div>
    </div>

    <!-- bottom control stack (sticky together) -->
    <div class="editor-controls">
    <!-- contextual panels -->
    <div v-if="panel" class="panel border-top bg-body p-4 flex-shrink-0">
      <div v-if="panel === 'sticker'" class="d-flex gap-2 flex-wrap">
        <button
          v-for="s in STICKERS"
          :key="s"
          type="button"
          class="sticker-btn btn btn-outline-secondary btn-sm"
          @click="addSticker(s)"
        >
          {{ s }}
        </button>
      </div>

      <div v-else-if="panel === 'photo'">
        <div v-if="stationPhotos.length" class="d-flex gap-2 flex-wrap">
          <button
            v-for="p in stationPhotos"
            :key="p.id"
            type="button"
            class="btn btn-outline-secondary btn-sm p-1"
            @click="addPhoto(p.src)"
          >
            <img :src="p.src" :alt="p.name" width="56" height="56" style="object-fit: cover" />
          </button>
        </div>
        <p v-else class="text-body-secondary small mb-0">車站照片即將推出，敬請期待。</p>
      </div>

      <StampBuilder v-else-if="panel === 'stamp'" @add="addStamp" />

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
          @click="setBg(p)"
        />
      </div>
    </div>

    <!-- pen options -->
    <div v-if="tool === 'pen'" class="panel border-top bg-body px-4 py-3 d-flex align-items-center gap-3 flex-shrink-0">
      <span class="small fw-bold">畫筆</span>
      <input v-model="penColor" type="color" class="form-control form-control-color form-control-sm p-0 border-0" />
      <input v-model.number="penWidth" type="range" min="2" max="14" class="form-range flex-grow-1" />
    </div>

    <!-- toolbar -->
    <div class="toolbar border-top bg-white d-flex align-items-center justify-content-between px-3 py-2 flex-shrink-0">
      <div class="d-flex align-items-center gap-1">
        <button type="button" class="tool btn btn-sm" :class="tool === 'select' ? 'btn-primary' : 'btn-light'" @click="setTool('select')" title="選取">
          <Icon icon="ph:cursor-light" width="20" height="20" />
        </button>
        <button type="button" class="tool btn btn-sm" :class="tool === 'pen' ? 'btn-primary' : 'btn-light'" @click="setTool('pen')" title="手寫">
          <Icon icon="ph:pencil-simple-light" width="20" height="20" />
        </button>
        <button type="button" class="tool btn btn-sm btn-light" :class="{ active: panel === 'sticker' }" @click="togglePanel('sticker')" title="貼紙">
          <Icon icon="ph:sticker-light" width="20" height="20" />
        </button>
        <button type="button" class="tool btn btn-sm btn-light" :class="{ active: panel === 'photo' }" @click="togglePanel('photo')" title="車站照片">
          <Icon icon="ph:image-light" width="20" height="20" />
        </button>
        <button type="button" class="tool btn btn-sm btn-light" :class="{ active: panel === 'stamp' }" @click="togglePanel('stamp')" title="印章">
          <Icon icon="ph:seal-light" width="20" height="20" />
        </button>
        <button type="button" class="tool btn btn-sm btn-light" :class="{ active: panel === 'bg' }" @click="togglePanel('bg')" title="背景">
          <Icon icon="ph:paint-bucket-light" width="20" height="20" />
        </button>
      </div>
      <div class="d-flex align-items-center gap-1">
        <button type="button" class="tool btn btn-sm btn-light" :disabled="!history.length" @click="undo" title="復原">
          <Icon icon="ph:arrow-counter-clockwise-light" width="20" height="20" />
        </button>
        <button type="button" class="tool btn btn-sm btn-light text-danger" :disabled="!selectedId" @click="removeSelected" title="刪除">
          <Icon icon="ph:trash-light" width="20" height="20" />
        </button>
      </div>
    </div>

    <!-- footer -->
    <div class="footer border-top bg-body p-4 flex-shrink-0">
      <div class="d-flex gap-3 mx-auto" style="max-width: 880px">
        <button type="button" class="btn btn-outline-secondary flex-fill rounded-pill py-2" @click="router.back()">
          上一步
        </button>
        <button type="button" class="btn btn-primary flex-fill rounded-pill py-2" @click="done">
          完成
        </button>
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
.stage-frame {
  width: 300px;
  height: 400px;
  background: #fff;
}
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
.tool.active {
  background: var(--bs-primary-bg-subtle);
}
.footer {
  position: static;
}
/* All bottom bars stick together to the scroll container's bottom, so none gets pushed
   below the fold by AppLayout's content spacer. */
.editor-controls {
  position: sticky;
  bottom: 0;
  z-index: 5;
  background: var(--bs-body-bg);
}
.footer {
  position: sticky;
  bottom: 0;
}
</style>
