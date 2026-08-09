<script setup>
// 篩選面板內容 —— 放進 <BottomSheet> 的 default slot。
//
// 條件是「即時套用」的:動一下就改變下方列表,所以這裡沒有草稿狀態、沒有套用鈕,
// BottomSheet 也就不需要 footer slot。第一列的「共 N 件」是唯一的即時回饋
// (手機上面板會蓋住列表),右邊的「重設」是回到零的唯一出口。
//
// BottomSheet 的 chrome 只有左上關閉鈕與置中標題,沒有右側插槽,
// 所以筆數與重設放在 body 的第一列,而不是標題列。
//
// 各頁用 sections 決定開哪幾項 —— 沒有資料支撐的面向就不要顯示
// (例如貨架頁的分類已由路由決定,兌換中心的優惠券沒有車站資料)。
import PriceRangeSlider from './PriceRangeSlider.vue'
import StationCollapse from './StationCollapse.vue'

defineProps({
  sections: { type: Array, default: () => [] }, // ('price' | 'category' | 'station')[]
  categories: { type: Array, default: () => [] }, // [{ key, label }]
  stations: { type: Array, default: () => [] }, // [{ id, name, lines }]
  // 只有開了 'price' 區塊才會用到 — 沒開的頁面不必傳。
  price: { type: Array, default: () => [0, 0] }, // [lo, hi]
  bounds: { type: Array, default: () => [0, 0] }, // [min, max]
  priceUnit: { type: String, default: '捷運點' },
  selectedCategories: { type: Array, default: () => [] },
  selectedStations: { type: Array, default: () => [] },
  resultCount: { type: Number, default: 0 },
  activeCount: { type: Number, default: 0 },
})

defineEmits(['update:price', 'toggle-category', 'toggle-station', 'reset'])
</script>

<template>
  <div class="d-flex flex-column gap-7">
    <div class="d-flex align-items-center justify-content-between">
      <span class="fw-bold">共 {{ resultCount }} 件</span>
      <button
        type="button"
        class="btn btn-link p-0 text-decoration-none"
        :disabled="activeCount === 0"
        @click="$emit('reset')"
      >
        重設
      </button>
    </div>

    <section v-if="sections.includes('price')">
      <h3 class="h6 fw-bold mb-5">價格</h3>
      <PriceRangeSlider
        :model-value="price"
        :min="bounds[0]"
        :max="bounds[1]"
        :unit="priceUnit"
        @update:model-value="$emit('update:price', $event)"
      />
    </section>

    <section v-if="sections.includes('category')">
      <h3 class="h6 fw-bold mb-4">分類</h3>
      <div class="d-flex flex-column gap-3">
        <label v-for="c in categories" :key="c.key" class="d-flex align-items-center gap-3">
          <input
            class="form-check-input m-0 flex-shrink-0"
            type="checkbox"
            :checked="selectedCategories.includes(c.key)"
            @change="$emit('toggle-category', c.key)"
          />
          <span>{{ c.label }}</span>
        </label>
      </div>
    </section>

    <section v-if="sections.includes('station')">
      <h3 class="h6 fw-bold mb-4">位置</h3>
      <StationCollapse
        :stations="stations"
        :selected="selectedStations"
        @toggle="$emit('toggle-station', $event)"
      />
    </section>
  </div>
</template>
