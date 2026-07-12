<script setup>
// Figma 2184-10248:M 幣餘額 + 每日簽到 + 完整點數歷史紀錄內嵌單頁呈現(不再分頁)。
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { usePointsStore } from '@/stores/points.js'
import CheckinCard from '@/components/points/CheckinCard.vue'
import TransactionRow from '@/components/points/TransactionRow.vue'
import metroPointImg from '@/img/metro-point.png'

const { balance, expiringPoints, expiringDate, transactions } = storeToRefs(usePointsStore())
</script>

<template>
  <section class="my-point-section px-default py-5">
    <!-- 點數說明 -->
    <div class="d-flex justify-content-end mb-4">
      <button type="button" class="btn btn-link p-0 text-decoration-none text-body-secondary small d-flex align-items-center">
        點數說明
        <Icon icon="ph:question-light" class="ms-1" width="20" height="20" />
      </button>
    </div>

    <!-- 捷運點餘額 -->
    <div class="d-flex justify-content-between align-items-center mb-6">
      <div class="d-flex align-items-center gap-2">
        <img :src="metroPointImg" width="32" height="32" alt="捷運點" />
        <span class="display-3">{{ balance.toLocaleString() }}</span>
      </div>
      <span class="text-body">{{ expiringPoints }}點將於{{ expiringDate }}到期</span>
    </div>

    <!-- 每日簽到 -->
    <CheckinCard class="mb-7" />

    <!-- 點數歷史紀錄(完整清單內嵌) -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold mb-0">點數歷史紀錄</h3>
      <RouterLink
        :to="{ name: 'points-history' }"
        class="btn btn-sm btn-light rounded-pill px-3 py-1 border-0 small text-secondary text-decoration-none"
      >
        點數趨勢
      </RouterLink>
    </div>
    <div class="action-list bg-white">
      <div class="list-group list-group-flush">
        <TransactionRow v-for="tx in transactions" :key="tx.id" :tx="tx" />
      </div>
    </div>
  </section>
</template>