<script setup>
import { Icon } from '@iconify/vue'
import ActionTile from '../components/ActionTile.vue'
import RowCard from '../components/home/RowCard.vue'
import GiftRowCard from '../components/home/GiftRowCard.vue'
import { getEvents } from '../data/events.js'
import { getCoupons } from '../data/coupons.js'
import { getShelves } from '../data/catalog.js'

const joinedEvents = getEvents()
const coupons = getCoupons()
const giftProducts = getShelves()[0].products

const heroSlides = [
  {
    eyebrow: '2026 捷運黑客松',
    title: '尋找黑捷客',
    subtitle: '玩點生活 · 智慧黑客松',
    date: '05.15 — 13.5',
    gradient: 'linear-gradient(135deg, #0a1f3c, #12365e)',
  },
  {
    eyebrow: '本週活動',
    title: '捷運到日市集',
    subtitle: '中山站 · 限時優惠',
    date: '06.07 — 06.08',
    gradient: 'linear-gradient(135deg, #1a3a2c, #2a5e42)',
  },
  {
    eyebrow: '點數快訊',
    title: '夏日加倍回饋',
    subtitle: '搭乘即享雙倍捷點',
    date: '06.01 — 06.30',
    gradient: 'linear-gradient(135deg, #3a1a2c, #5e2a42)',
  },
]

const actions = [
  { label: '購物', icon: 'ph:shopping-bag', to: { name: 'use-shopping' } },
  { label: '送禮', icon: 'ph:gift', to: { name: 'use-gift-setup' } },
  { label: '優惠券', icon: 'ph:ticket', to: { name: 'use-coupons' } },
  { label: '銷點地圖', icon: 'ph:map-pin', to: { name: 'use-redeem-map' } },
  { label: '捷客券商城', icon: 'ph:storefront', to: { name: 'use-mall' } },
  { label: '轉換點數', icon: 'ph:arrows-left-right', to: { name: 'use-convert' } },
  { label: '點數傳愛', icon: 'ph:heart', to: { name: 'use-donate' } },
]

</script>

