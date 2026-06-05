// Read-only catalog of "這樣換最划算" coupon exchange options shown on HomeView.
// (Renamed from the former inline `deals` array to match the codebase's coupon terminology.)
// Each item carries a stable id and a colorKey (variant-1 … variant-6, see _card-colors.scss).

const coupons = [
  { id: 'cpn-1',  title: '台北捷運',    point: 50,  sub: '50元電子乘車金',  colorKey: 'variant-2' },
  { id: 'cpn-2',  title: '東森購物',    point: 50,  sub: '50元折價券',      colorKey: 'variant-4' },
  { id: 'cpn-3',  title: '全家便利商店', point: 50,  sub: '50元折價券',      colorKey: 'variant-1' },
  { id: 'cpn-4',  title: '誠品生活',    point: 50,  sub: '50元抵用券',      colorKey: 'variant-5' },
  { id: 'cpn-5',  title: '7-ELEVEN',   point: 100, sub: '100元折價券',     colorKey: 'variant-3' },
  { id: 'cpn-6',  title: '星巴克',      point: 150, sub: '中杯飲品兌換券',   colorKey: 'variant-6' },
  { id: 'cpn-7',  title: '麥當勞',      point: 80,  sub: '麥香魚套餐兌換券', colorKey: 'variant-2' },
  { id: 'cpn-8',  title: 'IKEA',       point: 200, sub: '200元購物金',     colorKey: 'variant-4' },
  { id: 'cpn-9',  title: '博客來',      point: 100, sub: '100元折價券',     colorKey: 'variant-1' },
  { id: 'cpn-10', title: 'momo購物',    point: 120, sub: '120元優惠券',     colorKey: 'variant-5' },
  { id: 'cpn-11', title: '路易莎咖啡',   point: 60,  sub: '中杯咖啡兌換券',   colorKey: 'variant-3' },
  { id: 'cpn-12', title: '王品集團',     point: 300, sub: '餐廳折抵券',      colorKey: 'variant-6' },
]

export function getCoupons() {
  return coupons
}
