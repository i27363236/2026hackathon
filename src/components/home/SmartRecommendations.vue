<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useSettingsStore } from '@/stores/settings.js'

const props = defineProps({
  recommendations: { type: Array, required: true },
})

const settings = useSettingsStore()
const sheetOpen = ref(false)

const currentIndex = ref(0)
const wrap = n => ((n % props.recommendations.length) + props.recommendations.length) % props.recommendations.length
const rec = computed(() => props.recommendations[wrap(currentIndex.value)])
const recTriple = computed(() => [0, 1, 2].map(offset => props.recommendations[wrap(currentIndex.value + offset)]))
let timer
// decrement so each tick a new card enters on the left and the rightmost leaves
onMounted(() => { timer = setInterval(() => { currentIndex.value-- }, 4_500) })
onUnmounted(() => { clearInterval(timer) })
</script>

<template>
  <!-- Smart recommendation: mobile only -->
  <section class="rec-col d-md-none px-default pt-3">
    <div class="rec-header d-flex align-items-center justify-content-between mb-4">
      <h3 class="mb-0">智慧推薦</h3>
      <button type="button" class="btn btn-link p-0 text-body-secondary d-flex align-items-center gap-1" @click="sheetOpen = true">
        <Icon icon="ph:info-light" width="16" />
        <span class="caption-2">為什麼推薦？</span>
      </button>
    </div>
    <div v-if="settings.contextualRecs" class="rec-fade-wrap">
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
    <div v-else class="card p-5 border-0 rounded-5 bg-secondary-subtle text-center">
      <p class="mb-2 text-body-secondary">已關閉情境推薦</p>
      <button type="button" class="btn btn-link p-0" @click="settings.setContextualRecs(true)">重新開啟</button>
    </div>
  </section>

  <!-- Smart recommendations row: tablet+ only -->
  <section class="d-none d-md-block pt-5 pb-9">
    <div class="rec-header d-flex align-items-center justify-content-between ms-7 me-7 mb-4">
      <h3 class="mb-0">智慧推薦</h3>
      <button type="button" class="btn btn-link p-0 text-body-secondary d-flex align-items-center gap-1" @click="sheetOpen = true">
        <Icon icon="ph:info-light" width="24" height="24" />
        <span class="caption-2">為什麼推薦？</span>
      </button>
    </div>
    <TransitionGroup v-if="settings.contextualRecs" name="rec-slide" tag="div" class="rec-row d-flex gap-4">
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
    <div v-else class="ms-7 me-7">
      <div class="card p-5 border-0 rounded-5 bg-secondary-subtle d-flex flex-row align-items-center justify-content-between">
        <span class="text-body-secondary">已關閉情境推薦</span>
        <button type="button" class="btn btn-link p-0" @click="settings.setContextualRecs(true)">重新開啟</button>
      </div>
    </div>
  </section>

  <!-- 為什麼推薦？bottom sheet(解說 + 隱私開關,重用 GiftReceivedView 的 sheet pattern) -->
  <Transition name="fade">
    <div v-if="sheetOpen" class="rec-sheet-overlay" @click="sheetOpen = false" />
  </Transition>
  <Transition name="slide-up">
    <div v-if="sheetOpen" class="rec-info-sheet bg-body rounded-top-4 shadow-lg">
      <div class="d-flex justify-content-between align-items-center px-5 pt-5 pb-4">
        <h3 class="h6 fw-bold mb-0">為什麼推薦這個？</h3>
        <button type="button" class="btn btn-link p-0 text-body-secondary" @click="sheetOpen = false">
          <Icon icon="ph:x-light" width="24" height="24" />
        </button>
      </div>
      <div class="px-5 pb-6">
        <section class="mb-5">
          <h4 class="caption-1 fw-bold text-body-secondary mb-2">怎麼推薦</h4>
          <p class="mb-0 text-body">
            開啟當下會參考三個情境訊號：現在的時間(例如上班日的早餐時段)、
            你所在的車站出口(例如「3 號出口」附近的店家)、
            以及即將到期的點數或優惠券。
          </p>
        </section>
        <section class="mb-5">
          <h4 class="caption-1 fw-bold text-body-secondary mb-2">不蒐集什麼</h4>
          <p class="mb-0 text-body">
            不會儲存、不會回傳到伺服器，也不會建立你的瀏覽紀錄 ——
            推薦在開啟當下運算，關掉頁面就忘記。
          </p>
        </section>
        <section>
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h4 class="caption-1 fw-bold text-body-secondary mb-1">你可以關閉</h4>
              <p class="mb-0 caption-2 text-body-secondary">關閉後不再顯示情境推薦</p>
            </div>
            <div class="form-check form-switch p-0 m-0">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                v-model="settings.contextualRecs"
                style="width: 2.5em; height: 1.25em; cursor: pointer"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.rec-col {
  min-width: 0;
}
// .rec-row's negative margin-block trick (shadow overflow room) visually overlaps the 32px
// above it — without this, that overlap intercepts clicks on the header button sitting there.
.rec-header {
  position: relative;
  z-index: 2;
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

/* 為什麼推薦？bottom sheet */
.rec-sheet-overlay {
  position: fixed;
  inset: 0;
  background: var(--overlay, rgba(0, 0, 0, 0.4));
  z-index: 1040;
}
.rec-info-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1050;
  max-width: 560px;
  margin-inline: auto;
  max-height: 75dvh;
  overflow-y: auto;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
