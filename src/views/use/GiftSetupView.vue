<script setup>
// Gift card editor — a Konva canvas (via vue-konva) for the personalized card "note" side.
// Features: handwrite (pen), stickers, MRT station photos, custom stamps, background select.
// On finish, the canvas is flattened to a PNG dataURL and stored on the draft gift.
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon, loadIcon } from '@iconify/vue'
// Local vue-konva imports keep Konva in this lazy chunk (not the Home bundle).
import { Stage, Layer, Rect, Line, Text, Image, Group, Path, Transformer } from 'vue-konva'
import StampBuilder from '@/components/editor/StampBuilder.vue'
import EditToolbar from '@/components/editor/EditToolbar.vue'
import ToolbarButton from '@/components/ToolbarButton.vue'
import { SHAPE_BY_KEY } from '@/components/editor/stampShapes.js'
import { useGiftsStore } from '@/stores/gifts.js'
import { stationPhotos } from '@/data/stationPhotos.js'
import { giftBackgrounds } from '@/data/giftBackgrounds.js'

const router = useRouter()
const gifts = useGiftsStore()

const STAGE_W = 300
const STAGE_H = 450 // 2:3, matching the Figma postcard (316×474) and the bg assets
// Konva needs a literal color string — read the brand primary from the CSS tokens.
const STAMP_COLOR =
  getComputedStyle(document.documentElement).getPropertyValue('--bs-primary').trim() || '#0079a9'

const stageRef = ref(null)
const transformerRef = ref(null)

// Gate the Teleport until the shell's TopToolbar (#top-toolbar-actions) is in
// the document — on first load it isn't committed yet when this view mounts.
const toolbarReady = ref(false)
onMounted(async () => {
  await nextTick()
  toolbarReady.value = true
})

const tool = ref('select') // 'select' | 'pen'
const panel = ref('') // '' | 'sticker' | 'photo' | 'stamp' | 'bg'
const penColor = ref('#e3002c')
const penWidth = ref(4)

const bg = ref({ type: 'color', value: '#ffffff' })
const bgImage = ref(null) // loaded HTMLImageElement when bg.type === 'image'
const lines = ref([]) // { id, points, stroke, strokeWidth }
const items = ref([]) // { id, type, ... }
const selectedId = ref('')
// Undo/redo: each entry is { op: 'add' | 'del', kind: 'line' | 'item', data } holding the
// full object so a redo can restore it. A new action clears the redo stack.
const undoStack = ref([])
const redoStack = ref([])
function pushUndo(entry) {
  undoStack.value.push(entry)
  redoStack.value = []
}

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

// Toolbar config consumed by EditToolbar. 'select'/'pen' switch the drawing
// tool; the rest toggle a contextual options panel.
const TOOLS = [
  { key: 'select', icon: 'ph:cursor-light', label: '選取' },
  { key: 'pen', icon: 'ph:pencil-simple-light', label: '塗鴉' },
  { key: 'photo', icon: 'ph:subway-light', label: '捷運回憶' },
  { key: 'sticker', icon: 'ph:sticker-light', label: '貼紙' },
  { key: 'stamp', icon: 'ph:seal-light', label: '印章' },
  { key: 'bg', icon: 'ph:paint-bucket-light', label: '背景' },
]

// Which toolbar key reads as active: an open panel wins, otherwise the tool.
const activeTool = computed(() => panel.value || tool.value)
// Show the options strip when drawing with the pen or when a panel is open.
const showOptions = computed(() => tool.value === 'pen' || panel.value !== '')

function setTool(t) {
  tool.value = t
  if (t === 'pen') selectedId.value = ''
}
function togglePanel(p) {
  panel.value = panel.value === p ? '' : p
}