<template>
  <div class="home mx-auto p-5 d-flex flex-column gap-8">
    <!-- Hero banner carousel -->
    <section>
      <div
        id="heroCarousel"
        class="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="3000"
      >
        <div class="carousel-inner">
          <div
            v-for="(slide, i) in heroSlides"
            :key="i"
            class="carousel-item"
            :class="{ active: i === 0 }"
          >
            <div
              class="hero rounded-4 text-white p-7 position-relative overflow-hidden"
              :style="{ background: slide.gradient }"
            >
              <div class="position-relative">
                <p class="small mb-1 opacity-75">{{ slide.eyebrow }}</p>
                <h2 class="fw-bold mb-2">{{ slide.title }}</h2>
                <p class="mb-3 opacity-75">{{ slide.subtitle }}</p>
                <p class="h4 fw-bold mb-0">{{ slide.date }}</p>
              </div>
              <Icon icon="ph:coin" class="hero-coin position-absolute opacity-50" width="160" height="160" />
            </div>
          </div>
        </div>

        <button class="carousel-control-prev d-none" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" />
        </button>
        <button class="carousel-control-next d-none" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" />
        </button>

        <div class="carousel-indicators hero-indicators">
          <button
            v-for="(_, i) in heroSlides"
            :key="i"
            type="button"
            data-bs-target="#heroCarousel"
            :data-bs-slide-to="i"
            :class="{ active: i === 0 }"
          />
        </div>
      </div>
    </section>

    <!-- Points summary + Smart recommendation: stacked on mobile, side-by-side on tablet+ -->
    <div class="d-flex flex-column flex-md-row gap-5 align-items-md-start">
      <section class="summary-col">
        <div class="row g-3">
          <div class="col-6 col-md-4">
            <RouterLink :to="{ name: 'use-convert' }" class="card border-0 rounded-4 text-decoration-none text-body h-100">
              <div class="card-body px-5 py-4">
                <div class="d-flex align-items-start">
                  <span class="summary-num display-3 me-auto">15</span>
                  <Icon icon="ph:caret-right-light" width="20" height="20" class="text-body-tertiary summary-caret" />
                </div>
                <div class="d-flex align-items-center gap-2">
                  <span class="fw-bold summary-label">捷運點</span>
                </div>
                <div class="mt-4 caption-2">4點將於5/15到期</div>
              </div>
            </RouterLink>
          </div>
          <div class="col-6 col-md-4">
            <RouterLink :to="{ name: 'use-coupons' }" class="card border-0 rounded-4 text-decoration-none text-body h-100">
              <div class="card-body px-5 py-4">
                <div class="d-flex align-items-start">
                  <span class="summary-num display-3 me-auto">3</span>
                  <Icon icon="ph:caret-right-light" width="20" height="20" class="text-body-tertiary summary-caret" />
                </div>
                <span class="fw-bold summary-label d-block">優惠券</span>
                <div class="mt-4 caption-2">1張將於5/15到期</div>
              </div>
            </RouterLink>
          </div>
          <div class="col-12 col-md-4">
            <div class="card border-0 rounded-4 h-100 overflow-hidden">
              <div class="card-body p-0 d-flex">
                <div class="flex-grow-1 px-5 pt-4 summary-goal-body d-flex flex-column justify-content-end">
                  <div class="summary-goal-num mb-1">15/50</div>
                  <p class="mb-0 caption-2">誠品書店50元折價券</p>
                  <div class="mt-3">
                    <div class="progress rounded-pill summary-progress-track" style="height: 4px;">
                      <div class="progress-bar rounded-pill summary-progress-fill" style="width: 30%;" />
                    </div>
                  </div>
                </div>
                <div class="summary-reward-img flex-shrink-0 d-flex align-items-center justify-content-center bg-secondary">
                  <Icon icon="ph:ticket-light" width="28" height="28" class="text-white opacity-75" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Smart recommendation -->
      <section class="rec-col">
        <h3 class="mb-md-7 d-md-none">智慧推薦</h3>
        <div class="card p-3 border-0 shadow-lg rounded-5">
          <div class="card-body d-flex align-items-center gap-5 p-5">
            <div class="flex-grow-1">
              <p class="fw-bold mb-1">在 4 號出口兌換咖啡</p>
              <p class="text-body-secondary small mb-0">使用這張兌換好的優惠券</p>
            </div>
            <div class="rec-thumb rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm border border-white border-3 bg-success">
              <Icon icon="ph:coffee-light" width="32" height="32" class="text-body" />
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Tiles section -->
    <section>
      <!-- md+: single horizontal wrapping row -->
      <div class="tiles-row d-none d-md-flex pb-2">
        <ActionTile label="累點活動" icon="ph:calendar-star-duotone" :to="{ name: 'earn-events' }" variant="blue" />
        <ActionTile label="累點地圖" icon="ph:map-trifold-duotone" :to="{ name: 'earn-map' }" variant="blue" />
        <ActionTile v-for="a in actions" :key="a.label" :label="a.label" :icon="a.icon" :to="a.to" variant="green" />
      </div>

      <!-- mobile: two separate grid groups -->
      <div class="d-md-none d-flex flex-column gap-8">
        <div>
          <h3 class="mb-4">累積捷運點</h3>
          <div class="row g-4">
            <div class="col-6"><ActionTile label="累點活動" icon="ph:calendar-star-duotone" :to="{ name: 'earn-events' }" variant="blue" /></div>
            <div class="col-6"><ActionTile label="累點地圖" icon="ph:map-trifold-duotone" :to="{ name: 'earn-map' }" variant="blue" /></div>
          </div>
        </div>
        <div>
          <h3 class="mb-4">使用捷運點</h3>
          <div class="row g-4">
            <div v-for="a in actions" :key="a.label" class="col-6">
              <ActionTile :label="a.label" :icon="a.icon" :to="a.to" variant="green" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Joined events -->
    <section>
      <h3 class="mb-4">大家都參加</h3>
      <div class="card-row d-flex gap-4 pb-2">
        <RowCard
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
    <section>
      <h3 class="mb-4">這樣換，最划算</h3>
      <div class="card-row d-flex gap-4 pb-2">
        <RowCard
          v-for="c in coupons"
          :key="c.id"
          :subtitle="c.point + ' 點'"
          :title="c.title"
          :detail="c.sub"
          :color-key="c.colorKey"
        />
      </div>
    </section>

    <!-- Gift cards -->
    <section>
      <h3 class="mb-4">最新主打</h3>
      <div class="card-row d-flex gap-4 pb-2">
        <GiftRowCard
          v-for="p in giftProducts"
          :key="p.id"
          :id="p.id"
          :name="p.name"
          :detail="p.desc"
          :price="p.price"
          :size-label="p.sizeLabel"
          :img="p.img"
          :color-key="p.colorKey"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  max-width: 720px;
}
@media (min-width: 768px) {
  .home {
    max-width: 100%;
  }
}
.hero {
  background: linear-gradient(135deg, #0a1f3c, #12365e);
}
.hero-coin {
  right: -20px;
  bottom: -20px;
}
.hero-indicators {
  position: static;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}
.hero-indicators [data-bs-target] {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--bs-gray-300);
  border: none;
  padding: 0;
  flex-shrink: 0;
  text-indent: -9999px;
  transition: width 0.3s ease, border-radius 0.3s ease, background 0.3s ease;
  opacity: 1;
}
.hero-indicators [data-bs-target].active {
  width: 20px;
  border-radius: 800px;
  background: var(--bs-primary);
}
.rec-thumb {
  width: 56px;
  height: 56px;
  rotate: 4deg;
}
.card-row {
  overflow-x: auto;
  scroll-snap-type: x proximity;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.card-row::-webkit-scrollbar {
  display: none;
}
.card-row > * {
  scroll-snap-align: start;
}
.summary-caret {
  margin-top: 5px;
}
.summary-metro-icon {
  opacity: 0.8;
}
.summary-label {
  font-size: 20px;
  letter-spacing: 0.45px;
  line-height: 26px;
}
.summary-goal-body {
  padding-bottom: 15px;
}
.summary-goal-num {
  font-size: 22px;
  font-weight: 300;
  letter-spacing: 0.45px;
  line-height: 28px;
}
.summary-progress-track {
  background: #fff0b2;
}
.summary-progress-fill {
  background: #eeb740;
}
.summary-reward-img {
  width: 72px;
}
.tiles-row {
  gap: 8px;
  overflow: scroll;
}
.summary-col {
  flex: 3 1 0;
  min-width: 0;
}
.rec-col {
  flex: 1 1 0;
  min-width: 0;
}
.tiles-row :deep(.action-tile) {
  width: 185px;
  flex-shrink: 0;
}
</style>
