import { defineStore } from 'pinia'
import { ref } from 'vue'

// 捷運點 balance — single source of truth (Home 摘要卡 / 我的點數 / 商品頁 / 結帳共用)。
// Phase 3(簽到+點數紀錄)會在這裡加上 localStorage 持久化與完整交易紀錄。
export const usePointsStore = defineStore('points', () => {
  const balance = ref(320)
  const expiringPoints = ref(80)
  const expiringDate = ref('2026/07/31')

  const transactions = ref([
    { id: 1, type: 'earn', title: '搭乘捷運 - 板南線', date: '2026/05/20 08:30', amount: 5 },
    { id: 2, type: 'redeem', title: '兌換大冰拿鐵 (中)', date: '2026/05/19 15:45', amount: -55 },
    { id: 3, type: 'earn', title: '每日簽到獎勵', date: '2026/05/19 07:00', amount: 10 },
    { id: 4, type: 'earn', title: '搭乘捷運 - 淡水信義線', date: '2026/05/18 18:20', amount: 5 },
    { id: 5, type: 'redeem', title: '兌換捷運一日票', date: '2026/05/15 10:00', amount: -150 },
  ])

  function stampNow() {
    const d = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  function earn(amount, title) {
    if (amount <= 0) return
    balance.value += amount
    transactions.value.unshift({ id: Date.now(), type: 'earn', title, date: stampNow(), amount })
  }

  function spend(amount, title) {
    if (amount <= 0) return
    balance.value = Math.max(0, balance.value - amount)
    transactions.value.unshift({ id: Date.now(), type: 'redeem', title, date: stampNow(), amount: -amount })
  }

  return { balance, expiringPoints, expiringDate, transactions, earn, spend }
})
