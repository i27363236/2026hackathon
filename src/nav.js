export const mainNav = [
  { label: '首頁', icon: 'ph:house-light', to: null },
  { label: '捷運路線', icon: 'ph:graph-light', to: null },
  { label: 'Go優惠', icon: 'ph:gift-light', to: null },
  { label: '更多功能', icon: 'ph:squares-four-light', to: null },
  { label: '捷運點', icon: 'ph:coin-light', to: { name: 'home' } },
]

export const earnPointNav = [
  { label: '累點活動', icon: 'ph:tipi-light', to: { name: 'earn-events' } },
  { label: '累點地圖', icon: 'ph:map-trifold-light', to: { name: 'earn-map' } },
]

export const usePointNav = [
  { label: '購物', icon: 'ph:shopping-bag-light', to: { name: 'use-shopping' } },
  { label: '送禮', icon: 'ph:gift-light', to: { name: 'use-gift-setup' } },
  { label: '優惠券', icon: 'ph:ticket-light', to: { name: 'coupons' } },
  { label: '銷點地圖', icon: 'ph:map-trifold-light', to: { name: 'use-redeem-map' } },
  { label: '捷客券商城', icon: 'ph:storefront-light', to: { name: 'use-mall' } },
  { label: '轉換點數', icon: 'ph:arrows-left-right-light', to: { name: 'use-convert' } },
  { label: '點數傳愛', icon: 'ph:hand-heart-light', to: { name: 'use-donate' } },
]
