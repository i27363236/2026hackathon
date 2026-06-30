// Read-only list of "智慧推薦" cards cycled on HomeView.
// img is a bare URL fed straight to <img :src> (not a CSS background) — hand-picked
// Unsplash photos representative of each recommendation's theme.

const u = (id) =>
  `https://images.unsplash.com/photo-${id}?w=160&h=160&fit=crop&q=80`

const recommendations = [
  { id: 'rec-1', title: '這家店可以折抵點數',    sub: '3號出口，用捷運點享折扣',       img: u('1441986300917-64674bd600d8') }, // storefront
  { id: 'rec-2', title: '用點數享用今天的早餐',  sub: '早餐消費輕鬆折抵',               img: u('1533089860892-a7c6f0a88666') }, // breakfast
  { id: 'rec-3', title: '兌換優惠券',            sub: '3點將在明天到期',                img: u('1607344645866-009c320b63e0') }, // voucher
  { id: 'rec-4', title: '新活動上線',            sub: '快來領取免費點數',               img: u('1530103862676-de8c9debad1d') }, // celebration
  { id: 'rec-5', title: '使用這張優惠券',        sub: '優惠券即將失效，現在使用',        img: u('1578916171728-46686eac8d58') }, // ticket
  { id: 'rec-6', title: '使用小捷送你的禮物',    sub: '別讓心意白白流失',               img: u('1513885535751-8b9238bd345a') }, // gift box
  { id: 'rec-7', title: '週末來這裡',            sub: '週末市集賺取20捷運點',            img: u('1488459716781-31db52582fe9') }, // market
  { id: 'rec-8', title: '在4號出口兌換咖啡',     sub: '使用這張你兌換好的優惠券。',      img: u('1495474472287-4d71bcdd2085') }, // coffee
]

export function getRecommendations() {
  return recommendations
}
