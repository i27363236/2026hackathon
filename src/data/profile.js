// Current user's basic info. Single source for HomeView's point balance + redemption goal.
import award1 from '@/img/award-1.png'
import giftImg from '@/img/Frame 116.png'

export function getProfile() {
  return {
    name: '小捷',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    points: 15,               // 捷運點 balance
    expiringPoints: 4,
    expiringDate: '5/15',
    coupons: 3,
    expiringCoupons: 1,
    goalProductId: 'cat-007', // 香草布丁燒 — redemption goal shown in summary
  }
}

// 我的成就 — 獎章列(caption = 達成日期)
export function getAchievements() {
  return [
    { img: award1, title: '參加過10次台北捷運舉辦的活動', caption: '2026-04-30 達成' },
    { img: award1, title: '參加過10次台北捷運舉辦的活動', caption: '2026-04-30 達成' },
  ]
}

// 我的禮物(已送出)— 獎章列(caption = 使用期限)
export function getSentGifts() {
  return [
    { img: giftImg, title: '誠品生活|100元優惠券', caption: '使用期限 2026-06-30' },
    { img: giftImg, title: '全家便利商店|300元購物券', caption: '使用期限 2024-11-15' },
    { img: giftImg, title: '星巴克|50元飲品兌換券', caption: '使用期限 2025-12-31' },
  ]
}
