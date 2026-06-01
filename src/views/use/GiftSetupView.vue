<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import GiftCard from '../../components/gift/GiftCard.vue'

const router = useRouter()
const message = ref('阿運：\n週末出差辛苦了，喝杯拿鐵，休息一下吧！')
const signature = ref('小捷')

function goPreview() {
  router.push({ name: 'use-gift-preview', query: { msg: message.value, sign: signature.value } })
}
</script>

<template>
  <div class="gift-setup d-flex flex-column h-100">
    <div class="content flex-grow-1 overflow-auto p-5">
      <div class="row g-6 justify-content-center mx-auto" style="max-width: 880px">
        <!-- Card preview -->
        <div class="col-12 col-md-6">
          <GiftCard :message="message" :signature="signature" />
        </div>

        <!-- Text editor -->
        <div class="col-12 col-md-6">
          <label class="form-label fw-bold" for="cardText">卡片內文</label>
          <textarea
            id="cardText"
            v-model="message"
            class="form-control rounded-4"
            rows="6"
            placeholder="寫下你想說的話…"
          />
        </div>
      </div>
    </div>

    <!-- Sticky footer -->
    <div class="footer border-top bg-body p-5">
      <div class="d-flex gap-4 mx-auto" style="max-width: 880px">
        <button type="button" class="btn btn-outline-secondary flex-fill rounded-pill py-3" @click="router.back()">
          上一步
        </button>
        <button type="button" class="btn btn-primary flex-fill rounded-pill py-3" @click="goPreview">
          預覽
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.footer {
  position: sticky;
  bottom: 0;
}
</style>
