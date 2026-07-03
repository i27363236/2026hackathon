<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userPoints = ref(1250)
const activeTab = ref('ongoing') // 'ongoing' | 'ended'

const events = ref([
  {
    id: 1,
    title: '捷運大富翁：環狀線尋寶',
    description: '搭乘環狀線並在指定站點打卡即可獲得點數',
    points: 500,
    progress: 80,
    status: 'ongoing',
    image: 'https://placehold.co/600x300?text=Metro+Monopoly',
    endDate: '2024/07/31'
  },
  {
    id: 2,
    title: '環保愛地球：自備環保杯',
    description: '於捷運站內合作店家使用環保杯消費',
    points: 100,
    progress: 100,
    status: 'completed',
    image: 'https://placehold.co/600x300?text=Eco+Friendly',
    endDate: '2024/06/30'
  },
  {
    id: 3,
    title: '捷運知識家：每日問答',
    description: '回答關於台北捷運的小知識，全對可得點數',
    points: 200,
    progress: 20,
    status: 'ongoing',
    image: 'https://placehold.co/600x300?text=Metro+Quiz',
    endDate: '2024/12/31'
  }
])

const filteredEvents = computed(() => {
  return events.value.filter(e => 
    activeTab.value === 'ongoing' ? e.status !== 'expired' : e.status === 'expired'
  )
})

const goBack = () => router.back()
</script>

<template>
  <div class="get-point-events pb-5">
    <!-- Header -->
    <header class="d-flex align-items-center p-3 mb-2">
      <button class="btn btn-link text-dark p-0 me-3" @click="goBack">
        <Icon icon="f7:arrow-left" width="24" height="24" />
      </button>
      <h1 class="h5 fw-bold mb-0">集點活動</h1>
    </header>

    <!-- Point Summary Card -->
    <div class="px-3 mb-4">
      <div class="points-card bg-primary text-white p-4 rounded-4 shadow-sm d-flex justify-content-between align-items-center">
        <div>
          <div class="small opacity-75 mb-1">目前累積點數</div>
          <div class="h2 fw-bold mb-0">{{ userPoints.toLocaleString() }} <span class="h4 mb-0">P</span></div>
        </div>
        <div class="points-icon-bg">
          <Icon icon="mdi:integrated-circuit-chip" width="48" height="48" class="opacity-25" />
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="px-3 mb-4">
      <div class="nav-tabs-custom d-flex bg-light rounded-pill p-1">
        <button 
          class="btn flex-grow-1 rounded-pill py-2 transition-all"
          :class="activeTab === 'ongoing' ? 'bg-white shadow-sm fw-bold text-primary' : 'text-secondary border-0'"
          @click="activeTab = 'ongoing'"
        >
          進行中
        </button>
        <button 
          class="btn flex-grow-1 rounded-pill py-2 transition-all"
          :class="activeTab === 'ended' ? 'bg-white shadow-sm fw-bold text-primary' : 'text-secondary border-0'"
          @click="activeTab = 'ended'"
        >
          已結束
        </button>
      </div>
    </div>

    <!-- Events List -->
    <div class="px-3">
      <div v-for="event in filteredEvents" :key="event.id" class="event-card card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <img :src="event.image" class="card-img-top object-fit-cover" height="160" :alt="event.title">
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h3 class="h6 fw-bold mb-0 text-dark">{{ event.title }}</h3>
            <span class="badge rounded-pill bg-primary-subtle text-primary smaller">
              +{{ event.points }} P
            </span>
          </div>
          <p class="text-secondary smaller mb-3">{{ event.description }}</p>
          
          <div class="progress-section">
            <div class="d-flex justify-content-between mb-1">
              <span class="smaller text-muted">任務進度</span>
              <span class="smaller fw-bold text-primary">{{ event.progress }}%</span>
            </div>
            <div class="progress" style="height: 8px;">
              <div 
                class="progress-bar progress-bar-striped progress-bar-animated" 
                role="progressbar" 
                :style="{ width: event.progress + '%' }"
                :aria-valuenow="event.progress" 
                aria-valuemin="0" 
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.get-point-events {
  background-color: #f8f9fa;
  min-height: 100dvh;

  .points-card {
    background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
  }

  .nav-tabs-custom {
    border: 1px solid rgba(0,0,0,0.05);
  }

  .event-card {
    transition: transform 0.2s ease;
    &:active {
      transform: scale(0.98);
    }
  }

  .smaller {
    font-size: 0.8rem;
  }

  .transition-all {
    transition: all 0.3s ease;
  }
}
</style>