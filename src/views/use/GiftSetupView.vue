<script setup>
// Gift card editor — orchestrates the Konva canvas (GiftCanvas) and its options panel
// (EditorOptionsPanel), owning tool/panel state, item creation and undo history.
// On finish, the canvas is flattened to a PNG dataURL and stored on the draft gift.
// Konva lives inside GiftCanvas so it stays in this lazy chunk (not the Home bundle).
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon, loadIcon } from '@iconify/vue'
import EditToolbar from '@/components/editor/EditToolbar.vue'
import GiftCanvas from '@/components/editor/GiftCanvas.vue'
import EditorOptionsPanel from '@/components/editor/EditorOptionsPanel.vue'
import ToolbarButton from '@/components/ToolbarButton.vue'
import { TOOLS } from '@/data/giftEditorPresets.js'
import { useUndoHistory } from '@/composables/useUndoHistory.js'
import { useGiftsStore } from '@/stores/gifts.js'

const STAGE_W = 300
const STAGE_H = 450

const router = useRouter()
const gifts = useGiftsStore()

const canvasRef = ref(null)

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
const penStyle = ref('pen') // 'pen' | 'highlighter'

// 上傳照片是工具列的獨立功能(不開面板)— 直接叫出裝置的檔案選擇器。
const fileInput = ref(null)
function onPhotoUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => addPhoto(reader.result)
  reader.readAsDataURL(file)
  e.target.value = '' // 讓同一張照片可以再選一次
}

const bg = ref({ type: 'color', value: '#ffffff' })
const bgImage = ref(null) // loaded HTMLImageElement when bg.type === 'image'
const lines = ref([]) // { id, points, stroke, strokeWidth }
const items = ref([]) // { id, type, ... }
const selectedId = ref('')

let uid = 0
const nextId = (p) => `${p}-${uid++}`

// ---- undo/redo ----
// removeData undoes an add / redoes a delete; addData undoes a delete / redoes an add.
function removeData(entry) {
  if (entry.kind === 'line') lines.value = lines.value.filter((l) => l.id !== entry.data.id)
  else items.value = items.value.filter((i) => i.id !== entry.data.id)
  if (selectedId.value === entry.data.id) select('')
}
function addData(entry) {
  if (entry.kind === 'line') lines.value.push(entry.data)
  else items.value.push(entry.data)
}
const { undoStack, redoStack, pushUndo, undo, redo } = useUndoHistory({ add: addData, remove: removeData })

function onLineCommitted(line) {
  pushUndo({ op: 'add', kind: 'line', data: line })
}

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
  if (key === 'upload') {
    fileInput.value?.click()
  } else if (key === 'select' || key === 'pen') {
    panel.value = ''
    setTool(key)
  } else {
    tool.value = 'select'
    togglePanel(key)
  }
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

// ---- selection ----
function select(id) {
  if (tool.value !== 'select') return
  selectedId.value = id
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

// ---- finish: flatten to PNG and continue ----
async function done() {
  select('')
  await nextTick()
  const dataUrl = canvasRef.value?.toDataURL({ pixelRatio: 2 })
  if (dataUrl) {
    gifts.ensureDraft() // editor may be opened without a seeded draft (e.g. 送禮 nav)
    gifts.attachCardImage(dataUrl)
    gifts.updateDraft({ background: JSON.stringify(bg.value) })
  }
  router.push({ name: 'use-gift-preview' })
}
</script>

<template>
  <div class="gift-editor d-flex flex-column h-100 position-relative">
    <!-- 工具列「上傳照片」用的隱藏檔案選擇器 -->
    <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="onPhotoUpload" />

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
      <div class="toolbar-col d-none d-md-flex justify-content-center align-items-center flex-shrink-0 ps-4 pe-2.5">
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
        <GiftCanvas
          ref="canvasRef"
          v-model:lines="lines"
          :bg="bg"
          :bg-image="bgImage"
          :items="items"
          :tool="tool"
          :selected-id="selectedId"
          :pen-color="penColor"
          :pen-width="penWidth"
          :pen-style="penStyle"
          @select="select"
          @line-committed="onLineCommitted"
        />
      </div>

      <!-- detail menu: right column on tablet (full height), bottom strip on mobile -->
      <EditorOptionsPanel
        v-if="showOptions"
        :tool="tool"
        :panel="panel"
        v-model:pen-color="penColor"
        v-model:pen-width="penWidth"
        v-model:pen-style="penStyle"
        @add-sticker="addSticker"
        @add-photo="addPhoto"
        @add-stamp="addStamp"
        @set-bg="setBg"
      />
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

@media (min-width: 768px) {
  .editor-stage {
    flex-direction: row;
  }
}
</style>
