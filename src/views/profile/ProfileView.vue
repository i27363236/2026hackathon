<script setup>
// 單純靜態畫面,不寫任何資料庫邏輯。
// 版型:單欄 + .container-form(630px,與商品頁同寬),平板不分欄;間距/排列一律走 Bootstrap utility。
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import MedalSection from '@/components/profile/MedalSection.vue'
import MetroLineBadge from '@/components/common/MetroLineBadge.vue'
import GiftGrid from '@/components/cards/GiftGrid.vue'
import { getProfile, getAchievements, getStamps, getSentGifts } from '@/data/profile.js'
import { useSettingsStore } from '@/stores/settings.js'
import pointIcon from '@/img/metro-point.png'

const profile = getProfile()
const achievements = getAchievements()
const stamps = getStamps()
const sentGifts = getSentGifts()
const settings = useSettingsStore()

// 防偽底紋的格數 — 底紋整層是斜的,要多鋪幾排才蓋得滿最寬卡片(630px)旋轉後的外框。
const PATTERN_ROWS = 9
const PATTERN_COLS = 16

// 個人資料卡的拖曳 3D 傾斜 — 像拿著一張實體卡片轉動,放開回正。
const MAX_TILT = 8 // deg
const rotateX = ref(0)
const rotateY = ref(0)
const dragging = ref(false)
let startX = 0
let startY = 0

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const clamp = (v) => Math.max(-MAX_TILT, Math.min(MAX_TILT, v))

function onPointerDown(e) {
  if (reduceMotion()) return
  dragging.value = true
  startX = e.clientX
  startY = e.clientY
  e.currentTarget.setPointerCapture?.(e.pointerId)
}

function onPointerMove(e) {
  if (!dragging.value) return
  rotateY.value = clamp((e.clientX - startX) / 12)
  rotateX.value = clamp((startY - e.clientY) / 12)
}

function onPointerUp() {
  dragging.value = false
  rotateX.value = 0
  rotateY.value = 0
}
</script>

<template>
  <div class="profile-view h-100 overflow-auto bg-body-secondary px-default py-6">
    <div class="profile-container d-flex flex-column gap-6">

      <!-- 個人資料卡 — 全頁唯一保留陰影的主角卡,可拖曳微傾斜 -->
      <div
        class="card profile-card position-relative overflow-hidden border rounded-4 d-flex flex-row justify-content-center align-items-center p-8"
        :class="{ 'is-dragging': dragging }"
        :style="{ transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)` }"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <!-- 捷運點底紋(防偽網紋感):整層斜放,偶數排錯開半格,隨傾斜方向微幅位移做視差 -->
        <div
          class="pc-pattern position-absolute overflow-hidden pe-none"
          aria-hidden="true"
          :style="{ transform: `translate3d(${rotateY * -1.5}px, ${rotateX * 1.5}px, 0) rotate(-12deg)` }"
        >
          <div
            v-for="r in PATTERN_ROWS"
            :key="r"
            class="d-flex flex-nowrap gap-7 mb-5"
            :class="{ 'pc-row-offset': r % 2 === 0 }"
          >
            <img v-for="c in PATTERN_COLS" :key="c" :src="pointIcon" alt="" class="pc-coin" />
          </div>
        </div>

        <div class="position-relative d-flex flex-column align-items-center gap-3 flex-shrink-0">
          <img :src="profile.avatar" :alt="`${profile.name}的頭像`" class="profile-avatar rounded-circle object-fit-cover" />
          <div class="h3 fw-bold text-black mb-0">{{ profile.name }}</div>
        </div>

        <div class="position-relative d-flex flex-column align-items-start gap-4 ms-7 ps-7">
          <div class="d-flex flex-column">
            <div class="caption-1">里程數</div>
            <div class="stat-value fw-bold">
              968 <span class="caption-1 fw-medium text-body-secondary ms-2">km</span>
            </div>
          </div>
          <div class="d-flex flex-column">
            <div class="caption-1">減碳數 🌱</div>
            <div class="stat-value fw-bold">
              17.6 <span class="caption-1 fw-medium text-body-secondary ms-2">kg</span>
            </div>
          </div>
          <div class="d-flex flex-column">
            <div class="caption-1">最愛車站</div>
            <div class="d-flex align-items-center gap-3">
              <div class="d-flex gap-2">
                <MetroLineBadge code="R" />
                <MetroLineBadge code="G" />
              </div>
              <div class="stat-value fw-bold text-black">中山</div>
            </div>
          </div>
        </div>
      </div>

      <MedalSection title="我的成就" :items="achievements" />

      <MedalSection title="我的紀念章" :items="stamps" hide-text />

      <section>
        <h2 class="mb-4">我的禮物</h2>
        <GiftGrid :products="sentGifts" />
      </section>

      <section>
        <h2 class="mb-4">設定</h2>
        <div class="action-list bg-white">
          <div class="list-group list-group-flush">
            <button
              type="button"
              class="list-group-item list-group-item-action d-flex align-items-center gap-4 py-5 px-4"
            >
              <span class="flex-grow-1 text-start">修改支付密碼</span>
              <Icon icon="ph:caret-right-light" class="text-body-tertiary" width="24" height="24" />
            </button>

            <button
              type="button"
              class="list-group-item list-group-item-action d-flex align-items-center gap-4 py-5 px-4"
            >
              <span class="flex-grow-1 text-start">設定綁定帳號</span>
              <Icon icon="ph:caret-right-light" class="text-body-tertiary" width="24" height="24" />
            </button>

            <label class="list-group-item d-flex align-items-center gap-4 py-5 px-4">
              <span class="flex-grow-1">情境推薦</span>
              <span class="form-check form-switch m-0 p-0">
                <input
                  v-model="settings.contextualRecs"
                  class="form-check-input m-0"
                  type="checkbox"
                  role="switch"
                />
              </span>
            </label>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 480px;
  margin-inline: auto;
}

/* 個人資料卡 — 邊框/圓角/排列走 utility,這裡只留沒有對應 utility 的部分 */
.profile-card {
  min-height: 180px;
  /* 上緣內光 + 落地陰影,做出一點厚度(雙層陰影無對應 utility) */
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 70%),
    0 10px 30px rgb(0 0 0 / 12%);
  transform-style: preserve-3d;
  transition: transform 0.35s ease;
  touch-action: none;
  user-select: none; /* 拖曳時不要選取到卡片文字 */
  cursor: grab;
}

.profile-card.is-dragging,
.profile-card.is-dragging .pc-pattern {
  transition: none;
}

.profile-card.is-dragging {
  cursor: grabbing;
}

/* 底紋層:大幅超出卡片邊界,斜放與視差位移時四角才不會露出來 */
.pc-pattern {
  inset: -60px;
  opacity: 0.06;
  transition: transform 0.35s ease;
}

.pc-row-offset {
  margin-left: 26px; /* 半格(圖 28 + 間距 24 的一半),讓上下排交錯 */
}

.pc-coin {
  width: 28px;
  height: 28px;
}

.profile-avatar {
  width: 85px;
  height: 85px;
  pointer-events: none;
}

/* 18px 介於 fs-4(20px) 與內文之間,沒有對應 utility */
.stat-value {
  font-size: 18px;
  color: var(--bs-body-color);
}
</style>
