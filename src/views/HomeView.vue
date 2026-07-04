<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import ActionTile from '../components/ActionTile.vue'
import RowCard from '../components/home/RowCard.vue'
import GiftRowCard from '../components/home/GiftRowCard.vue'
import { getEvents } from '../data/events.js'
import { getCoupons } from '../data/coupons.js'
import { getShelves, getProductById } from '../data/catalog.js'
import { getRecommendations } from '../data/recommendations.js'
import { getProfile } from '../data/profile.js'
import banner1 from '../img/banner-1.jpg'
import banner2 from '../img/banner-2.jpg'
import banner3 from '../img/banner-3.jpg'
import metroPointImg from '../img/metro-point.png'

const banners = [banner1, banner2, banner3]

const recommendations = getRecommendations()
const joinedEvents = getEvents()
const coupons = getCoupons()
const giftProducts = getShelves()[0].products

const profile = getProfile()
const goal = getProductById(profile.goalProductId)
const goalPct = computed(() => Math.min(100, Math.round((profile.points / goal.price) * 100)))

const currentIndex = ref(0)
const wrap = n => ((n % recommendations.length) + recommendations.length) % recommendations.length
const rec = computed(() => recommendations[wrap(currentIndex.value)])
const recTriple = computed(() => [0, 1, 2].map(offset => recommendations[wrap(currentIndex.value + offset)]))
let timer
// decrement so each tick a new card enters on the left and the rightmost leaves
onMounted(() => { timer = setInterval(() => { currentIndex.value-- }, 4_500) })
onUnmounted(() => { clearInterval(timer) })

// Links to the in-development stub are rendered as disabled (muted, unclickable).
const isStub = to => to?.name === 'in-development'

const actions = [
  { label: '購物', icon: 'ph:shopping-bag', to: { name: 'in-development' } },
  { label: '送禮', icon: 'ph:gift', to: { name: 'use-gift-setup' } },
  { label: '優惠券', icon: 'ph:ticket', to: { name: 'coupon-trade' } },
  { label: '銷點地圖', icon: 'ph:map-pin', to: { name: 'in-development' } },
  { label: '捷客券商城', icon: 'ph:storefront', to: { name: 'in-development' } },
  { label: '轉換點數', icon: 'ph:arrows-left-right', to: { name: 'in-development' } },
  { label: '點數傳愛', icon: 'ph:heart', to: { name: 'in-development' } },
]

</script>

