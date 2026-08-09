<script setup>
// 優惠券兌換中心。
//
// 兩種模式:
//   瀏覽模式(沒有啟用任何篩選)= banner + 分類圖示 + 三條精選橫列,維持原本的逛街感。
//   結果模式(有啟用篩選)      = 收起橫列,改用單一清單 + 筆數,避免同一張券在多條列重複出現。
//
// 分類圖示與區塊 › 箭頭都是「導覽」,會進到該分類自己的列表頁(coupon-category);
// 就地收斂請用篩選面板 —— 和送禮中心同一套規則。
//
// 分類語彙只有一份,來自 data/coupons.js 的 getCouponCategories(),
// 圖示、分類頁、篩選面板三邊共用,不要在這裡另外再寫一組標籤陣列。
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import ContentCard from '@/components/cards/ContentCard.vue'
import PointsAmount from '@/components/points/PointsAmount.vue'
import BottomSheet from '@/components/common/BottomSheet.vue'
import FilterButton from '@/components/filter/FilterButton.vue'
import FilterPanel from '@/components/filter/FilterPanel.vue'
import { getCoupons, getCouponCategories } from '@/data/coupons.js'
import { useProductFilter } from '@/composables/useProductFilter.js'

const coupons = getCoupons()
const categories = getCouponCategories()

// 首頁精選的三條橫列 — 各自列出自己分類的券,不再三條都渲染同一批。
const featuredSections = ['fast-food', 'discount', 'travel'].map((key) => ({
  ...categories.find((c) => c.key === key),
  coupons: coupons.filter((c) => c.category === key),
}))

const sections = ['category']
const { selectedCategories, filtered, activeCount, resultCount, reset, toggleCategory } =
  useProductFilter(coupons, {
    sections,
    categories,
    getPrice: (c) => c.point,
  })

const sheetOpen = ref(false)
const isFiltering = computed(() => activeCount.value > 0)
</script>

<template>
  <div class="coupon-trade-center">

    <!-- Banner carousel -->
    <div
      id="couponBannerCarousel"
      class="carousel slide mx-default mt-3 mb-2 rounded-4 overflow-hidden"
      data-bs-ride="carousel"
      data-bs-interval="3000"
    >
      <div class="carousel-inner">
        <div v-for="i in 3" :key="i" class="carousel-item" :class="{ active: i === 1 }">
          <div class="banner-frame">
            <img src="https://placehold.co/390x133?text=Banner" class="banner-main d-block w-100" alt="">
          </div>
        </div>
      </div>
      <div class="carousel-indicators">
        <button
          v-for="i in 3"
          :key="i"
          type="button"
          data-bs-target="#couponBannerCarousel"
          :data-bs-slide-to="i - 1"
          :class="{ active: i === 1 }"
        />
      </div>
    </div>

    <!-- Category icon grid — 每顆圖示導向該分類的列表頁 -->
    <div class="py-4">
      <div v-for="row in [categories.slice(0, 3), categories.slice(3)]" :key="row[0].key" class="d-flex justify-content-center">
        <RouterLink
          v-for="item in row"
          :key="item.key"
          :to="{ name: 'coupon-category', query: { key: item.key } }"
          class="cat-item text-decoration-none"
        >
          <Icon :icon="item.icon" width="32" height="32" />
          <span class="cat-label">{{ item.label }}</span>
        </RouterLink>
      </div>
    </div>

    <!-- 篩選列 -->
    <div class="px-default d-flex align-items-center justify-content-between gap-4 mb-4">
      <FilterButton :count="activeCount" @click="sheetOpen = true" />
      <span v-if="isFiltering" class="caption-2 text-body-secondary">共 {{ resultCount }} 張</span>
    </div>

    <!-- 結果模式:單一清單 -->
    <section v-if="isFiltering" class="px-default pb-4">
      <ContentCard
        v-for="c in filtered"
        :key="c.id"
        variant="row-horizontal"
        class="mb-3"
        :img="c.img"
        :subtitle="c.sub"
        :color-key="c.colorKey"
        :title="c.title"
      >
        <template #detail>
          <div class="d-flex align-items-center text-secondary small">
            <PointsAmount :value="c.point" tone="muted" size="caption" />
            <span class="ms-1">兌換</span>
          </div>
        </template>
        <template #trailing>
          <Icon icon="ph:caret-right-light" class="text-secondary opacity-50" width="24" height="24" />
        </template>
      </ContentCard>

      <div v-if="filtered.length === 0" class="text-center py-8">
        <p class="text-body-secondary mb-4">找不到符合的優惠券</p>
        <button type="button" class="btn btn-light rounded-pill px-5" @click="reset()">
          重設篩選
        </button>
      </div>
    </section>

    <!-- 瀏覽模式:精選橫列 -->
    <template v-else>
      <section v-for="section in featuredSections" :key="section.key" class="mb-2">
        <div class="d-flex align-items-center justify-content-between px-default mb-3">
          <h2 class="section-heading mb-0">{{ section.label }}</h2>
          <RouterLink
            :to="{ name: 'coupon-category', query: { key: section.key } }"
            class="btn icon-circle-btn"
            :aria-label="`查看全部${section.label}`"
          >
            <Icon icon="ph:arrow-right-light" width="24" height="24" />
          </RouterLink>
        </div>
        <div class="card-row d-flex gap-4 px-default pb-2">
          <ContentCard
            v-for="c in section.coupons"
            :key="c.id"
            :subtitle="c.point + ' 捷運點'"
            :title="c.title"
            :detail="c.sub"
            :img="c.img"
            :color-key="c.colorKey"
          />
        </div>
      </section>
    </template>

    <BottomSheet :open="sheetOpen" title="篩選" @close="sheetOpen = false">
      <FilterPanel
        :sections="sections"
        :categories="categories"
        :selected-categories="selectedCategories"
        :result-count="resultCount"
        :active-count="activeCount"
        @toggle-category="toggleCategory($event)"
        @reset="reset()"
      />
    </BottomSheet>

  </div>
</template>

<style lang="scss" scoped>
.coupon-trade-center {
  .mx-default { margin-inline: var(--px-phone); }

  .icon-circle-btn {
    width: 32px;
    height: 32px;
    padding: 0;
    background: rgba(249, 247, 243, 0.8);
    border: none;
    border-radius: var(--bs-border-radius-pill);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: inherit;
  }

  .cat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 4px 20px;
    color: var(--bs-secondary-color);
  }
  .cat-label { font-size: 1.0625rem; line-height: 22px; }

  .section-heading {
    font-size: 1.375rem;
    font-weight: 700;
    letter-spacing: 0.45px;
    line-height: 28px;
  }

  .card-row {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline-start: var(--px-phone);
    -ms-overflow-style: none;
    scrollbar-width: none;
    margin-inline-end: calc(-1 * var(--px-phone));
    padding-inline-end: var(--px-phone);
    @media (min-width: 48rem) {
      scroll-padding-inline-start: var(--px-tablet-content);
      margin-inline-end: calc(-1 * var(--px-tablet-content));
      padding-inline-end: var(--px-tablet-content);
    }
    &::-webkit-scrollbar { display: none; }
    > * { scroll-snap-align: start; }
  }
}
</style>
