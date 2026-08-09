<script setup>
// 「選擇捷運站」展開清單。收合時只佔一行,避免二十幾個站把整張面板撐長。
//
// 用 Vue 自己的 v-show + Transition 而不是 Bootstrap collapse:面板隨 BottomSheet
// 掛載/卸載,少一層 JS 生命週期就少一種壞法,行為也一樣。
//
// 每列同時列出該站的所有路線徽章(沿用 GiftReceivedView 可使用地點的列表寫法),
// 所以轉乘站只出現一次,不會因為分組而重複。
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import MetroLineBadge from '@/components/common/MetroLineBadge.vue'

defineProps({
  stations: { type: Array, required: true }, // [{ id, name, lines }]
  selected: { type: Array, required: true },
})

defineEmits(['toggle'])

const open = ref(false)
</script>

<template>
  <div>
    <button
      type="button"
      class="btn btn-light rounded-pill d-flex align-items-center justify-content-between w-100 px-5 py-3"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span class="fw-bold">
        選擇捷運站
        <span v-if="selected.length" class="text-body-secondary fw-normal">
          （已選 {{ selected.length }}）
        </span>
      </span>
      <Icon
        icon="ph:caret-down-light"
        width="20"
        height="20"
        class="station-caret flex-shrink-0"
        :class="{ 'station-caret--open': open }"
      />
    </button>

    <Transition name="station-list">
      <div v-show="open" class="list-group list-group-flush mt-2">
        <label
          v-for="s in stations"
          :key="s.id"
          class="list-group-item d-flex align-items-center gap-3 py-3 px-0 border-light-subtle"
        >
          <input
            class="form-check-input m-0 flex-shrink-0"
            type="checkbox"
            :checked="selected.includes(s.id)"
            @change="$emit('toggle', s.id)"
          />
          <span class="d-flex align-items-center gap-1 flex-shrink-0">
            <MetroLineBadge v-for="line in s.lines" :key="line" :code="line" />
          </span>
          <span class="text-truncate">{{ s.name }}</span>
        </label>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.station-caret {
  transition: rotate 0.2s ease;
}
.station-caret--open {
  rotate: 180deg;
}

.station-list-enter-active,
.station-list-leave-active {
  transition: opacity 0.2s ease;
}
.station-list-enter-from,
.station-list-leave-to {
  opacity: 0;
}
</style>
