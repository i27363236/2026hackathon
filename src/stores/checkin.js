import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { usePointsStore } from '@/stores/points.js'

// 每日簽到 — 習慣養成迴圈:簽到 +10 點,連續 7 天額外 +50。
// days 存 'YYYY-MM-DD' 字串,持久化到 localStorage(鍵 metro:checkin)。
const STORAGE_KEY = 'metro:checkin'
const DAY = 86400000
const DAILY_REWARD = 10
const STREAK_BONUS = 50
const STREAK_TARGET = 7

const pad = (n) => String(n).padStart(2, '0')
function dayKey(ts) {
  const d = new Date(ts)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function loadDays() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* fallthrough */
  }
  // demo 種子:過去三天已簽,今天還沒 — 打開就有「連續 3 天」的動機
  const now = Date.now()
  return [dayKey(now - 3 * DAY), dayKey(now - 2 * DAY), dayKey(now - DAY)]
}

export const useCheckinStore = defineStore('checkin', () => {
  const points = usePointsStore()
  const days = ref(loadDays())

  const checkedToday = computed(() => days.value.includes(dayKey(Date.now())))

  // 連續天數:從今天(或未簽則昨天)往回數
  const streak = computed(() => {
    const set = new Set(days.value)
    let count = 0
    let cursor = Date.now()
    if (!set.has(dayKey(cursor))) cursor -= DAY
    while (set.has(dayKey(cursor))) {
      count++
      cursor -= DAY
    }
    return count
  })

  function checkIn() {
    if (checkedToday.value) return
    days.value.push(dayKey(Date.now()))
    points.earn(DAILY_REWARD, '每日簽到獎勵', 'checkin')
    if (streak.value === STREAK_TARGET) {
      points.earn(STREAK_BONUS, `連續簽到 ${STREAK_TARGET} 天獎勵`, 'checkin')
    }
  }

  watch(
    days,
    (val) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
      } catch {
        // storage unavailable — ignore
      }
    },
    { deep: true },
  )

  return { days, checkedToday, streak, checkIn, DAILY_REWARD, STREAK_BONUS, STREAK_TARGET }
})
