<script setup>
// 送禮中心 — 挑選禮物的入口頁。側欄與首頁的「送禮」磚都導到這裡,
// 點卡片 → 商品詳情(use-product)→ 結帳 → 卡片編輯器。
// 商品資料來自 data/catalog.js;分類籤 = 貨架(shelf)標題,搜尋只過濾禮物。
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import ContentCard from '@/components/cards/ContentCard.vue'
import ToolbarButton from '@/components/ToolbarButton.vue'
import { getShelves } from '@/data/catalog.js'

const router = useRouter()
const shelves = getShelves()

const searchQuery = ref('')
const activeShelf = ref('all')
const chips = [{ key: 'all', title: '全部' }, ...shelves.map((s) => ({ key: s.key, title: s.title }))]

const products = computed(() => {
  const pool =
    activeShelf.value === 'all'
      ? shelves.flatMap((s) => s.products)
      : (shelves.find((s) => s.key === activeShelf.value)?.products ?? [])
  const q = searchQuery.value.trim()
  return q ? pool.filter((p) => p.name.includes(q) || p.desc.includes(q)) : pool
})

// Teleport 到 TopToolbar 的 actions 區 — 首次載入時 #top-toolbar-actions
// 尚未進入 DOM,需等一個 tick(同 GiftSetupView 的作法)。
const toolbarReady = ref(false)
onMounted(async () => {
  await nextTick()
  toolbarReady.value = true
})
</script>

<template>
  <div class="gift-home mx-auto pb-8">
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

    <!-- Search + category chips -->
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
      <div class="chip-row d-flex gap-2 overflow-auto pb-2">
        <button
          v-for="chip in chips"
          :key="chip.key"
          type="button"
          class="btn rounded-pill px-5 py-2 text-nowrap flex-shrink-0"
          :class="activeShelf === chip.key ? 'btn-primary' : 'btn-light text-body-secondary'"
          @click="activeShelf = chip.key"
        >
          {{ chip.title }}
        </button>
      </div>
    </section>

    <!-- Gift grid -->
    <section class="px-default">
      <div class="row g-5">
        <div v-for="p in products" :key="p.id" class="col-6 col-md-4">
          <ContentCard
            variant="gift"
            class="w-100"
            :title="p.name"
            :detail="p.desc"
            :price="p.price"
            :size-label="p.sizeLabel"
            :img="p.img"
            :color-key="p.colorKey"
            :to="{ name: 'use-product', query: { id: p.id } }"
          />
        </div>
        <p v-if="products.length === 0" class="text-body-secondary text-center py-8 mb-0">
          找不到符合的禮物
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.gift-home {
  max-width: 720px;
}
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
