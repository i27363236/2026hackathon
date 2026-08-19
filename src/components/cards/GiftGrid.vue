<script setup>
// 禮物網格 — 送禮中心與貨架頁共用的版型,兩邊的欄寬/間距必須一致,所以抽成元件。
// 空狀態的文案與後續動作各頁不同(有無篩選可重設),交給 #empty slot 決定。
import ContentCard from '@/components/cards/ContentCard.vue'

defineProps({
  products: { type: Array, required: true },
})
</script>

<template>
  <div class="row g-5">
    <div v-for="p in products" :key="p.id" class="col-6 col-md-4">
      <ContentCard
        variant="gift"
        class="w-100"
        :title="p.name"
        :detail="p.desc"
        :price="p.price"
        :purchase-type="p.purchaseType"
        :img="p.img"
        :color-key="p.colorKey"
        :to="{ name: 'use-product', query: { id: p.id } }"
      />
    </div>

    <div v-if="products.length === 0" class="text-center py-8">
      <slot name="empty">
        <p class="text-body-secondary mb-0">找不到符合的禮物</p>
      </slot>
    </div>
  </div>
</template>
