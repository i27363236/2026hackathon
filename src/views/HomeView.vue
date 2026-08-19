<script setup>
import ContentCard from '@/components/cards/ContentCard.vue'
import HeroCarousel from '@/components/home/HeroCarousel.vue'
import HomeSummaryCards from '@/components/home/HomeSummaryCards.vue'
import SmartRecommendations from '@/components/home/SmartRecommendations.vue'
import ActionTilesSection from '@/components/home/ActionTilesSection.vue'
import { getEvents } from '@/data/events.js'
import { getCoupons } from '@/data/coupons.js'
import { getShelves, getProductById } from '@/data/catalog.js'
import { getRecommendations } from '@/data/recommendations.js'
import { getProfile } from '@/data/profile.js'
import banner1 from '@/img/banner-1.jpg'
import banner2 from '@/img/banner-2.jpg'
import banner3 from '@/img/banner-3.jpg'

const banners = [banner1, banner2, banner3]

const recommendations = getRecommendations()
const joinedEvents = getEvents()
const coupons = getCoupons()
const giftProducts = getShelves()[0].products

const profile = getProfile()
const goal = getProductById(profile.goalProductId)
</script>

<template>
  <div class="home mx-auto d-flex flex-column bg-body">
    <HeroCarousel :banners="banners" />

    <!-- Points summary + smart recommendation: stacked on mobile, side-by-side on tablet+ -->
    <HomeSummaryCards :profile="profile" :goal="goal" />
    <SmartRecommendations :recommendations="recommendations" />

    <!-- 累點/銷點功能磚(資料來自 nav.js) -->
    <ActionTilesSection />

    <!-- Joined events -->
    <section class="px-default py-5">
      <h3 class="mb-4">大家都參加</h3>
      <div class="card-row d-flex gap-4 pb-2">
        <ContentCard
          v-for="e in joinedEvents"
          :key="e.id"
          :subtitle="e.tag"
          :title="e.title"
          :img="e.img"
          :color-key="e.colorKey"
        />
      </div>
    </section>

    <!-- Coupon exchange deals -->
    <section class="px-default py-5">
      <h3 class="mb-4">這樣換，最划算</h3>
      <div class="card-row d-flex gap-4 pb-2">
        <ContentCard
          v-for="c in coupons"
          :key="c.id"
          :subtitle="c.point + ' 點'"
          :title="c.title"
          :detail="c.sub"
          :img="c.img"
          :color-key="c.colorKey"
        />
      </div>
    </section>

    <!-- Gift cards -->
    <section class="px-default py-5">
      <h3 class="mb-4">最新主打</h3>
      <div class="card-row d-flex gap-4 pb-2">
        <ContentCard
          v-for="p in giftProducts"
          :key="p.id"
          variant="gift"
          :title="p.name"
          :detail="p.desc"
          :price="p.price"
          :img="p.img"
          :color-key="p.colorKey"
          :to="{ name: 'use-product', query: { id: p.id } }"
        />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.home {
  max-width: 720px;
  @media (min-width: 768px) {
    max-width: 100%;
  }
}
.card-row {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -ms-overflow-style: none;
  scrollbar-width: none;
  margin-inline-end: calc(-1 * var(--px-phone));
  padding-inline-end: var(--px-phone);
  @media (min-width: 768px) {
    margin-inline-end: calc(-1 * var(--px-tablet-content));
    padding-inline-end: var(--px-tablet-content);
  }
}
.card-row::-webkit-scrollbar {
  display: none;
}
.card-row > * {
  scroll-snap-align: start;
}
</style>
