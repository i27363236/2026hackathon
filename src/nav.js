// 導覽設定 — 側欄(AppSidebar)/浮動導覽(FloatingNavPill)與首頁功能磚(HomeView)的單一來源。
// 欄位:
//   label    顯示名稱
//   icon     側欄/導覽用圖示(-light 細線)
//   tileIcon 首頁功能磚用圖示(粗細或圖形刻意與側欄不同;省略時退回 icon)
//   to       路由目標;null = 尚未實作的底欄佔位,in-development 目標在磚上會呈現停用
export const mainNav = [
  { label: '首頁', icon: 'ph:house-light', to: null },
  { label: '捷運路線', icon: 'ph:graph-light', to: null },
  { label: 'Go優惠', icon: 'ph:gift-light', to: null },
  { label: '更多功能', icon: 'ph:squares-four-light', to: null },
  { label: '捷運點', metroIcon: true, to: { name: 'home' } },
]

export const earnPointNav = [
  { label: '累點活動', icon: 'ph:tipi-light', tileIcon: 'ph:calendar-star-duotone', to: { name: 'earn-events' } },
  { label: '累點地圖', icon: 'ph:map-trifold-light', tileIcon: 'ph:map-trifold-duotone', to: { name: 'in-development' } },
]

export const usePointNav = [
  { label: '購物', icon: 'ph:shopping-bag-light', tileIcon: 'ph:shopping-bag', to: { name: 'in-development' } },
  { label: '送禮', icon: 'ph:gift-light', tileIcon: 'ph:gift', to: { name: 'gift-home' } },
  { label: '優惠券', icon: 'ph:ticket-light', tileIcon: 'ph:ticket', to: { name: 'coupon-trade' } },
  { label: '銷點地圖', icon: 'ph:map-trifold-light', tileIcon: 'ph:map-pin', to: { name: 'in-development' } },
  { label: '捷客券商城', icon: 'ph:storefront-light', tileIcon: 'ph:storefront', to: { name: 'in-development' } },
  { label: '轉換點數', icon: 'ph:arrows-left-right-light', tileIcon: 'ph:arrows-left-right', to: { name: 'in-development' } },
  { label: '點數傳愛', icon: 'ph:hand-heart-light', tileIcon: 'ph:heart', to: { name: 'in-development' } },
]
