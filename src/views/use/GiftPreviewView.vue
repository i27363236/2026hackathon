<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import FlipCard from '../../components/gift/FlipCard.vue'
import CouponCard from '../../components/gift/CouponCard.vue'
import GiftCard from '../../components/gift/GiftCard.vue'

const route = useRoute()
const router = useRouter()

const message = computed(() => route.query.msg ?? '')
const signature = computed(() => route.query.sign ?? '')

function send() {
  router.push({ name: 'use-gift-received', query: route.query })
}
</script>

<template>
  <div class="gift-preview d-flex flex-column h-100">
    <div class="content flex-grow-1 overflow-auto p-5 d-flex flex-column align-items-center justify-content-center">
      <div class="card-wrap w-100">
        <FlipCard>
          <template #front>
            <CouponCard title="誠品生活｜100元優惠券" expiry="2 個月 · 2026/6/30 到期" :value="100" />
          </template>
          <template #back>
            <GiftCard :message="message" :signature="signature" />
          </template>
        </FlipCard>
        <p class="text-center text-body-secondary small mt-4 mb-0">點擊以翻面</p>
      </div>
    </div>

    <div class="footer border-top bg-body p-5">
      <button type="button" class="btn btn-primary rounded-pill py-3 d-flex align-items-center justify-content-center gap-2 mx-auto w-100" style="max-width: 380px" @click="send">
        <Icon icon="ph:share-network" width="20" height="20" /> 送出禮物
      </button>
    </div>
  </div>
</template>

<style scoped>
.card-wrap {
  max-width: 340px;
}
.footer {
  position: sticky;
  bottom: 0;
}
</style>
