// 優惠券資料 — 兌換中心(CouponTradeCenter)、優惠券頁與使用優惠券頁共用。
// 券的形狀:{ id, title, point, sub, img, colorKey, category }
// point    — 兌換所需捷運點(沿用原欄位名,不是 price)。
// category — 對應 getCouponCategories() 的 key;兌換中心的分類圖示、分類頁與篩選面板
//            三者共用同一份語彙,不要在 view 裡另外再寫一份標籤陣列。
// img 是 CSS background shorthand(url(...) center/cover),必須維持可直接餵給
// :style="{ background: img }" 的格式,不能改成裸 URL。
// 照片沿用專案既有的 Unsplash 圖檔 id — 換新 id 前請先確認可載入,
// 因為 npm run check 會把失敗的請求視為錯誤。

const u = (id) =>
  `url('https://images.unsplash.com/photo-${id}?w=600&h=600&fit=crop&q=80') center/cover no-repeat`

// 六大分類 — 圖示沿用 Phosphor -light 字重(見 AGENTS.md 圖示慣例)。
const categories = [
  { key: 'discount', label: '折價券', icon: 'ph:ticket-light' },
  { key: 'fast-food', label: '速食券', icon: 'ph:hamburger-light' },
  { key: 'coffee', label: '咖啡券', icon: 'ph:coffee-light' },
  { key: 'event', label: '活動券', icon: 'ph:palette-light' },
  { key: 'shopping', label: '購物券', icon: 'ph:shopping-cart-light' },
  { key: 'travel', label: '旅遊券', icon: 'ph:suitcase-rolling-light' },
]

const coupons = [
  // 折價券
  { id: 'cpn-1', title: '台北捷運｜單程票 9 折', point: 20, sub: '限台北捷運各站使用', img: u('1517400508447-f8dd518b86db'), colorKey: 'variant-2', category: 'discount' },
  { id: 'cpn-2', title: '全聯福利中心｜滿 500 折 50', point: 60, sub: '全台門市單筆消費滿額適用', img: u('1470004914212-05527e49370b'), colorKey: 'variant-4', category: 'discount' },
  { id: 'cpn-3', title: '屈臣氏｜生活用品 85 折', point: 45, sub: '不含菸酒與特價商品', img: u('1503899036084-c55cdd92da26'), colorKey: 'variant-6', category: 'discount' },

  // 速食券
  { id: 'cpn-4', title: '摩斯漢堡｜米漢堡買一送一', point: 70, sub: '全台門市內用外帶皆可', img: u('1553909489-cd47e0907980'), colorKey: 'variant-3', category: 'fast-food' },
  { id: 'cpn-5', title: '麥當勞｜勁辣雞腿堡折 25 元', point: 35, sub: '限單點,不與其他優惠併用', img: u('1571091718767-18b5b1457add'), colorKey: 'variant-5', category: 'fast-food' },
  { id: 'cpn-6', title: '肯德基｜咔啦雞腿堡套餐折 40 元', point: 50, sub: '全台門市適用,每人限用一次', img: u('1481070555726-e2fe8357725c'), colorKey: 'variant-1', category: 'fast-food' },

  // 咖啡券
  { id: 'cpn-7', title: '星巴克｜大杯咖啡折 30 元', point: 40, sub: '全台星巴克門市適用', img: u('1509042239860-f550ce710b93'), colorKey: 'variant-3', category: 'coffee' },
  { id: 'cpn-8', title: '7-11｜拿鐵咖啡第二杯半價', point: 30, sub: '全台門市皆可兌換', img: u('1495474472287-4d71bcdd2085'), colorKey: 'variant-4', category: 'coffee' },
  { id: 'cpn-9', title: '路易莎｜莊園拿鐵折 20 元', point: 25, sub: '限中杯以上,外帶內用皆可', img: u('1554118811-1e0d58224f24'), colorKey: 'variant-2', category: 'coffee' },
  { id: 'cpn-10', title: '春日咖啡｜手沖單品折 50 元', point: 55, sub: '限東門店,平日限定', img: u('1524351199678-941a58a3df50'), colorKey: 'variant-5', category: 'coffee' },

  // 活動券
  { id: 'cpn-11', title: '北美館｜常設展單人門票', point: 90, sub: '週一休館,現場出示條碼入場', img: u('1507842217343-583bb7270b66'), colorKey: 'variant-1', category: 'event' },
  { id: 'cpn-12', title: '建國假日花市｜手作盆栽體驗', point: 120, sub: '僅週末場次,需現場排隊', img: u('1488459716781-31db52582fe9'), colorKey: 'variant-6', category: 'event' },
  { id: 'cpn-13', title: '大稻埕｜迪化街導覽行程', point: 150, sub: '約 90 分鐘,含街區故事解說', img: u('1545558014-8692077e9b5c'), colorKey: 'variant-2', category: 'event' },

  // 購物券
  // 標題與 tests/smoke.spec.js 的斷言逐字對應,改字前請同步更新測試。
  { id: 'cpn-14', title: '誠品生活｜100元優惠券', point: 50, sub: '全台誠品生活櫃位皆可使用', img: u('1481627834876-b7833e8f5570'), colorKey: 'variant-1', category: 'shopping' },
  { id: 'cpn-15', title: 'SOGO 忠孝館｜滿 1000 折 100', point: 110, sub: '不含化妝品與家電專櫃', img: u('1470004914212-05527e49370b'), colorKey: 'variant-3', category: 'shopping' },
  { id: 'cpn-16', title: '南港 LaLaport｜蔦屋書店 9 折', point: 80, sub: '限書籍與文具選品', img: u('1507842217343-583bb7270b66'), colorKey: 'variant-5', category: 'shopping' },

  // 旅遊券
  { id: 'cpn-17', title: '台北 101｜觀景台門票折 150 元', point: 200, sub: '89 樓室內觀景台,當日有效', img: u('1598935898639-81586f7d2129'), colorKey: 'variant-4', category: 'travel' },
  { id: 'cpn-18', title: '貓空纜車｜來回車票 8 折', point: 65, sub: '週一維修停駛,例假日照常營運', img: u('1508248467877-aec1b08de376'), colorKey: 'variant-6', category: 'travel' },
  { id: 'cpn-19', title: '台北好行｜一日觀光巴士券', point: 180, sub: '可自由上下車,效期當日', img: u('1517400508447-f8dd518b86db'), colorKey: 'variant-2', category: 'travel' },
]

export function getCoupons() {
  return coupons
}

export function getCouponCategories() {
  return categories
}

export function getCouponCategoryByKey(key) {
  return categories.find((c) => c.key === key)
}
