<script setup>
// 收禮頁 — 送禮閉環的終點。動作對應訪談痛點:
//  • 附近可使用店家 bottom sheet:收禮者不用自己研究哪裡能用(嵌入既有動線)
//  • 到期提醒:LINE 禮物「提醒被淹沒→過期退回」的解法
//  • 使用禮物 → 已兌換章,之後不可再操作(設計文件:「已兌換,無法做其他操作」)
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import FlipCard from '@/components/gift/FlipCard.vue'
import QrFace from '@/components/gift/QrFace.vue'
import ProductFace from '@/components/gift/ProductFace.vue'
import { useGiftsStore } from '@/stores/gifts.js'
import { getProfile } from '@/data/profile.js'
import { stationPhotos } from '@/data/stationPhotos.js'

const route = useRoute()
const router = useRouter()
const gifts = useGiftsStore()
const profile = getProfile()

// Load the sent gift by id; fall back to the most recently sent gift.
const gift = computed(() => {
  const byId = route.query.id ? gifts.getGiftById(route.query.id) : null
  return byId ?? gifts.gifts[gifts.gifts.length - 1] ?? null
})
const sender = computed(() => gift.value?.signature || profile.name)
const redeemed = computed(() => gift.value?.status === 'redeemed')
const reminderOn = computed(() => !!gift.value?.reminderEnabled)

function redeem() {
  if (gift.value) gifts.redeemGift(gift.value.id)
}

// 到期提醒要真的能通知,所以這裡向瀏覽器要通知權限;被封鎖時開關不該假裝成功。
const notifyPerm = ref(typeof Notification === 'undefined' ? 'unsupported' : Notification.permission)
const notifyBlocked = computed(
  () => notifyPerm.value === 'denied' || notifyPerm.value === 'unsupported',
)

async function toggleReminder() {
  if (!gift.value) return
  if (!reminderOn.value && notifyPerm.value === 'default') {
    notifyPerm.value = await Notification.requestPermission()
  }
  if (notifyBlocked.value) return // 保持關閉,列表改顯示被封鎖狀態
  gifts.toggleReminder(gift.value.id)
}

// 附近可使用店家 bottom sheet(資料先用捷運站示意)
const sheetOpen = ref(false)
const nearbyStations = stationPhotos.slice(0, 4)

const addedToGo = ref(false)
const addedToCalendar = ref(false)
</script>

