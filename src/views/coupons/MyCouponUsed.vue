<script setup>
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Mock data - in a real app, this would be passed via state or fetched via ID
const couponData = {
  store: '路易莎咖啡',
  title: '50元現金折價券',
  usedAt: '2024/05/20 14:30',
  orderId: 'LSA-8829-102',
  image: 'https://placehold.co/400x400?text=Louisa'
}

const goHome = () => router.push('/')
const goBackToCoupons = () => router.back()
</script>

<template>
  <div class="my-coupon-used d-flex flex-column bg-white">
    <!-- Header -->
    <header class="p-3 d-flex align-items-center">
      <button class="btn btn-link text-dark p-0" @click="goBackToCoupons">
        <Icon icon="f7:xmark" width="24" height="24" />
      </button>
    </header>

    <main class="flex-grow-1 px-4 py-2 d-flex flex-column align-items-center">
      <!-- Success Visual -->
      <div class="success-visual my-5 py-4">
        <div class="check-container position-relative">
          <div class="success-pulse"></div>
          <Icon icon="f7:checkmark-circle-fill" width="100" height="100" class="text-success" />
        </div>
      </div>

      <h2 class="h4 fw-bold mb-2">使用成功</h2>
      <p class="text-secondary text-center mb-5">
        已成功使用優惠券<br>
        感謝您的參與！
      </p>

      <!-- Transaction Details Card -->
      <div class="details-card w-100 rounded-4 p-4 mb-5 border">
        <div class="d-flex align-items-center mb-4">
          <img :src="couponData.image" class="rounded-3 me-3" width="50" height="50" style="object-fit: cover;">
          <div>
            <div class="smaller text-muted">{{ couponData.store }}</div>
            <div class="fw-bold">{{ couponData.title }}</div>
          </div>
        </div>

        <div class="info-row d-flex justify-content-between mb-3">
          <span class="text-secondary smaller">使用時間</span>
          <span class="smaller fw-medium">{{ couponData.usedAt }}</span>
        </div>
        <div class="info-row d-flex justify-content-between">
          <span class="text-secondary smaller">票券編號</span>
          <span class="smaller fw-medium text-uppercase">{{ couponData.orderId }}</span>
        </div>
      </div>

      <!-- Bottom Actions -->
      <div class="w-100 mt-auto pb-5">
        <button class="btn btn-primary w-100 rounded-pill py-3 fw-bold mb-3 shadow-sm" @click="goBackToCoupons">
          返回我的優惠券
        </button>
        <button class="btn btn-link text-secondary w-100 text-decoration-none smaller" @click="goHome">
          回到首頁
        </button>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.my-coupon-used {
  min-height: 100dvh;
  .success-visual {
    .check-container {
      z-index: 1;
    }
    .success-pulse {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 140px;
      height: 140px;
      background: radial-gradient(circle, rgba(25, 135, 84, 0.15) 0%, rgba(25, 135, 84, 0) 70%);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
  }

  .details-card {
    background-color: #fafafa;
    border-color: rgba(0,0,0,0.05) !important;
  }

  .smaller {
    font-size: 0.875rem;
  }

  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(0.95);
      opacity: 0.7;
    }
    70% {
      transform: translate(-50%, -50%) scale(1.1);
      opacity: 0.3;
    }
    100% {
      transform: translate(-50%, -50%) scale(0.95);
      opacity: 0.7;
    }
  }
}
</style>