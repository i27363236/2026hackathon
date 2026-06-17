<script setup>
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="in-dev d-flex flex-column align-items-center justify-content-center text-center px-7">
    <Icon icon="ph:wrench-light" width="64" height="64" class="mb-6 text-body-tertiary" />
    <h2 class="fw-bold mb-3">開發中</h2>
    <p class="text-body-secondary mb-7">此功能即將推出，敬請期待。</p>
    <button class="btn btn-outline-secondary rounded-pill px-6" @click="router.back()">
      返回
    </button>
  </div>
</template>

<style lang="scss" scoped>
.in-dev {
  min-height: 60vh;
}
</style>
