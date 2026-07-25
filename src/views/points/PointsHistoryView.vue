<script setup>
// 點數紀錄(/points/history)— 三分頁:即將到期 / 累點明細 / 銷點明細。
// 「即將到期」直接回應訪談痛點「點數過期了才知道」;圖表呈現累/銷點行為趨勢。
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { usePointsStore } from '@/stores/points.js'
import PointsTrendChart from '@/components/points/PointsTrendChart.vue'
import TransactionRow from '@/components/points/TransactionRow.vue'

const points = usePointsStore()

const activeTab = ref('expiring')
const tabs = [
  { id: 'expiring', label: '即將到期' },
  { id: 'earn', label: '累點明細' },
  { id: 'burn', label: '銷點明細' },
]

const rows = computed(() => {
  if (activeTab.value === 'expiring') return points.expiringSoon
  if (activeTab.value === 'earn') return points.earnTransactions
  return points.burnTransactions
})

const pad = (n) => String(n).padStart(2, '0')
function expiryText(tx) {
  const d = new Date(tx.expiresAt)
  const days = Math.ceil((tx.expiresAt - Date.now()) / 86400000)
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} 到期（剩 ${days} 天）`
}
</script>

<template>
  <div class="points-history container-content px-default py-6">
    <PointsTrendChart class="mb-6" />

    <div class="nav nav-pills nav-fill bg-light rounded-pill p-1 shadow-sm mb-5">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="nav-link rounded-pill py-2 border-0"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="activeTab === 'expiring' && rows.length" class="alert alert-warning d-flex align-items-start gap-3 py-4" role="alert">
      <Icon icon="ph:clock-countdown-light" class="flex-shrink-0 mt-1" width="24" height="24" />
      <div class="small">
        共 <strong>{{ points.expiringPoints }} 點</strong>將在 30 天內到期，記得優先使用！
      </div>
    </div>

    <div class="list-group list-group-flush">
      <TransactionRow v-for="tx in rows" :key="tx.id" :tx="tx">
        <template v-if="activeTab === 'expiring'" #caption>{{ expiryText(tx) }}</template>
      </TransactionRow>
    </div>

    <div v-if="!rows.length" class="text-center py-5 mt-5">
      <Icon icon="ph:coins-light" width="64" height="64" class="text-secondary opacity-25 mb-3" />
      <p class="text-secondary">目前沒有紀錄</p>
    </div>
  </div>
</template>

<style scoped>
.nav-pills .nav-link {
  color: var(--bs-secondary-color);
  font-size: 0.9375rem;
}
.nav-pills .nav-link.active {
  background-color: var(--bs-white);
  color: var(--bs-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