<template>
  <div class="home mx-auto d-flex flex-column">
    <!-- Hero banner carousel -->
    <section class="position-relative">
      <div id="heroCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
        <div class="carousel-inner">
          <div v-for="(src, i) in banners" :key="i" class="carousel-item" :class="{ active: i === 0 }">
            <div class="banner-frame">
              <img :src="src" class="banner-main d-block w-100" alt="" />
            </div>
          </div>
        </div>
        <div class="carousel-indicators">
          <button
            v-for="(_, i) in banners"
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
    <div class="d-flex flex-column flex-md-row gap-3 align-items-md-start px-default py-5">
      <section class="summary-col">
        <div class="summary-row row g-3">
          <div class="col-6 col-md-4">
            <div class="card border-0 rounded-4 text-decoration-none text-body h-100">
              <div class="card-body px-5 py-4 d-flex flex-column justify-content-between">
                <div class="d-flex justify-content-between align-items-center">
                  <img :src="metroPointImg" class="w-8 h-8 mt-1" style="width:32px;height:32px;object-fit:contain" alt="捷運點" />
                  <div class="display-3">{{ profile.points }}</div>
                </div>
                <h4 class="mt-2 mb-0">捷運點</h4>
                <div class="caption-2 mt-1 text-body-secondary">{{ profile.expiringPoints }}點將於{{ profile.expiringDate }}到期</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-4">
            <RouterLink :to="{ name: 'coupon-trade' }" class="card border-0 rounded-4 text-decoration-none text-body h-100">
              <div class="card-body px-5 py-4 d-flex flex-column justify-content-between">
                <div class="d-flex justify-content-between align-items-center">
                  <Icon icon="ph:ticket-light" width="32" height="32" class="text-body-secondary"/>
                  <span class="display-3">{{ profile.coupons }}</span>
                </div>
                <h4 class="mt-2 mb-0">優惠券</h4>
                <div class="caption-2 mt-1 text-body-secondary">{{ profile.expiringCoupons }}張將於{{ profile.expiringDate }}到期</div>
              </div>
            </RouterLink>
          </div>
          <div class="col-12 col-md-4">
            <div class="card border-0 rounded-4 h-100 overflow-hidden">
              <div class="card-body p-0 d-flex">
                <div class="flex-grow-1 px-5 py-4 gap-3 d-flex flex-column justify-content-between">
                  <div class="d-flex justify-content-between align-items-center">
                    <Icon icon="ph:target-light" width="32" height="32" class="text-body-secondary"/>
                    <span class="display-4 ms-auto">{{ profile.points }}/{{ goal.price }}
                    </span>
                  </div>
                  <div class="progress rounded-pill bg-warning-subtle" style="height: 4px;">
                    <div class="progress-bar rounded-pill bg-warning" :style="{ width: goalPct + '%' }" />
                  </div>
                  <div class="flex-shrink-1">
                    <h4 class="mb-0 lh-1">集點目標</h4>
                    <div class="caption-2 mt-1 text-body-secondary">{{ goal.name }}</div>
                  </div>
                </div>
                <div class="summary-reward-img flex-shrink-0" :style="{ background: goal.img }" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Smart recommendation: mobile only -->
      <section class="rec-col d-md-none pt-5">
        <h3 class="mb-md-7">智慧推薦</h3>
        <div class="rec-fade-wrap">
          <Transition name="rec-fade">
            <RouterLink :to="rec.to" :key="currentIndex" class="card p-3 border-0 shadow-lg rounded-5 text-decoration-none text-body">
              <div class="card-body d-flex align-items-center gap-5 p-5">
                <div class="flex-grow-1">
                  <p class="fw-bold mb-1">{{ rec.title }}</p>
                  <p class="text-body-secondary small mb-0" style="text-wrap: pretty;">{{ rec.sub }}</p>
                </div>
                <img :src="rec.img" class="rec-card-img rounded-3 border border-4 border-light shadow-lg flex-shrink-0" alt="" />
              </div>
            </RouterLink>
          </Transition>
        </div>
      </section>
    </div>

    <!-- Smart recommendations row: tablet+ only -->
    <section class="d-none d-md-block pt-5 pb-9">
      <h3 class="ms-7 mb-4">智慧推薦</h3>
      <TransitionGroup name="rec-slide" tag="div" class="rec-row d-flex gap-4">
        <RouterLink v-for="r in recTriple" :to="r.to" :key="r.id" class="rec-card-fixed card p-3 border-0 shadow-lg rounded-5 text-decoration-none text-body">
          <div class="card-body d-flex align-items-center gap-5 p-5">
            <div class="flex-grow-1 min-w-0">
              <p class="fw-bold mb-1 text-nowrap text-truncate">{{ r.title }}</p>
              <p class="rec-card-sub text-body-secondary small mb-0">{{ r.sub }}</p>
            </div>
            <img :src="r.img" class="rec-card-img rounded-3 flex-shrink-0 border border-4 border-light shadow-lg" alt="" />
          </div>
        </RouterLink>
      </TransitionGroup>
    </section>

    <!-- Tiles section -->
    <section>
      <!-- md+: single horizontal wrapping row -->
      <div class="tiles-row d-none d-md-flex px-default py-5 gap-3">
        <ActionTile label="累點活動" icon="ph:calendar-star-duotone" :to="{ name: 'earn-events' }" variant="gray" />
        <ActionTile label="累點地圖" icon="ph:map-trifold-duotone" :to="{ name: 'in-development' }" disabled variant="gray" />
        <ActionTile v-for="a in actions" :key="a.label" :label="a.label" :icon="a.icon" :to="a.to" :disabled="isStub(a.to)" variant="gray" />
      </div>

      <!-- mobile: two separate grid groups -->
      <div class="d-md-none d-flex flex-column gap-8 px-default py-5">
        <div>
          <h3 class="mb-4">累積捷運點</h3>
          <div class="tile-grid row g-3">
            <div class="col-6"><ActionTile label="累點活動" icon="ph:calendar-star-duotone" :to="{ name: 'earn-events' }" variant="gray" /></div>
            <div class="col-6"><ActionTile label="累點地圖" icon="ph:map-trifold-duotone" :to="{ name: 'in-development' }" disabled variant="gray" /></div>
          </div>
        </div>
        <div>
          <h3 class="mb-4">使用捷運點</h3>
          <div class="tile-grid row g-3">
            <div v-for="a in actions" :key="a.label" class="col-6">
              <ActionTile :label="a.label" :icon="a.icon" :to="a.to" :disabled="isStub(a.to)" variant="gray" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Joined events -->
    <section class="px-default py-5">
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
    <section class="px-default py-5">
      <h3 class="mb-4">這樣換，最划算</h3>
      <div class="card-row d-flex gap-4 pb-2">
        <RowCard
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

