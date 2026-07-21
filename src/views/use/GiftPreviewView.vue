<script setup>
// 禮物預覽 — 只負責看成品。收禮人 / 留言已在結帳頁收好(PurchaseCheckoutView),
// 這裡按下「送出禮物」就直接叫出系統分享面板把禮物連結送出去。
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
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

const sending = ref(false)
const copied = ref(false)

async function send() {
  if (sending.value) return
  sending.value = true

  // Persist the draft into the gifts list (if one is in progress) and carry its id forward
  // to the purchase-success page (the buyer's end of the flow; it links on to the recipient view).
  const recipient = gifts.draftGift?.recipient ?? ''
  const id = gifts.draftGift ? gifts.sendGift(recipient) : null

  // 收禮頁連結 — hash routing,所以 hash 前要保留原本的 path。
  const url = `${location.origin}${location.pathname}#/use/gift/received${id ? `?id=${id}` : ''}`
  const shareData = {
    title: '你收到一份捷運點禮物',
    text: `${gift.value.name} — 快來看看送給你的卡片！`,
    url,
  }

  if (navigator.share) {
    // 使用者取消分享(AbortError)也照樣完成送禮 — 禮物已經建立了。
    await navigator.share(shareData).catch(() => {})
  } else {
    // 桌機 / 無 Web Share API:退回複製連結,至少讓使用者拿得到禮物網址。
    await navigator.clipboard?.writeText(url).catch(() => {})
    copied.value = true
  }

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

      <div class="cta-wrap w-100 mt-6">
        <button
          type="button"
          class="btn btn-primary rounded-pill py-3 fw-bold w-100"
          :disabled="sending"
          @click="send"
        >
          送出禮物
        </button>
        <p v-if="copied" class="text-center text-body-secondary small mt-3 mb-0">已複製禮物連結</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-wrap {
  max-width: 340px;
}
.cta-wrap {
  max-width: 340px;
}
</style>
