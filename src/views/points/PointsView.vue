<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const points = ref(1250)
const expiringSoon = ref({
  amount: 320,
  date: '2026/06/30'
})

const transactions = ref([
  { id: 1, type: 'earn', title: '搭乘捷運 - 板南線', date: '2026/05/20 08:30', amount: 5 },
  { id: 2, type: 'redeem', title: '兌換大冰拿鐵 (中)', date: '2026/05/19 15:45', amount: -55 },
  { id: 3, type: 'earn', title: '每日簽到獎勵', date: '2026/05/19 07:00', amount: 10 },
  { id: 4, type: 'earn', title: '搭乘捷運 - 淡水信義線', date: '2026/05/18 18:20', amount: 5 },
  { id: 5, type: 'redeem', title: '兌換捷運一日票', date: '2026/05/15 10:00', amount: -150 }
])
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
            <span class="display-4 fw-bold text-dark">{{ points.toLocaleString() }}</span>
            <span class="h6 ms-2 text-secondary fw-bold">P</span>
          </div>
          
          <!-- Expiry Alert Pill -->
          <div class="mt-5 bg-light rounded-pill px-4 py-2 d-inline-flex align-items-center border border-white">
            <Icon icon="ph:clock-countdown-light" class="text-warning me-2" width="24" height="24" />
            <span class="small text-secondary">
              <strong>{{ expiringSoon.amount }} P</strong> 將於 {{ expiringSoon.date }} 到期
            </span>
          </div>
        </div>

        <!-- Main Action Buttons -->
        <div class="row g-4">
          <div class="col-6">
            <button class="btn btn-primary w-100 py-5 rounded-6 d-flex flex-column align-items-center gap-2 shadow-sm">
              <Icon icon="ph:hand-coins-light" width="24" height="24" />
              <span class="fw-bold">累積點數</span>
            </button>
          </div>
          <div class="col-6">
            <button class="btn btn-outline-primary w-100 py-5 rounded-6 d-flex flex-column align-items-center gap-2 border-2">
              <Icon icon="ph:gift-light" width="24" height="24" />
              <span class="fw-bold">兌換贈品</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer Quick Link -->
      <div class="card-footer bg-light-subtle py-5 px-7 border-top d-flex justify-content-between align-items-center cursor-pointer">
        <span class="small fw-medium text-dark">查看完整點數歷史紀錄</span>
        <Icon icon="ph:caret-right-light" class="text-muted" width="24" height="24" />
      </div>
    </div>

    <!-- Transaction History Section -->
    <div class="mt-7 px-2">
      <div class="d-flex justify-content-between align-items-center mb-5">
        <h3 class="h6 fw-bold mb-0">最近紀錄</h3>
        <div class="dropdown">
          <button class="btn btn-sm btn-light rounded-pill px-3 py-1 dropdown-toggle border-0 small text-secondary" type="button">
            全部
          </button>
        </div>
      </div>

      <div class="action-list">
        <div class="list-group list-group-flush">
          <div v-for="tx in transactions" :key="tx.id" class="list-group-item d-flex align-items-center gap-4">
            <div class="flex-shrink-0 icon-box-sm rounded-circle d-flex align-items-center justify-content-center" :class="tx.type === 'earn' ? 'bg-primary-subtle' : 'bg-light'">
              <Icon :icon="tx.type === 'earn' ? 'ph:train-light' : 'ph:gift-light'" :class="tx.type === 'earn' ? 'text-primary' : 'text-secondary'" width="20" height="20" />
            </div>
            <div class="flex-grow-1 min-w-0">
              <div class="fw-bold text-dark small mb-1">{{ tx.title }}</div>
              <div class="text-muted smaller">{{ tx.date }}</div>
            </div>
            <div class="flex-shrink-0 fw-bold" :class="tx.type === 'earn' ? 'text-primary' : 'text-dark'">
              {{ tx.amount > 0 ? '+' : '' }}{{ tx.amount }} P
            </div>
          </div>
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