<template>
  <!-- 內容垂直置中(內容過長時 my-auto 會退讓,仍可正常捲動) -->
  <div class="gift-received overflow-auto h-100 p-5 d-flex flex-column">
    <div class="row g-6 justify-content-center mx-auto my-auto w-100" style="max-width: 920px">
      <!-- Card -->
      <div class="col-12 col-md-6">
        <div class="card-wrap mx-auto w-100 position-relative">
          <FlipCard>
            <template #front>
              <QrFace
                :name="gift?.name"
                :price="gift?.price"
                :img="gift?.img"
                :expired-date="gift?.expiredDate"
              />
            </template>
            <template #back>
              <img
                v-if="gift?.cardImage"
                :src="gift.cardImage"
                class="rounded-1 w-100 h-100"
                style="object-fit: cover; aspect-ratio: 2 / 3"
                alt="禮物卡片"
              />
              <ProductFace
                v-else
                :name="gift?.name"
                :price="gift?.price"
                :img="gift?.img"
                :expired-date="gift?.expiredDate"
              />
            </template>
          </FlipCard>
          <span v-if="redeemed" class="redeemed-stamp fw-bold">已兌換</span>
          <p class="text-center text-body-secondary small mt-4 mb-0">點擊以查看卡片</p>
        </div>
      </div>

      <!-- Header + actions -->
      <div class="col-12 col-md-6">
        <div class="d-flex align-items-center gap-3 mb-4">
          <span class="avatar rounded-circle overflow-hidden bg-secondary d-flex align-items-center justify-content-center flex-shrink-0">
            <img v-if="profile.avatar" :src="profile.avatar" class="w-100 h-100" style="object-fit:cover" alt="" />
            <Icon v-else icon="ph:user-fill" class="text-white" width="22" height="22" />
          </span>
          <h2 class="h5 fw-bold mb-0"><span class="text-primary">{{ sender }}</span> 送了一個禮物給你</h2>
        </div>

        <!-- 送禮人留言 -->
        <div v-if="gift?.message" class="bg-primary-subtle rounded-4 px-5 py-4 mb-5">
          <p class="mb-0 text-body">「{{ gift.message }}」</p>
        </div>

        <!-- 使用禮物 -->
        <button
          type="button"
          class="btn btn-primary rounded-pill py-3 fw-bold w-100 mb-5 d-flex align-items-center justify-content-center gap-2"
          :disabled="!gift || redeemed"
          @click="redeem"
        >
          <Icon :icon="redeemed ? 'ph:check-circle-light' : 'ph:qr-code-light'" width="20" height="20" />
          {{ redeemed ? '已兌換' : '使用禮物' }}
        </button>

        <div class="action-list" :class="{ 'redeemed-lock': redeemed }">
          <div class="list-group list-group-flush">
            <button
              type="button"
              class="list-group-item list-group-item-action d-flex align-items-center gap-4 py-5 px-4"
              :disabled="redeemed"
              @click="sheetOpen = true"
            >
              <Icon icon="ph:magnifying-glass-light" class="text-body-secondary" width="24" height="24" />
              <span class="flex-grow-1 text-start">搜尋附近可使用店家</span>
              <Icon icon="ph:caret-right-light" class="text-body-tertiary" width="24" height="24" />
            </button>

            <button
              type="button"
              class="list-group-item list-group-item-action d-flex align-items-center gap-4 py-5 px-4"
              :disabled="redeemed"
              @click="addedToGo = !addedToGo"
            >
              <Icon
                :icon="addedToGo ? 'ph:check-circle-light' : 'ph:plus-circle-light'"
                :class="addedToGo ? 'text-success' : 'text-body-secondary'"
                width="24" height="24"
              />
              <span class="flex-grow-1 text-start">
                {{ addedToGo ? '已加入 台北捷運Go' : '將禮物加入 台北捷運Go' }}
              </span>
              <Icon v-if="!addedToGo" icon="ph:caret-right-light" class="text-body-tertiary" width="24" height="24" />
            </button>

            <button
              type="button"
              class="list-group-item list-group-item-action d-flex align-items-center gap-4 py-5 px-4"
              :disabled="redeemed || notifyBlocked"
              @click="toggleReminder"
            >
              <Icon
                :icon="notifyBlocked ? 'ph:bell-slash-light' : reminderOn ? 'ph:check-circle-light' : 'ph:bell-light'"
                :class="reminderOn && !notifyBlocked ? 'text-success' : 'text-body-secondary'"
                width="24" height="24"
              />
              <span class="flex-grow-1 text-start">
                <template v-if="notifyBlocked">
                  通知已封鎖
                  <span class="d-block caption-2 text-body-secondary">請至瀏覽器設定開啟本站通知</span>
                </template>
                <template v-else-if="reminderOn">
                  已開啟到期提醒
                  <span class="d-block caption-2 text-body-secondary">到期前 7 天與 1 天提醒你</span>
                </template>
                <template v-else>開啟到期提醒</template>
              </span>
              <Icon
                v-if="!reminderOn && !notifyBlocked"
                icon="ph:caret-right-light" class="text-body-tertiary" width="24" height="24"
              />
            </button>

            <button
              type="button"
              class="list-group-item list-group-item-action d-flex align-items-center gap-4 py-5 px-4"
              :disabled="redeemed"
              @click="addedToCalendar = !addedToCalendar"
            >
              <Icon
                :icon="addedToCalendar ? 'ph:check-circle-light' : 'ph:calendar-plus-light'"
                :class="addedToCalendar ? 'text-success' : 'text-body-secondary'"
                width="24" height="24"
              />
              <span class="flex-grow-1 text-start">
                {{ addedToCalendar ? '已將到期期限加入行事曆' : '將到期期限加入行事曆' }}
              </span>
              <Icon v-if="!addedToCalendar" icon="ph:caret-right-light" class="text-body-tertiary" width="24" height="24" />
            </button>

            <button
              type="button"
              class="list-group-item list-group-item-action d-flex align-items-center gap-4 py-5 px-4"
              :disabled="redeemed"
              @click="router.push({ name: 'gift-home' })"
            >
              <Icon icon="ph:note-pencil-light" class="text-body-secondary" width="24" height="24" />
              <span class="flex-grow-1 text-start">回禮小卡</span>
              <Icon icon="ph:caret-right-light" class="text-body-tertiary" width="24" height="24" />
            </button>
          </div>
        </div>

        <div class="alert alert-info d-flex align-items-start gap-3 mt-5 py-4" role="alert">
          <Icon icon="ph:ticket-light" class="flex-shrink-0 mt-1" width="24" height="24" />
          <div>
            <strong>第一次收到禮物嗎？</strong>
            現在註冊，額外贈送捷運點，折抵捷運週邊店家消費
          </div>
        </div>
      </div>
    </div>

    <!-- 附近可使用店家 bottom sheet -->
    <Transition name="fade">
      <div v-if="sheetOpen" class="sheet-overlay" @click="sheetOpen = false" />
    </Transition>
    <Transition name="slide-up">
      <div v-if="sheetOpen" class="nearby-sheet bg-body rounded-top-4 shadow-lg">
        <div class="d-flex justify-content-between align-items-center px-5 pt-5 pb-4">
          <h3 class="h6 fw-bold mb-0">附近可使用店家</h3>
          <button type="button" class="btn btn-link p-0 text-body-secondary" @click="sheetOpen = false">
            <Icon icon="ph:x-light" width="24" height="24" />
          </button>
        </div>
        <div class="list-group list-group-flush px-5 pb-4">
          <div
            v-for="st in nearbyStations"
            :key="st.id"
            class="list-group-item d-flex align-items-center gap-4 py-4 px-0"
          >
            <img :src="st.src" class="station-thumb rounded-3 flex-shrink-0" :alt="st.name" />
            <div class="flex-grow-1 min-w-0">
              <div class="fw-bold text-truncate">{{ st.name }}</div>
              <div class="caption-2 text-body-secondary">出站即可使用 · 出示 QR code 兌換</div>
            </div>
            <Icon icon="ph:map-pin-light" class="text-body-tertiary flex-shrink-0" width="24" height="24" />
          </div>
        </div>
        <div class="px-5 pb-6">
          <RouterLink
            :to="{ name: 'use-coupons' }"
            class="btn btn-outline-primary rounded-pill w-100 py-3 fw-bold"
          >
            查看完整使用地點
          </RouterLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.card-wrap {
  max-width: 320px;
}
.avatar {
  width: 40px;
  height: 40px;
}
/* hover/active 高亮向外擴 12px(=px-4),文字仍與上方標題對齊 */
.action-list .list-group-item {
  margin-inline: -12px;
  width: calc(100% + 24px);
}
.redeemed-lock {
  opacity: 0.55;
}
/* 已兌換鋼印 — 與 CouponsView/GiftsHistoryView 的 stamp 視覺一致,置於卡片中央 */
.redeemed-stamp {
  position: absolute;
  top: 42%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-12deg);
  border: 3px solid var(--bs-danger);
  color: var(--bs-danger);
  font-size: 28px;
  padding: 6px 16px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.85);
  letter-spacing: 4px;
  z-index: 5;
  pointer-events: none;
}

/* bottom sheet */
.sheet-overlay {
  position: fixed;
  inset: 0;
  background: var(--overlay, rgba(0, 0, 0, 0.4));
  z-index: 1040;
}
.nearby-sheet {
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
.station-thumb {
  width: 56px;
  height: 56px;
  object-fit: cover;
}
.min-w-0 {
  min-width: 0;
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