<style lang="scss" scoped>
.home {
  max-width: 720px;
  @media (min-width: 768px) {
    max-width: 100%;
  }
}
.rec-thumb {
  width: 56px;
  height: 56px;
}
.banner-frame {
  position: relative;
  // reserve space so the real image sits below the frosted band; the band above is filled by
  // .banner-extend (a mirror of the image top), keeping the full banner visible under the toolbar
}
.hero-blur-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px; // frosts the .banner-extend band behind the (transparent) toolbar
  z-index: 3;
  pointer-events: none;
  // backdrop-filter: blur(20px);
  // -webkit-backdrop-filter: blur(20px);
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
.summary-reward-img {
  width: 72px;
  background-size: cover;
  background-position: center;
}
.tiles-row {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline-start: var(--px-tablet-content);
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding-inline-end: var(--px-tablet-content);
}
.tiles-row::-webkit-scrollbar {
  display: none;
}
.summary-col {
  flex: 3 1 0;
  min-width: 0;
}
// tablet: summary cards shrink to a fixed width and scroll horizontally if they overflow
@media (min-width: 768px) {
  .summary-col {
    flex: 0 1 auto;
  }
  .summary-row {
    flex-wrap: nowrap;
    overflow-x: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .summary-row::-webkit-scrollbar {
    display: none;
  }
  .summary-row > [class*='col-'] {
    flex: 0 0 auto;
    width: 200px;
  }
  .summary-row > [class*='col-']:last-child {
    width: 280px; // goal card (with reward image) a touch wider
  }
}
.rec-col {
  flex: 1 1 0;
  min-width: 0;
}
.rec-card-img {
  width: 72px;
  height: 72px;
  object-fit: cover;
  rotate: 3deg;
}
.rec-fade-wrap {
  position: relative;
}
.rec-fade-enter-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.rec-fade-leave-active {
  transition: opacity 0.35s ease;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.rec-fade-enter-from { opacity: 0; transform: translateY(16px); } // float up
.rec-fade-leave-to   { opacity: 0; }
// tablet+ recommendation row: fixed-size cards, one swaps at a time, row scrolls if it overflows
.min-w-0 {
  min-width: 0;
}
.rec-row {
  position: relative;
  overflow-x: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding-block: 32px;
  margin-block: -32px;
}
.rec-row::-webkit-scrollbar {
  display: none;
}
.rec-card-fixed {
  flex: 0 0 auto;
  width: 320px;

  &:first-child{
    margin-inline-start: var(--px-tablet-content);
  }
}
.rec-slide-move {
  transition: transform 0.8s ease;
}
.rec-slide-enter-active {
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.rec-slide-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
  position: absolute;
  top: 0;
  right: 0;
  width: 320px; // matches .rec-card-fixed
}
.rec-slide-enter-from { opacity: 0; transform: translateY(16px); } // float up
.rec-slide-leave-to   { opacity: 0; }
.tiles-row :deep(.action-tile) {
  width: 185px;
  flex-shrink: 0;
  scroll-snap-align: start;
}
// 400–700px: action tiles go from 2 columns to 3
@media (min-width: 400px) and (max-width: 767.98px) {
  .tile-grid > .col-6 {
    width: 33.3333%;
  }
}
</style>
