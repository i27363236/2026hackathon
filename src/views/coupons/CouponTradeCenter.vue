<script setup>
import { Icon } from '@iconify/vue'
import ContentCard from '@/components/cards/ContentCard.vue'
import { getCoupons } from '@/data/coupons.js'

const coupons = getCoupons()

const categoryItems = [
  { icon: 'ph:ticket-light',            label: '折價券' },
  { icon: 'ph:hamburger-light',         label: '速食券' },
  { icon: 'ph:coffee-light',            label: '咖啡券' },
  { icon: 'ph:palette-light',           label: '活動券' },
  { icon: 'ph:shopping-cart-light',     label: '購物券' },
  { icon: 'ph:suitcase-rolling-light',  label: '旅遊券' },
]

const sections = [
  { id: 'fast-food', label: '速食券' },
  { id: 'discount',  label: '折價券' },
  { id: 'travel',    label: '旅遊券' },
]
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

    <!-- Category icon grid -->
    <div class="py-4">
      <div class="d-flex justify-content-center">
        <div v-for="item in categoryItems.slice(0, 3)" :key="item.label" class="cat-item">
          <Icon :icon="item.icon" width="32" height="32" />
          <span class="cat-label">{{ item.label }}</span>
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <div v-for="item in categoryItems.slice(3)" :key="item.label" class="cat-item">
          <Icon :icon="item.icon" width="32" height="32" />
          <span class="cat-label">{{ item.label }}</span>
        </div>
      </div>
    </div>

    <!-- Category sections -->
    <section v-for="section in sections" :key="section.id" class="mb-2">
      <div class="d-flex align-items-center justify-content-between px-default mb-3">
        <h2 class="section-heading mb-0">{{ section.label }}</h2>
        <button class="btn icon-circle-btn">
          <Icon icon="ph:arrow-right-light" width="24" height="24" />
        </button>
      </div>
      <div class="card-row d-flex gap-4 px-default pb-2">
        <ContentCard
          v-for="c in coupons"
          :key="c.id"
          :subtitle="c.point + ' 捷運點'"
          :title="c.title"
          :detail="c.sub"
          :img="c.img"
          :color-key="c.colorKey"
        />
      </div>
    </section>

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
