<script setup>
// 單一分類的優惠券列表 — 由兌換中心的分類圖示與區塊 › 箭頭導過來
// (#/coupons/category?key=coffee)。頁面標題由 meta.title 函式取分類名稱。
//
// 這頁沒有篩選鈕:兌換中心唯一開放的面向是「分類」,而分類已經由網址決定了。
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import ContentCard from '@/components/cards/ContentCard.vue'
import PointsAmount from '@/components/points/PointsAmount.vue'
import { getCoupons, getCouponCategoryByKey } from '@/data/coupons.js'

const route = useRoute()

const category = computed(() => getCouponCategoryByKey(route.query.key))
const coupons = computed(() =>
  getCoupons().filter((c) => c.category === route.query.key),
)
</script>

<template>
  <div class="container-content pb-8">
    <section class="px-default pt-7 pb-5 d-flex align-items-center gap-3">
      <Icon v-if="category" :icon="category.icon" width="32" height="32" class="text-body-secondary" />
      <div>
        <h2 class="h5 fw-bold mb-1">{{ category?.label }}</h2>
        <p class="caption-2 text-body-secondary mb-0">共 {{ coupons.length }} 張</p>
      </div>
    </section>

    <section class="px-default">
      <ContentCard
        v-for="coupon in coupons"
        :key="coupon.id"
        variant="row-horizontal"
        class="mb-3"
        :img="coupon.img"
        :subtitle="coupon.sub"
        :color-key="coupon.colorKey"
        :title="coupon.title"
      >
        <template #detail>
          <div class="d-flex align-items-center text-secondary small">
            <PointsAmount :value="coupon.point" tone="muted" size="caption" />
            <span class="ms-1">兌換</span>
          </div>
        </template>
        <template #trailing>
          <Icon icon="ph:caret-right-light" class="text-secondary opacity-50" width="24" height="24" />
        </template>
      </ContentCard>

      <p v-if="coupons.length === 0" class="text-body-secondary text-center py-8 mb-0">
        這個分類目前沒有優惠券
      </p>
    </section>
  </div>
</template>
