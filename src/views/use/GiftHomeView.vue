<script setup>
// 送禮中心 — 挑選禮物的入口頁。側欄與首頁的「送禮」磚都導到這裡,
// 點卡片 → 商品詳情(use-product)→ 結帳 → 卡片編輯器。
// 商品資料來自 data/catalog.js。
//
// 分類籤是「導覽」不是「開關」:點下去會進到該貨架自己的列表頁(gift-shelf),
// 所以每顆籤都帶一個 › 讓它讀起來像連結。要在本頁就地收斂範圍請用篩選面板 —
// 面板裡的「分類」是多選的,能表達「早安 或 我的style」這種籤做不到的組合。
//
// 搜尋以 predicate 的形式交給 useProductFilter,這樣「共 N 件」會把搜尋一起算進去,
// 而價格上下界仍以完整目錄為準,不會在打字時跳動。
//
// 已知取捨:價格滑桿直接吃 price 數值,不分 purchaseType —— 目錄裡 Metro Team 那批
// 是「元」計價(120–790),其餘是捷運點(30–990),兩者被放在同一條軸線上,等同把
// 「290 捷運點」與「NT$290」視為相同。這是為了 demo 簡化而刻意選的,語意上並不正確。
// 要修正的話是依 purchaseType 拆成兩條軸線(FilterPanel 的 priceUnit 已預留)。
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import GiftGrid from '@/components/cards/GiftGrid.vue'
import BottomSheet from '@/components/common/BottomSheet.vue'
import FilterButton from '@/components/filter/FilterButton.vue'
import FilterPanel from '@/components/filter/FilterPanel.vue'
import ToolbarButton from '@/components/ToolbarButton.vue'
import { getShelves } from '@/data/catalog.js'
import { getStations, getStationsForMerchant } from '@/data/stations.js'
import { useProductFilter } from '@/composables/useProductFilter.js'

const router = useRouter()
const shelves = getShelves()
const stations = getStations()

// 商品身上沒有分類欄位,分類就是它所屬的貨架 — 攤平時把 shelfKey 帶上。
const allProducts = shelves.flatMap((s) => s.products.map((p) => ({ ...p, shelfKey: s.key })))
const categories = shelves.map((s) => ({ key: s.key, label: s.title }))

const searchQuery = ref('')

const sections = ['price', 'category', 'station']
const {
  price,
  bounds,
  selectedCategories,
  selectedStations,
  filtered,
  activeCount,
  resultCount,
  reset,
  toggleCategory,
  toggleStation,
} = useProductFilter(allProducts, {
  sections,
  categories,
  stations,
  getCategory: (p) => p.shelfKey,
  getStations: (p) => getStationsForMerchant(p.merchant),
  predicate: (p) => {
    const q = searchQuery.value.trim()
    return !q || p.name.includes(q) || p.desc.includes(q)
  },
})

const sheetOpen = ref(false)

// Teleport 到 TopToolbar 的 actions 區 — 首次載入時 #top-toolbar-actions
// 尚未進入 DOM,需等一個 tick(同 GiftSetupView 的作法)。
const toolbarReady = ref(false)
onMounted(async () => {
  await nextTick()
  toolbarReady.value = true
})

const hasQuery = computed(() => searchQuery.value.trim() !== '')
</script>

<template>
  <div class="gift-home container-content pb-8">
    <Teleport v-if="toolbarReady" to="#top-toolbar-actions">
      <ToolbarButton
        icon="ph:clock-counter-clockwise-light"
        aria-label="送禮紀錄"
        @click="router.push({ name: 'profile-gifts-history' })"
      />
    </Teleport>

    <!-- Hero banner -->
    <section class="px-default pt-7">
      <div class="hero-banner rounded-4 p-7 text-white d-flex flex-column justify-content-center">
        <h2 class="mb-1">捷運伴手禮</h2>
        <p class="small opacity-75 mb-0">送出最真摯的祝福,共享美好生活</p>
      </div>
    </section>

    <!-- Search + filter + category links -->
    <section class="px-default py-5">
      <div class="search-bar d-flex align-items-center rounded-pill px-5 mb-4 bg-body-secondary">
        <Icon icon="ph:magnifying-glass-light" width="24" height="24" class="text-body-secondary flex-shrink-0" />
        <input
          v-model="searchQuery"
          type="search"
          class="form-control border-0 bg-transparent shadow-none py-3"
          placeholder="搜尋想送的禮物…"
        />
      </div>

      <div class="d-flex align-items-center justify-content-between gap-4 mb-4">
        <FilterButton :count="activeCount" @click="sheetOpen = true" />
        <span class="caption-2 text-body-secondary">共 {{ resultCount }} 件</span>
      </div>

      <div class="chip-row d-flex gap-2 overflow-auto pb-2">
        <RouterLink
          v-for="s in shelves"
          :key="s.key"
          :to="{ name: 'gift-shelf', query: { key: s.key } }"
          class="btn btn-light text-body-secondary rounded-pill px-5 py-2 text-nowrap flex-shrink-0 d-inline-flex align-items-center gap-1"
        >
          {{ s.title }}
          <Icon icon="ph:caret-right-light" width="16" height="16" />
        </RouterLink>
      </div>
    </section>

    <!-- Gift grid -->
    <section class="px-default">
      <GiftGrid :products="filtered">
        <template #empty>
          <p class="text-body-secondary mb-4">找不到符合的禮物</p>
          <button
            v-if="activeCount > 0 || hasQuery"
            type="button"
            class="btn btn-light rounded-pill px-5"
            @click="reset(); searchQuery = ''"
          >
            重設篩選
          </button>
        </template>
      </GiftGrid>
    </section>

    <BottomSheet :open="sheetOpen" title="篩選" @close="sheetOpen = false">
      <FilterPanel
        :sections="sections"
        :categories="categories"
        :stations="stations"
        :price="price"
        :bounds="bounds"
        :selected-categories="selectedCategories"
        :selected-stations="selectedStations"
        :result-count="resultCount"
        :active-count="activeCount"
        @update:price="price = $event"
        @toggle-category="toggleCategory($event)"
        @toggle-station="toggleStation($event)"
        @reset="reset()"
      />
    </BottomSheet>
  </div>
</template>

<style scoped>
.hero-banner {
  background: var(--tile-gradient-blue);
  min-height: 120px;
}
.chip-row {
  scrollbar-width: none;
}
.chip-row::-webkit-scrollbar {
  display: none;
}
</style>
