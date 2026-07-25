<script setup>
// 每日簽到卡(Figma 2184-10248)— 7 天橫條(本週一到週日):已簽日蓋勾,未簽日顯示當日
// 可得點數;簽到 +10,連續 7 天額外 +50。回應「累點動力不足/忘記打開 App」的痛點。
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useCheckinStore } from '@/stores/checkin.js'

const checkin = useCheckinStore()

const pad = (n) => String(n).padStart(2, '0')

// 本週(週一起)7 天:{ key, checked }
const weekDays = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  const set = new Set(checkin.days)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    return { key, checked: set.has(key) }
  })
})
</script>

<template>
  <div class="border rounded-3 p-5 bg-body">
    <!-- 7 天橫條 -->
    <div class="d-flex justify-content-between mb-5">
      <div v-for="(day, i) in weekDays" :key="day.key" class="d-flex flex-column align-items-center gap-2">
        <div
          class="day-chip d-flex align-items-center justify-content-center"
          :class="day.checked ? '' : 'bg-success-subtle text-success rounded-3 fw-bold'"
        >
          <Icon v-if="day.checked" icon="ph:check-bold" width="20" height="20" class="text-dark" />
          <span v-else class="day-chip-reward">+{{ checkin.DAILY_REWARD }}</span>
        </div>
        <span class="caption-2 text-body-secondary">Day {{ i + 1 }}</span>
      </div>
    </div>

    <button
      type="button"
      class="btn w-100 py-4 rounded-3 fw-bold"
      :class="checkin.checkedToday ? 'btn-light text-body-secondary' : 'btn-secondary'"
      :disabled="checkin.checkedToday"
      @click="checkin.checkIn()"
    >
      {{ checkin.checkedToday ? '今日已簽到' : '每日簽到領取捷運點數' }}
    </button>
  </div>
</template>

<style scoped>
.day-chip {
  min-width: 32px;
  height: 32px;
  padding-inline: 4px;
}
.day-chip-reward {
  font-size: 0.8125rem;
  white-space: nowrap;
}
</style>
