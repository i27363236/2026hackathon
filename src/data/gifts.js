import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// img 是給 <img :src> 用的「裸 URL」(和 catalog 的 CSS background 簡寫不同)。
// 原相對路徑字串在執行期解析不到,改為 Vite 匯入的實際資產 + Unsplash 示意圖。
import esliteCouponImg from '@/img/誠品100元抵用券.png'

const sevenElevenImg =
  'https://images.unsplash.com/photo-1481070555726-e2fe8357725c?w=600&h=400&fit=crop&q=80'

// 注意:store id 不能用 'gifts' — stores/gifts.js(購買流程)已使用,重複會共用實例。
export const useGiftStore = defineStore('gifts-mock', () => {
  // 1. 模擬資料庫 (Mock Database)
  const gifts = ref([
    // 可使用 - 附近
    {
      id: 1,
      title: '誠品50元抵用券',
      img: esliteCouponImg,
      expiry: '2026-06-30 23:59',
      type: 'near',
      status: 'available'
    },
    {
      id: 2,
      title: '7-11商品券',
      img: sevenElevenImg,
      expiry: '2026-06-30 23:59',
      type: 'near',
      status: 'available'
    },
    // 可使用 - 其他優惠券
    {
      id: 3,
      title: '誠品50元抵用券',
      img: esliteCouponImg,
      expiry: '2026-06-30 23:59',
      type: 'other',
      status: 'available'
    },
    {
      id: 4,
      title: '7-11商品券',
      img: sevenElevenImg,
      expiry: '2026-06-30 23:59',
      type: 'other',
      status: 'available'
    },
    // 歷史紀錄 - 已使用 / 已過期
    {
      id: 5,
      title: '誠品50元抵用券',
      img: esliteCouponImg,
      expiry: '2026-05-12',
      type: 'other',
      status: 'used' // 會顯示「已使用」紅章
    },
    {
      id: 6,
      title: '7-11商品券',
      img: sevenElevenImg,
      expiry: '2026-05-12',
      type: 'other',
      status: 'expired' // 會顯示「已過期」紅章
    },
    // 歷史紀錄 - 送出的禮物
    {
      id: 7,
      title: '誠品50元抵用券',
      img: esliteCouponImg,
      expiry: '2026-05-12',
      type: 'other',
      status: 'sent' // 會顯示「已送出」紅章
    }
  ])

  // 2. 當前選擇的頁籤狀態：'available' (可使用) 或 'history' (歷史紀錄)
  const currentTab = ref('available')

  // 3. 篩選計算屬性 (Computed Properties) 供前端畫面直接讀取
  
  // 3a. 可使用 - 附近
  const availableNearGifts = computed(() => {
    return gifts.value.filter(g => g.status === 'available' && g.type === 'near')
  })

  // 3b. 可使用 - 其他
  const availableOtherGifts = computed(() => {
    return gifts.value.filter(g => g.status === 'available' && g.type === 'other')
  })

  // 3c. 歷史紀錄 - 所有優惠券 (包含已使用、已過期，不含已送出)
  const historyCoupons = computed(() => {
    return gifts.value.filter(g => g.status === 'used' || g.status === 'expired')
  })

  // 3d. 歷史紀錄 - 送出的禮物
  const historySentGifts = computed(() => {
    return gifts.value.filter(g => g.status === 'sent')
  })

  // 4. 修改狀態的方法 (Actions) - 未來核銷或送禮時呼叫
  function useCoupon(id) {
    const gift = gifts.value.find(g => g.id === id)
    if (gift) gift.status = 'used'
  }

  function sendGift(id) {
    const gift = gifts.value.find(g => g.id === id)
    if (gift) gift.status = 'sent'
  }

  return {
    currentTab,
    availableNearGifts,
    availableOtherGifts,
    historyCoupons,
    historySentGifts,
    useCoupon,
    sendGift
  }
})