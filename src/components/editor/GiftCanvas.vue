<script setup>
// Konva canvas for the gift-card editor. Owns the Stage/Layer/Transformer, all node-config
// functions, pointer handlers (drawing + deselect) and selection→transformer wiring.
// Kept in this lazy view's chunk so Konva never lands in the Home bundle.
import { ref, watch, nextTick } from 'vue'
import { Stage, Layer, Rect, Line, Text, Image, Group, Path, Transformer } from 'vue-konva'
import { SHAPE_BY_KEY } from '@/components/editor/stampShapes.js'

const STAGE_W = 300
const STAGE_H = 450 // 2:3, matching the Figma postcard (316×474) and the bg assets
// Konva needs a literal color string — read the brand primary from the CSS tokens.
const STAMP_COLOR =
  getComputedStyle(document.documentElement).getPropertyValue('--bs-primary').trim() || '#0079a9'

const props = defineProps({
  bg: { type: Object, required: true },
  bgImage: { type: Object, default: null }, // loaded HTMLImageElement when bg.type === 'image'
  items: { type: Array, required: true },
  tool: { type: String, required: true }, // 'select' | 'pen'
  selectedId: { type: String, default: '' },
  penColor: { type: String, required: true },
  penWidth: { type: Number, required: true },
  penStyle: { type: String, default: 'pen' }, // 'pen' | 'highlighter'
})

// 螢光筆:半透明、方頭、加粗,並用 multiply 疊色 — 疊到一起會變深,像真的螢光筆。
function lineConfig(l) {
  const highlight = l.style === 'highlighter'
  return {
    points: l.points,
    stroke: l.stroke,
    strokeWidth: highlight ? l.strokeWidth * 3 : l.strokeWidth,
    lineCap: highlight ? 'square' : 'round',
    lineJoin: 'round',
    tension: highlight ? 0 : 0.4,
    opacity: highlight ? 0.4 : 1,
    globalCompositeOperation: highlight ? 'multiply' : 'source-over',
  }
}
const lines = defineModel('lines', { type: Array, required: true })
const emit = defineEmits(['select', 'line-committed'])

const stageRef = ref(null)
const transformerRef = ref(null)

let drawing = false
let lineUid = 0

// ---- background config ----
function bgConfig() {
  const base = { x: 0, y: 0, width: STAGE_W, height: STAGE_H, name: 'bg' }
  if (props.bg.type === 'gradient') {
    return {
      ...base,
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: STAGE_W, y: STAGE_H },
      fillLinearGradientColorStops: [0, props.bg.value[0], 1, props.bg.value[1]],
    }
  }
  return { ...base, fill: props.bg.type === 'color' ? props.bg.value : '#ffffff' }
}
// Image backgrounds are drawn as a full-stage Konva Image (so they export with the card).
function bgImageConfig() {
  return { x: 0, y: 0, width: STAGE_W, height: STAGE_H, image: props.bgImage, name: 'bg' }
}

// ---- node configs ----
const draggable = () => props.tool === 'select'

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
// Sync the transformer to the selected node whenever selection or the item set changes.
watch(
  () => [props.selectedId, props.items.length],
  () => {
    nextTick(() => {
      const stage = stageRef.value?.getStage()
      const tr = transformerRef.value?.getNode()
      if (!stage || !tr) return
      const node = props.selectedId ? stage.findOne('.' + props.selectedId) : null
      tr.nodes(node ? [node] : [])
      tr.getLayer()?.batchDraw()
    })
  },
)

function persistTransform(it, e) {
  const n = e.target
  it.x = n.x()
  it.y = n.y()
  it.rotation = n.rotation()
  it.scaleX = n.scaleX()
  it.scaleY = n.scaleY()
}

// ---- stage pointer (drawing + deselect) ----
function onStageDown(e) {
  const stage = e.target.getStage()
  if (props.tool === 'pen') {
    drawing = true
    const pos = stage.getPointerPosition()
    lines.value.push({
      id: `line-${lineUid++}`,
      points: [pos.x, pos.y],
      stroke: props.penColor,
      strokeWidth: props.penWidth,
      style: props.penStyle,
    })
    return
  }
  // select tool: clicking empty space deselects
  if (e.target === stage || e.target.name() === 'bg') emit('select', '')
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
    if (line) emit('line-committed', line)
  }
  drawing = false
}

// ---- export: flatten to a PNG dataURL (transformer detached so handles don't render) ----
function toDataURL(opts) {
  const tr = transformerRef.value?.getNode()
  if (tr) {
    tr.nodes([])
    tr.getLayer()?.batchDraw()
  }
  const stage = stageRef.value?.getStage()
  return stage ? stage.toDataURL(opts) : null
}
defineExpose({ toDataURL })
</script>

<template>
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

        <Line v-for="l in lines" :key="l.id" :config="lineConfig(l)" />

        <template v-for="it in items" :key="it.id">
          <Text
            v-if="it.type === 'sticker'"
            :config="stickerConfig(it)"
            @click="emit('select', it.id)"
            @tap="emit('select', it.id)"
            @dragend="persistTransform(it, $event)"
            @transformend="persistTransform(it, $event)"
          />
          <Image
            v-else-if="it.type === 'photo'"
            :config="photoConfig(it)"
            @click="emit('select', it.id)"
            @tap="emit('select', it.id)"
            @dragend="persistTransform(it, $event)"
            @transformend="persistTransform(it, $event)"
          />
          <Group
            v-else-if="it.type === 'stamp'"
            :config="stampGroupConfig(it)"
            @click="emit('select', it.id)"
            @tap="emit('select', it.id)"
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
</template>

<style scoped>
.stage-frame {
  width: 300px;
  height: 450px;
  background: #fff;
}
</style>
