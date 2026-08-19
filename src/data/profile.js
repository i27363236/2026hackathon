// Current user's basic info(身分/優惠券/集點目標)。
// 捷運點餘額改由 stores/points.js 單一來源提供,這裡不再持有點數欄位。
// 個人檔案頁的三個列表:成就(獎章)、紀念章(只有圖)、我的禮物(直接沿用 catalog 商品)。
import award1 from '@/img/award-1.png'
import musicStamp from '@/img/mynaui_music-square.png'
import { getProductById } from '@/data/catalog.js'

export function getProfile() {
  return {
    name: '小捷',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    coupons: 3,
    expiringCoupons: 1,
    couponExpiringDate: '7/31',
    goalProductId: 'cat-021', // 檸檬塔(400 點)— 餘額 320 時進度 80%,示範進度條
  }
}

// 我的成就 — 獎章列(caption = 達成日期);locked 代表尚未達成,獎章會以灰階呈現。
export function getAchievements() {
  return [
    { img: award1, title: '參加過10次台北捷運舉辦的活動', caption: '2026-04-30 達成' },
    { img: award1, title: '搭乘里程累積滿 500 公里', caption: '2026-03-12 達成' },
    { img: award1, title: '蒐集齊全五條路線的紀念章', caption: '尚未達成', locked: true },
  ]
}

// 我的紀念章 — 參加活動獲得,只顯示圖不顯示文字(MedalSection hide-text)。
export function getStamps() {
  return [{ img: musicStamp }]
}

// 我的禮物(已送出)— 直接沿用 catalog 商品,GiftGrid/ContentCard 才有價格與色系可讀。
export function getSentGifts() {
  return ['cat-001', 'cat-004', 'cat-011'].map(getProductById).filter(Boolean)
}
