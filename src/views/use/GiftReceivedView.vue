<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import FlipCard from '../../components/gift/FlipCard.vue'
import QrFace from '../../components/gift/QrFace.vue'
import ProductFace from '../../components/gift/ProductFace.vue'
import { useGiftsStore } from '../../stores/gifts.js'
import { getProfile } from '../../data/profile.js'

const route = useRoute()
const gifts = useGiftsStore()
const profile = getProfile()

// Load the sent gift by id; fall back to the most recently sent gift.
const gift = computed(() => {
  const byId = route.query.id ? gifts.getGiftById(route.query.id) : null
  return byId ?? gifts.gifts[gifts.gifts.length - 1] ?? null
})
const sender = computed(() => gift.value?.signature || profile.name)

const actions = [
  { label: '搜尋附近可使用店家', icon: 'ph:magnifying-glass-light' },
  { label: '將禮物加入 台北捷運Go', icon: 'ph:plus-circle-light' },
  { label: '開啟到期提醒', icon: 'ph:bell-light' },
  { label: '將到期期限加入行事曆', icon: 'ph:calendar-plus-light' },
  { label: '回禮小卡', icon: 'ph:note-pencil-light' },
]
</script>

<template>
  <div class="gift-received overflow-auto h-100 p-5">
    <div class="row g-6 justify-content-center mx-auto" style="max-width: 920px">
      <!-- Card -->
      <div class="col-12 col-md-6">
        <div class="card-wrap mx-auto w-100">
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
          <p class="text-center text-body-secondary small mt-4 mb-0">點擊以查看卡片</p>
        </div>
      </div>

      <!-- Header + actions -->
      <div class="col-12 col-md-6">
        <div class="d-flex align-items-center gap-3 mb-5">
          <span class="avatar rounded-circle overflow-hidden bg-secondary d-flex align-items-center justify-content-center flex-shrink-0">
            <img v-if="profile.avatar" :src="profile.avatar" class="w-100 h-100" style="object-fit:cover" alt="" />
            <Icon v-else icon="ph:user-fill" class="text-white" width="22" height="22" />
          </span>
          <h2 class="h5 fw-bold mb-0"><span class="text-primary">{{ sender }}</span> 送了一個禮物給你</h2>
        </div>

        <div class="action-list">
          <div class="list-group list-group-flush">
            <button
              v-for="a in actions"
              :key="a.label"
              type="button"
              class="list-group-item list-group-item-action d-flex align-items-center gap-4 py-5 px-0"
            >
              <Icon :icon="a.icon" class="text-body-secondary" width="24" height="24" />
              <span class="flex-grow-1 text-start">{{ a.label }}</span>
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
</style>
