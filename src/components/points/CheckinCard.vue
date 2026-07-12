<script setup>
// 每日簽到卡 — 7 天橫條(本週一到週日),已簽日蓋勾;簽到 +10,連續 7 天 +50。
// 回應「累點動力不足/忘記打開 App」:給一個每天打開的理由。
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useCheckinStore } from '@/stores/checkin.js'

const checkin = useCheckinStore()

const WEEK_LABELS = ['一', '二', '三', '四', '五', '六', '日']
const pad = (n) => String(n).padStart(2, '0')

// 本週(週一起)7 天:{ label, key, checked, isToday }
const weekDays = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  const set = new Set(checkin.days)
  return WEEK_LABELS.map((label, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    return {
      label,
      key,
      checked: set.has(key),
      isToday: d.getTime() === today.getTime(),
    }
  })
})
</script>

<template>
  <div class="card border-0 rounded-7 shadow-sm mb-6">
    <div class="card-body p-7">
      <div class="d-flex justify-content-between align-items-center mb-6">
        <div class="d-flex align-items-center">
          <div class="icon-box bg-warning-subtle rounded-circle p-2 me-3 d-flex align-items-center justify-content-center">
            <Icon icon="ph:calendar-check-light" class="text-warning" width="24" height="24" />
          </div>
          <h2 class="h6 fw-bold mb-0">每日簽到</h2>
        </div>
        <span v-if="checkin.streak > 0" class="badge bg-warning-subtle text-warning-emphasis rounded-pill px-3 py-2">
          連續 {{ checkin.streak }} 天 🔥
        </span>
      </div>

      <!-- 7 天橫條 -->
      <div class="d-flex justify-content-between mb-6">
        <div v-for="day in weekDays" :key="day.key" class="text-center">
          <div class="caption-2 text-body-secondary mb-2">{{ day.label }}</div>
          <div
            class="day-dot rounded-circle d-flex align-items-center justify-content-center mx-auto"
            :class="day.checked ? 'bg-warning text-white' : day.isToday ? 'border border-warning border-2' : 'bg-light'"
          >
            <Icon v-if="day.checked" icon="ph:check-bold" width="16" height="16" />
          </div>
        </div>
      </div>

      <p class="caption-1 text-body-secondary mb-4">
        每日簽到 +{{ checkin.DAILY_REWARD }} 點，連續 {{ checkin.STREAK_TARGET }} 天額外 +{{ checkin.STREAK_BONUS }} 點
      </p>

      <button
        type="button"
        class="btn w-100 py-4 rounded-6 fw-bold d-flex align-items-center justify-content-center gap-2"
        :class="checkin.checkedToday ? 'btn-light text-body-secondary' : 'btn-warning'"
        :disabled="checkin.checkedToday"
        @click="checkin.checkIn()"
      >
        <Icon :icon="checkin.checkedToday ? 'ph:check-circle-light' : 'ph:hand-tap-light'" width="24" height="24" />
        {{ checkin.checkedToday ? '今日已簽到' : `今日簽到 +${checkin.DAILY_REWARD}` }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rounded-7 { border-radius: 24px !important; }
.rounded-6 { border-radius: 20px !important; }
.icon-box {
  width: 32px;
  height: 32px;
}
.day-dot {
  width: 32px;
  height: 32px;
}
</style>