function onToolSelect(key) {
  if (key === 'select' || key === 'pen') {
    panel.value = ''
    setTool(key)
  } else {
    tool.value = 'select'
    togglePanel(key)
  }
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
// Image backgrounds are drawn as a full-stage Konva Image (so they export with the card).
function bgImageConfig() {
  return { x: 0, y: 0, width: STAGE_W, height: STAGE_H, image: bgImage.value, name: 'bg' }
}
function setBg(preset) {
  bg.value = preset
  if (preset.type === 'image') {
    const img = new window.Image()
    img.onload = () => {
      // Ignore if the user has since picked a different background.
      if (bg.value.type === 'image' && bg.value.value === preset.value) bgImage.value = img
    }
    img.src = preset.value
  } else {
    bgImage.value = null
  }
}

// ---- adding items ----
function addSticker(emoji) {
  const id = nextId('item')
  const item = {
    id,
    type: 'sticker',
    text: emoji,
    x: STAGE_W / 2,
    y: STAGE_H / 2,
    fontSize: 48,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
  }
  items.value.push(item)
  pushUndo({ op: 'add', kind: 'item', data: item })
  select(id)
}

// Load an SVG string into a (tinted) HTMLImageElement so it can live on the Konva
// canvas and export with the card.
function svgToImage(svg) {
  return new Promise((resolve) => {
    const img = new window.Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
  })
}

// Rasterize a stampIcons registry entry, tinted to `color`. Handles Phosphor icons
// ('ph', + weight suffix), tintable custom SVG ('svg'), and raster images ('img').
async function iconToImage(entry, color, weight) {
  try {
    if (entry.type === 'svg') {
      return await svgToImage(entry.src.replace(/currentColor/g, color))
    }
    if (entry.type === 'img') {
      const img = new window.Image()
      img.crossOrigin = 'anonymous'
      return await new Promise((resolve) => {
        img.onload = () => resolve(img)
        img.onerror = () => resolve(null)
        img.src = entry.src
      })
    }
    const name = `ph:${entry.name}${weight === 'regular' ? '' : `-${weight}`}`
    const d = await loadIcon(name)
    const body = d.body.replace(/currentColor/g, color)
    return await svgToImage(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${d.width}" height="${d.height}" viewBox="0 0 ${d.width} ${d.height}">${body}</svg>`,
    )
  } catch {
    return null
  }
}

async function addStamp({ name, icon, shape, color, weight }) {
  const iconImage = await iconToImage(icon, color, weight)
  const id = nextId('item')
  const item = {
    id,
    type: 'stamp',
    label: name,
    color,
    iconImage,
    shape,
    x: STAGE_W / 2,
    y: STAGE_H / 2,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
  }
  items.value.push(item)
  pushUndo({ op: 'add', kind: 'item', data: item })
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
    const item = {
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
    }
    items.value.push(item)
    pushUndo({ op: 'add', kind: 'item', data: item })
    select(id)
  }
  img.src = src
}

