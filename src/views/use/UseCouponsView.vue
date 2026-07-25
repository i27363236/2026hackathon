<script setup>
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import TopToolbar from '@/components/TopToolbar.vue'
import ContentCard from '@/components/cards/ContentCard.vue'
import { getCoupons } from '@/data/coupons.js'

const router = useRouter()
const coupons = getCoupons()

/**
 * 優惠券頁面專用的輪播資料
 */
const couponSlides = [
  {
    eyebrow: '限時領取',
    title: '全家咖啡買一送一',
    subtitle: '捷點兌換專屬優惠',
    date: '06.01 — 06.15',
    gradient: 'linear-gradient(135deg, #005596, #007bc3)',
  },
  {
    eyebrow: '熱門推薦',
    title: '誠品書店 $50 折價券',
    subtitle: '滿 $500 即可使用',
    date: '05.20 — 06.30',
    gradient: 'linear-gradient(135deg, #4a5a4a, #6a8a6a)',
  }
]

const handleBack = () => {
  router.back()
}
</script>

<template>
  <div class="use-coupons-view container-content d-flex flex-column">
    <!-- 頂部導覽列 -->
    <TopToolbar title="使用優惠券" show-back @back="handleBack" />

    <main class="flex-grow-1 px-default py-5 d-flex flex-column gap-8">
      <!-- 優惠券主題輪播 -->
      <section>
        <div id="couponCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
          <div class="carousel-inner">
            <div
              v-for="(slide, i) in couponSlides"
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
                <!-- 使用票券圖示呼應頁面主題 -->
                <Icon icon="ph:ticket" class="hero-ticket position-absolute opacity-50" width="160" height="160" />
              </div>
            </div>
          </div>

          <div class="carousel-indicators hero-indicators">
            <button
              v-for="(_, i) in couponSlides"
              :key="i"
              type="button"
              data-bs-target="#couponCarousel"
              :data-bs-slide-to="i"
              :class="{ active: i === 0 }"
            />
          </div>
        </div>
      </section>

      <!-- 優惠券列表 -->
      <section>
        <h3 class="h5 fw-bold mb-4">我的優惠券</h3>
        <div class="d-flex flex-wrap gap-4 pb-2">
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
    </main>
  </div>
</template>

<style scoped>
.use-coupons-view {
  min-height: 100dvh;
}

.hero {
  min-height: 180px;
}

.hero-ticket {
  right: -20px;
  bottom: -20px;
}

/* 複用 HomeView 的輪播指示器樣式 */
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
  border-radius: var(--bs-border-radius-pill);
  background: var(--bs-primary);
}
</style>
