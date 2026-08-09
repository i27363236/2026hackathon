<script setup>
// 單一貨架的禮物列表 — 由送禮中心的分類籤導過來(#/use/gift/shelf?key=morning)。
// 頁面標題由路由的 meta.title 函式取貨架名稱(見 router/index.js 的 resolveTitle)。
//
// 分類面向不開:貨架已經由網址決定了,再給一組分類勾選只會自打架。
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import GiftGrid from '@/components/cards/GiftGrid.vue'
import BottomSheet from '@/components/common/BottomSheet.vue'
import FilterButton from '@/components/filter/FilterButton.vue'
import FilterPanel from '@/components/filter/FilterPanel.vue'
import { getShelves } from '@/data/catalog.js'
import { getStations, getStationsForMerchant } from '@/data/stations.js'
import { useProductFilter } from '@/composables/useProductFilter.js'

const route = useRoute()
const stations = getStations()

const shelf = computed(() => getShelves().find((s) => s.key === route.query.key))
const pool = computed(() => shelf.value?.products ?? [])

const sections = ['price', 'station']
const { price, bounds, selectedStations, filtered, activeCount, resultCount, reset, toggleStation } =
  useProductFilter(pool, {
    sections,
    stations,
    getStations: (p) => getStationsForMerchant(p.merchant),
  })

const sheetOpen = ref(false)
</script>

<template>
  <div class="container-content pb-8">
    <section class="px-default pt-7 pb-5 d-flex align-items-center justify-content-between gap-4">
      <div class="min-w-0">
        <h2 class="h5 fw-bold mb-1 text-truncate">{{ shelf?.title }}</h2>
        <p class="caption-2 text-body-secondary mb-0">共 {{ resultCount }} 件禮物</p>
      </div>
      <FilterButton :count="activeCount" @click="sheetOpen = true" />
    </section>

    <section class="px-default">
      <GiftGrid :products="filtered">
        <template #empty>
          <p class="text-body-secondary mb-4">找不到符合的禮物</p>
          <button type="button" class="btn btn-light rounded-pill px-5" @click="reset()">
            重設篩選
          </button>
        </template>
      </GiftGrid>
    </section>

    <BottomSheet :open="sheetOpen" title="篩選" @close="sheetOpen = false">
      <FilterPanel
        :sections="sections"
        :stations="stations"
        :price="price"
        :bounds="bounds"
        :selected-stations="selectedStations"
        :result-count="resultCount"
        :active-count="activeCount"
        @update:price="price = $event"
        @toggle-station="toggleStation($event)"
        @reset="reset()"
      />
    </BottomSheet>
  </div>
</template>
