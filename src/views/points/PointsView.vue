<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { usePointsStore } from '@/stores/points.js'
import CheckinCard from '@/components/points/CheckinCard.vue'
import TransactionRow from '@/components/points/TransactionRow.vue'

const { balance, expiringPoints, expiringDate, transactions } = storeToRefs(usePointsStore())

// 最近紀錄只列前 5 筆,完整明細在 /points/history
const recentTransactions = computed(() => transactions.value.slice(0, 5))
</script>

<template>
  <section class="my-point-section py-6">
    <div class="card border-0 rounded-7 shadow-sm overflow-hidden">
      <div class="card-body p-7">
        <!-- Header Area -->
        <div class="d-flex justify-content-between align-items-center mb-6">
          <div class="d-flex align-items-center">
            <div class="icon-box bg-primary-subtle rounded-circle p-2 me-3 d-flex align-items-center justify-content-center">
              <Icon icon="ph:coins-light" class="text-primary" width="24" height="24" />
            </div>
            <h2 class="h6 fw-bold mb-0">我的點數</h2>
          </div>
          <button class="btn btn-link p-0 text-decoration-none text-muted small d-flex align-items-center">
            點數說明
            <Icon icon="ph:question-light" class="ms-1" width="24" height="24" />
          </button>
        </div>

        <!-- Balance Display -->
        <div class="text-center py-4 mb-6">
          <div class="d-flex align-items-baseline justify-content-center">
            <span class="display-4 fw-bold text-dark">{{ balance.toLocaleString() }}</span>
            <span class="h6 ms-2 text-secondary fw-bold">P</span>
          </div>
          
          <!-- Expiry Alert Pill -->
          <div class="mt-5 bg-light rounded-pill px-4 py-2 d-inline-flex align-items-center border border-white">
            <Icon icon="ph:clock-countdown-light" class="text-warning me-2" width="24" height="24" />
            <span class="small text-secondary">
              <strong>{{ expiringPoints }} P</strong> 將於 {{ expiringDate }} 到期
            </span>
          </div>
        </div>

        <!-- Main Action Buttons -->
        <div class="row g-4">
          <div class="col-6">
            <RouterLink :to="{ name: 'earn-events' }" class="btn btn-primary w-100 py-5 rounded-6 d-flex flex-column align-items-center gap-2 shadow-sm">
              <Icon icon="ph:hand-coins-light" width="24" height="24" />
              <span class="fw-bold">累積點數</span>
            </RouterLink>
          </div>
          <div class="col-6">
            <RouterLink :to="{ name: 'coupons' }" class="btn btn-outline-primary w-100 py-5 rounded-6 d-flex flex-column align-items-center gap-2 border-2">
              <Icon icon="ph:gift-light" width="24" height="24" />
              <span class="fw-bold">兌換贈品</span>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Footer Quick Link -->
      <RouterLink
        :to="{ name: 'points-history' }"
        class="card-footer bg-light-subtle py-5 px-7 border-top d-flex justify-content-between align-items-center cursor-pointer text-decoration-none"
      >
        <span class="small fw-medium text-dark">查看完整點數歷史紀錄</span>
        <Icon icon="ph:caret-right-light" class="text-muted" width="24" height="24" />
      </RouterLink>
    </div>

    <!-- 每日簽到 -->
    <div class="mt-7">
      <CheckinCard />
    </div>

    <!-- Transaction History Section -->
    <div class="mt-7 px-2">
      <div class="d-flex justify-content-between align-items-center mb-5">
        <h3 class="h6 fw-bold mb-0">最近紀錄</h3>
        <RouterLink
          :to="{ name: 'points-history' }"
          class="btn btn-sm btn-light rounded-pill px-3 py-1 border-0 small text-secondary text-decoration-none"
        >
          全部
        </RouterLink>
      </div>

      <div class="action-list">
        <div class="list-group list-group-flush">
          <TransactionRow v-for="tx in recentTransactions" :key="tx.id" :tx="tx" />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.my-point-section {
  .rounded-7 { border-radius: 24px !important; }
  .rounded-6 { border-radius: 20px !important; }
  
  .icon-box {
    width: 32px;
    height: 32px;
  }

  .icon-box-sm {
    width: 40px;
    height: 40px;
  }

  .display-4 {
    line-height: 1;
    letter-spacing: -1px;
  }

  .cursor-pointer {
    cursor: pointer;
    transition: background-color 0.2s ease;
    &:hover {
      background-color: var(--bs-light) !important;
    }
  }

  .smaller {
    font-size: 0.75rem;
  }

  // Override primary color specifically for this card if needed to match Metro Blue
  .btn-primary {
    background-image: linear-gradient(135deg, var(--bs-primary) 0%, darken(#0d6efd, 10%) 100%);
    border: none;
  }
}
</style>