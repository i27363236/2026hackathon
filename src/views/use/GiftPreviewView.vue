<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import FlipCard from '@/components/gift/FlipCard.vue'
import QrFace from '@/components/gift/QrFace.vue'
import ProductFace from '@/components/gift/ProductFace.vue'
import { useGiftsStore } from '@/stores/gifts.js'

const router = useRouter()
const gifts = useGiftsStore()

// Render the in-progress draft; fall back to a sample so the page is viewable on its own
// (e.g. opened directly during development, before a draft is seeded).
const SAMPLE = {
  name: '檸檬塔',
  price: 400,
  img: '#f1c40f',
  expiredDate: new Date(Date.now() + 60 * 86400000).toISOString(),
  cardImage: '',
}
const gift = computed(() => gifts.draftGift ?? SAMPLE)

function send() {
  // Persist the draft into the gifts list (if one is in progress) and carry its id forward
  // to the purchase-success page (the buyer's end of the flow; it links on to the recipient view).
  const id = gifts.draftGift ? gifts.sendGift('') : null
  router.push({ name: 'purchase-success', query: id ? { id } : {} })
}
</script>

<template>
  <div class="gift-preview d-flex flex-column h-100">
    <div class="content flex-grow-1 overflow-auto p-5 d-flex flex-column align-items-center justify-content-center">
      <div class="card-wrap w-100">
        <FlipCard>
          <template #front>
            <QrFace
              :name="gift.name"
              :price="gift.price"
              :img="gift.img"
              :expired-date="gift.expiredDate"
            />
          </template>
          <template #back>
            <!-- once the editor produces a card photo it shows here; otherwise the product face -->
            <img
              v-if="gift.cardImage"
              :src="gift.cardImage"
              class="rounded-1 w-100 h-100"
              style="object-fit: cover; aspect-ratio: 2 / 3"
              alt="禮物卡片"
            />
            <ProductFace
              v-else
              :name="gift.name"
              :price="gift.price"
              :img="gift.img"
              :expired-date="gift.expiredDate"
            />
          </template>
        </FlipCard>
        <p class="text-center text-body-secondary small mt-4 mb-0">點擊以翻面</p>
      </div>
    </div>

    <div class="footer border-top bg-body p-5">
      <button
        type="button"
        class="btn btn-primary rounded-pill py-3 d-flex align-items-center justify-content-center gap-2 mx-auto w-100"
        style="max-width: 380px"
        @click="send"
      >
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
