<script setup>
// Custom stamp builder panel: type a station name, pick an icon + a shape, emit the spec.
// The parent (GiftSetupView) turns the spec into a Konva group on the canvas.
import { ref } from 'vue'

const emit = defineEmits(['add'])

const ICONS = ['🚇', '🚉', '🏯', '🗼', '🌊', '⛩️']
const SHAPES = [
  { key: 'circle', label: '圓形' },
  { key: 'square', label: '方形' },
  { key: 'badge', label: '徽章' },
]

const name = ref('')
const icon = ref(ICONS[0])
const shape = ref('circle')

function add() {
  emit('add', { name: name.value.trim() || '車站', icon: icon.value, shape: shape.value })
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
        class="stamp-icon-btn btn btn-sm"
        :class="icon === ic ? 'btn-primary' : 'btn-outline-secondary'"
        @click="icon = ic"
      >
        {{ ic }}
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
  font-size: 18px;
  line-height: 1;
  padding: 6px 0;
}
</style>
