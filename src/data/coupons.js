// Read-only catalog of "這樣換最划算" coupon exchange options shown on HomeView.
// (Renamed from the former inline `deals` array to match the codebase's coupon terminology.)
// Each item carries a stable id and a colorKey (variant-1 … variant-6, see _card-colors.scss).

const coupons = [
  { id: 'cpn-1', title: '台北捷運', point: 50, sub: '50元電子乘車金', colorKey: 'variant-2' },
  { id: 'cpn-2', title: '東森購物', point: 50, sub: '50元折價券', colorKey: 'variant-4' },
  { id: 'cpn-3', title: '全家便利商店', point: 50, sub: '50元折價券', colorKey: 'variant-1' },
  { id: 'cpn-4', title: '誠品生活', point: 50, sub: '50元抵用券', colorKey: 'variant-5' },
]

export function getCoupons() {
  return coupons
}
