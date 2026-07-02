<script setup>
// Custom stamp builder panel: type a station name, pick a Phosphor icon, an icon
// weight, and a shape, then emit the spec. The parent (GiftSetupView) turns the
// spec into a Konva group on the canvas (the icon is rasterized from its SVG).
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

const emit = defineEmits(['add'])

// Phosphor base names (no weight suffix) shown in the 圖示 section.
const ICONS = ['train', 'subway', 'tram', 'map-pin', 'heart', 'star', 'coffee', 'buildings', 'mountains', 'flower']
// Phosphor weight variants — 'regular' has no suffix.
const WEIGHTS = [
  { key: 'thin', label: '細' },
  { key: 'light', label: '輕' },
  { key: 'regular', label: '標準' },
  { key: 'bold', label: '粗' },
  { key: 'fill', label: '實心' },
]
const SHAPES = [
  { key: 'circle', label: '圓形' },
  { key: 'square', label: '方形' },
  { key: 'badge', label: '徽章' },
]

const name = ref('')
const icon = ref(ICONS[0])
const weight = ref('regular')
const shape = ref('circle')

// Compose the full Iconify name, e.g. 'ph:train' or 'ph:train-light'.
const iconName = (base) => `ph:${base}${weight.value === 'regular' ? '' : `-${weight.value}`}`
const selectedIconName = computed(() => iconName(icon.value))

function add() {
  emit('add', {
    name: name.value.trim() || '車站',
    icon: selectedIconName.value,
    shape: shape.value,
  })
  name.value = ''
}
</script>

<template>
  <div class="stamp-builder">
    <label class="form-label small fw-bold mb-1">車站名稱</label>
    <input
      v-model="name"
      type="text"
      class="form-control form-control-sm rounded-3 mb-2"
      placeholder="例如：中山站"
      maxlength="6"
    />

    <div class="small fw-bold mb-1">圖示</div>
    <div class="d-flex gap-2 flex-wrap mb-2">
      <button
        v-for="ic in ICONS"
        :key="ic"
        type="button"
        class="stamp-icon-btn btn btn-sm d-inline-flex align-items-center justify-content-center"
        :class="icon === ic ? 'btn-primary' : 'btn-outline-secondary'"
        @click="icon = ic"
      >
        <Icon :icon="iconName(ic)" width="22" height="22" />
      </button>
    </div>

    <div class="small fw-bold mb-1">粗細</div>
    <div class="d-flex gap-2 mb-2">
      <button
        v-for="w in WEIGHTS"
        :key="w.key"
        type="button"
        class="btn btn-sm flex-fill px-1"
        :class="weight === w.key ? 'btn-primary' : 'btn-outline-secondary'"
        @click="weight = w.key"
      >
        {{ w.label }}
      </button>
    </div>

    <div class="small fw-bold mb-1">形狀</div>
    <div class="d-flex gap-2 mb-3">
      <button
        v-for="s in SHAPES"
        :key="s.key"
        type="button"
        class="btn btn-sm flex-fill"
        :class="shape === s.key ? 'btn-primary' : 'btn-outline-secondary'"
        @click="shape = s.key"
      >
        {{ s.label }}
      </button>
    </div>

    <button type="button" class="btn btn-primary btn-sm rounded-pill w-100" @click="add">
      加入印章
    </button>
  </div>
</template>

<style scoped>
.stamp-icon-btn {
  width: 40px;
  height: 36px;
  line-height: 1;
  padding: 6px 0;
}
</style>