// User uploads their own photo from the device (捷運回憶 panel).
function onPhotoUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => addPhoto(reader.result)
  reader.readAsDataURL(file)
  e.target.value = '' // allow re-selecting the same file
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
// Stamp geometry is authored in a 100×100 box (see stampShapes.js); the group is
// offset by 50 so it rotates/scales around its centre.
function stampGroupConfig(it) {
  return {
    name: it.id,
    x: it.x,
    y: it.y,
    offsetX: 50,
    offsetY: 50,
    rotation: it.rotation,
    scaleX: it.scaleX,
    scaleY: it.scaleY,
    draggable: draggable(),
  }
}
// Invisible hit area so the transparent interior is still clickable/draggable.
const stampHitConfig = () => ({ x: 0, y: 0, width: 100, height: 100, fill: '#000', opacity: 0 })
// Outlined frame: stamp colour on the stroke, transparent fill.
const stampFrameConfig = (it) => ({
  data: (SHAPE_BY_KEY[it.shape] || SHAPE_BY_KEY.circle).d,
  stroke: it.color,
  strokeWidth: 2,
  lineJoin: 'round',
})
const stampIconConfig = (it) => ({
  image: it.iconImage,
  x: 34,
  y: 26,
  width: 32,
  height: 32,
})
const stampLabelConfig = (it) => ({
  text: it.label,
  x: 0,
  y: 62,
  width: 100,
  align: 'center',
  fontSize: 13,
  fontStyle: 'bold',
  fill: it.color,
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
  const item = items.value.find((i) => i.id === id)
  const line = lines.value.find((l) => l.id === id)
  if (item) {
    items.value = items.value.filter((i) => i.id !== id)
    pushUndo({ op: 'del', kind: 'item', data: item })
  } else if (line) {
    lines.value = lines.value.filter((l) => l.id !== id)
    pushUndo({ op: 'del', kind: 'line', data: line })
  }
  select('')
}

// undo/redo share the same two primitives: removeData undoes an add / redoes a delete;
// addData undoes a delete / redoes an add.
function removeData(entry) {
  if (entry.kind === 'line') lines.value = lines.value.filter((l) => l.id !== entry.data.id)
  else items.value = items.value.filter((i) => i.id !== entry.data.id)
  if (selectedId.value === entry.data.id) select('')
}
function addData(entry) {
  if (entry.kind === 'line') lines.value.push(entry.data)
  else items.value.push(entry.data)
}
function undo() {
  const entry = undoStack.value.pop()
  if (!entry) return
  if (entry.op === 'add') removeData(entry)
  else addData(entry)
  redoStack.value.push(entry)
}
function redo() {
  const entry = redoStack.value.pop()
  if (!entry) return
  if (entry.op === 'add') addData(entry)
  else removeData(entry)
  undoStack.value.push(entry)
}

// ---- stage pointer (drawing + deselect) ----
function onStageDown(e) {
  const stage = e.target.getStage()
  if (tool.value === 'pen') {
    drawing = true
    const pos = stage.getPointerPosition()
    const id = nextId('line')
    lines.value.push({ id, points: [pos.x, pos.y], stroke: penColor.value, strokeWidth: penWidth.value })
    redoStack.value = [] // a fresh stroke invalidates the redo stack
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
  if (drawing) {
    // Record the completed stroke as one undoable unit.
    const line = lines.value[lines.value.length - 1]
    if (line) undoStack.value.push({ op: 'add', kind: 'line', data: line })
  }
  drawing = false
}

// ---- finish: flatten to PNG and continue ----
async function done() {
  select('')
  await nextTick()
  const stage = stageRef.value?.getStage()
  if (stage) {
    gifts.ensureDraft() // editor may be opened without a seeded draft (e.g. 送禮 nav)
    const dataUrl = stage.toDataURL({ pixelRatio: 2 })
    gifts.attachCardImage(dataUrl)
    gifts.updateDraft({ background: JSON.stringify(bg.value) })
  }
  router.push({ name: 'use-gift-preview' })
}
</script>

<template>
  <div class="gift-editor d-flex flex-column h-100 position-relative">
    <!-- Top-toolbar actions injected into the app shell's TopToolbar: 復原 + 完成. -->
    <Teleport v-if="toolbarReady" to="#top-toolbar-actions">
      <ToolbarButton
        icon="ph:arrow-counter-clockwise-light"
        aria-label="復原"
        :disabled="!undoStack.length"
        @click="undo"
      />
      <ToolbarButton
        icon="ph:arrow-clockwise-light"
        aria-label="重做"
        :disabled="!redoStack.length"
        @click="redo"
      />
      <ToolbarButton icon="ph:check-light" aria-label="完成" accent @click="done" />
    </Teleport>

    <!-- stage row: tablet → [toolbar rail | canvas | detail menu]; mobile → stacked -->
    <div class="editor-stage flex-grow-1" style="min-height: 0">
      <div class="toolbar-col d-none d-md-flex flex-shrink-0">
        <EditToolbar
          orientation="vertical"
          :tools="TOOLS"
          :active="activeTool"
          @select="onToolSelect"
        />
      </div>

      <!-- canvas -->
      <div class="canvas-area position-relative flex-grow-1 overflow-auto d-flex align-items-center justify-content-center p-5" style="min-height: 0">
        <!-- contextual delete: icon-only, pinned to the top of the card while selecting -->
        <button
          v-if="selectedId"
          type="button"
          class="delete-fab btn btn-danger rounded-circle d-inline-flex align-items-center justify-content-center p-0"
          aria-label="刪除"
          @click="removeSelected"
        >
          <Icon icon="ph:trash-light" width="24" height="24" />
        </button>
        <div class="stage-frame rounded-1 shadow-sm overflow-hidden">
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
            <Image v-if="bg.type === 'image' && bgImage" :config="bgImageConfig()" />
            <Rect v-else :config="bgConfig()" />

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
                <Rect :config="stampHitConfig()" />
                <Path :config="stampFrameConfig(it)" />
                <Image v-if="it.iconImage" :config="stampIconConfig(it)" />
                <Text :config="stampLabelConfig(it)" />
              </Group>
            </template>

            <Transformer ref="transformerRef" :config="{ rotateEnabled: true, borderStroke: STAMP_COLOR }" />
          </Layer>
        </Stage>
        </div>
      </div>

      <!-- detail menu: right column on tablet (full height), bottom strip on mobile -->
      <div v-if="showOptions" class="detail-col flex-shrink-0">
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
          @click="addSticker(s)"
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
      </div>
    </div>

    <!-- mobile toolbar (bottom) -->
    <div class="mobile-toolbar d-md-none border-top bg-white px-3 py-2 flex-shrink-0">
      <EditToolbar
        orientation="horizontal"
        :tools="TOOLS"
        :active="activeTool"
        @select="onToolSelect"
      />
    </div>
  </div>
</template>

<style scoped>
.stage-frame {
  width: 300px;
  height: 450px;
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
/* Floating delete button, pinned to the top of the canvas while selecting. */
.delete-fab {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 44px;
  height: 44px;
  box-shadow: var(--bs-box-shadow);
}

/* Stage row: stacked on mobile, three columns (toolbar | canvas | detail) on tablet+. */
.editor-stage {
  display: flex;
  flex-direction: column;
}
.toolbar-col {
  background: var(--bs-secondary-bg);
}
/* Detail menu: a bottom strip on mobile (capped + scroll)… */
.detail-col {
  border-top: 1px solid var(--bs-border-color);
  background: var(--bs-body-bg);
  max-height: 45vh;
  overflow-y: auto;
}
@media (min-width: 768px) {
  .editor-stage {
    flex-direction: row;
  }
  /* …a full-height right rail on tablet+. */
  .detail-col {
    width: 320px;
    max-height: none;
    border-top: 0;
    border-left: 1px solid var(--bs-border-color);
  }
}
</style>
