import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { getPointsHistory } from '@/data/pointsHistory.js'

// 捷運點 balance — single source of truth (Home 摘要卡 / 我的點數 / 商品頁 / 結帳共用)。
// 交易紀錄以 data/pointsHistory.js 假資料為種子;使用者操作(簽到/兌換)產生的交易
// 標記 runtime: true,連同餘額一起持久化(localStorage 鍵 metro:points),
// 種子資料每次載入重新產生,讓「即將到期」「週趨勢」隨日期保持合理。
const STORAGE_KEY = 'metro:points'
const DAY = 86400000
const EXPIRING_WINDOW_DAYS = 30
const pad = (n) => String(n).padStart(2, '0')

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const usePointsStore = defineStore('points', () => {
  const saved = loadSaved()
  const balance = ref(saved?.balance ?? 320)
  // 種子 + 先前 session 的使用者交易
  const transactions = ref([...(saved?.runtime ?? []), ...getPointsHistory()])

  // 即將到期:earn 交易的 expiresAt 落在未來 30 天內
  const expiringSoon = computed(() => {
    const now = Date.now()
    const limit = now + EXPIRING_WINDOW_DAYS * DAY
    return transactions.value
      .filter((t) => t.type === 'earn' && t.expiresAt && t.expiresAt > now && t.expiresAt <= limit)
      .sort((a, b) => a.expiresAt - b.expiresAt)
  })
  const expiringPoints = computed(() => expiringSoon.value.reduce((s, t) => s + t.amount, 0))
  const expiringDate = computed(() => {
    const first = expiringSoon.value[0]
    if (!first) return ''
    const d = new Date(first.expiresAt)
    return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`
  })

  const earnTransactions = computed(() => transactions.value.filter((t) => t.type === 'earn'))
  const burnTransactions = computed(() => transactions.value.filter((t) => t.type === 'redeem'))

  // 近 6 週累/銷點合計(給趨勢圖;label 為該週週一的 M/D)
  const weeklyTotals = computed(() => {
    const monday = new Date()
    monday.setHours(0, 0, 0, 0)
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7)) // 本週一
    const weeks = []
    for (let i = 5; i >= 0; i--) {
      const start = monday.getTime() - i * 7 * DAY
      const end = start + 7 * DAY
      let earn = 0
      let burn = 0
      for (const t of transactions.value) {
        if (t.ts >= start && t.ts < end) {
          if (t.type === 'earn') earn += t.amount
          else burn += -t.amount
        }
      }
      const d = new Date(start)
      weeks.push({ label: `${d.getMonth() + 1}/${d.getDate()}`, earn, burn })
    }
    return weeks
  })

  function stampNow() {
    const d = new Date()
    return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  function pushRuntime(entry) {
    transactions.value.unshift({ ...entry, id: `rt-${Date.now()}`, ts: Date.now(), date: stampNow(), runtime: true })
  }

  function earn(amount, title, category = 'event') {
    if (amount <= 0) return
    balance.value += amount
    pushRuntime({ type: 'earn', category, title, amount, expiresAt: Date.now() + 60 * DAY })
  }

  function spend(amount, title) {
    if (amount <= 0) return
    balance.value = Math.max(0, balance.value - amount)
    pushRuntime({ type: 'redeem', category: 'redeem', title, amount: -amount })
  }

  watch(
    [balance, transactions],
    () => {
      try {
        const runtime = transactions.value.filter((t) => t.runtime)
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ balance: balance.value, runtime }))
      } catch {
        // storage unavailable — ignore
      }
    },
    { deep: true },
  )

  return {
    balance,
    expiringPoints,
    expiringDate,
    expiringSoon,
    transactions,
    earnTransactions,
    burnTransactions,
    weeklyTotals,
    earn,
    spend,
  }
})
