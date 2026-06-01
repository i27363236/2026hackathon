<script setup>
import { Icon } from '@iconify/vue'

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

const joinedEvents = [
  { title: '捷運到日市集', tag: '中山', img: '#cfe8c8' },
  { title: '信義計畫區音樂會', tag: '台北捷運', img: '#cfe1e8' },
  { title: '淡水老街美食探索', tag: '淡水', img: '#e8dfc8' },
  { title: '士林夜市市集', tag: '士林', img: '#e8cfd8' },
]

const deals = [
  { title: '台北捷運', point: 50, sub: '50元電子乘車金' },
  { title: '東森購物', point: 50, sub: '50元折價券' },
  { title: '全家便利商店', point: 50, sub: '50元折價券' },
  { title: '誠品生活', point: 50, sub: '50元抵用券' },
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

        <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" />
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
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

    <!-- Points summary -->
    <section class="card border-0 shadow-sm rounded-4">
      <div class="p-6">
        <div class="row g-0">
          <div class="col">
            <div class="display-6 lh-1">15</div>
            <div class="mt-2">
              捷點
            </div>
          </div>
          <div class="col">
            <div class="display-6 lh-1">3</div>
            <div class="mt-2">
              優惠券
            </div>
          </div>
        </div>
        <div class="mt-5">
          <div class="d-flex justify-content-between small text-body-secondary mb-2">
            <span>累積進度</span><span>15 / 50</span>
          </div>
          <div class="progress rounded-pill" style="height: 8px">
            <div class="progress-bar bg-primary" style="width: 30%" />
          </div>
        </div>
      </div>
    </section>

    <!-- Smart recommendation -->
    <section>
      <h3 class="h5 fw-bold mb-4">智慧推薦</h3>
      <div class="card border-0 shadow-lg rounded-4">
        <div class="card-body d-flex align-items-center gap-5 p-5">
          <div class="flex-grow-1">
            <p class="fw-bold mb-1">在 4 號出口兌換咖啡</p>
            <p class="text-body-secondary small mb-0">使用這張兌換好的優惠券</p>
          </div>
          <div class="rec-thumb rounded-3 d-flex align-items-center justify-content-center flex-shrink-0">
            <Icon icon="ph:coffee" width="32" height="32" class="text-body-secondary" />
          </div>
        </div>
      </div>
    </section>

    <!-- Quick tiles -->
    <section class="row g-4">
      <div class="col-6">
        <RouterLink :to="{ name: 'earn-events' }" class="tile-wide btn btn-info w-100 text-white d-flex align-items-center gap-3 p-5 rounded-4">
          <Icon icon="ph:calendar-star" width="24" height="24" /> 累積活動
        </RouterLink>
      </div>
      <div class="col-6">
        <RouterLink :to="{ name: 'earn-map' }" class="tile-wide btn btn-primary w-100 text-white d-flex align-items-center gap-3 p-5 rounded-4">
          <Icon icon="ph:map-trifold" width="24" height="24" /> 累積地圖
        </RouterLink>
      </div>
    </section>

    <!-- Action grid -->
    <section>
      <h3 class="h5 fw-bold mb-4">使用捷運點</h3>
      <div class="row g-4">
        <div v-for="a in actions" :key="a.label" class="col-4 col-md-3">
          <RouterLink :to="a.to" class="action-tile btn btn-success w-100 text-white d-flex flex-column align-items-center justify-content-center gap-2 rounded-4 py-5">
            <Icon :icon="a.icon" width="28" height="28" />
            <span class="small">{{ a.label }}</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Joined events -->
    <section>
      <h3 class="h5 fw-bold mb-4">大家都參加</h3>
      <div class="d-flex gap-4 overflow-auto pb-2">
        <div v-for="e in joinedEvents" :key="e.title" class="event-card card border-0 shadow-sm rounded-4 flex-shrink-0">
          <div class="event-img rounded-top-4" :style="{ background: e.img }" />
          <div class="card-body p-4">
            <span class="badge text-bg-light mb-2">{{ e.tag }}</span>
            <p class="small fw-bold mb-0">{{ e.title }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Best deals -->
    <section>
      <h3 class="h5 fw-bold mb-4">這樣換，最划算</h3>
      <div class="row g-4">
        <div v-for="d in deals" :key="d.title" class="col-6 col-md-3">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-body text-center p-4">
              <div class="h3 fw-bold text-danger mb-0">{{ d.point }}<span class="fs-6">元</span></div>
              <p class="small fw-bold mb-1">{{ d.title }}</p>
              <p class="text-body-secondary mb-0" style="font-size: 12px">{{ d.sub }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  max-width: 720px;
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
  background: var(--bs-body-secondary-bg);
}
.event-card {
  width: 160px;
}
.event-img {
  height: 90px;
}
.action-tile,
.tile-wide {
  border: none;
}
</style>
