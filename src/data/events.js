// Read-only catalog of events. Shown on HomeView ("大家都參加") and GetPointEventsView.
// Each item carries a stable id and a colorKey (variant-1 … variant-6, see _card-colors.scss).
// img is a CSS background shorthand (url(...) center/cover) — used directly as the card
// background and fed (with the url(...) wrapper stripped) to dominantColor() for the
// gradient face. Photos are hand-picked Unsplash, representative of each event theme.
//
// detail   — short tagline (large cards) / caption (mini cards), e.g. '看影片送2點'.
// category — 'participation' | 'online' | 'offline'; GetPointEventsView filters rows by it.

const u = (id) =>
  `url('https://images.unsplash.com/photo-${id}?w=600&h=600&fit=crop&q=80') center/cover no-repeat`

const events = [
  { id: 'evt-1', title: '捷運到日市集', tag: '中山', detail: '假日限定，捷運直達', category: 'offline', img: u('1503899036084-c55cdd92da26'), colorKey: 'variant-1' },
  { id: 'evt-2', title: '信義計畫區音樂會', tag: '台北捷運', detail: '週末夜的城市樂章', category: 'participation', img: u('1470229722913-7c0e2dbbafd3'), colorKey: 'variant-4' },
  { id: 'evt-3', title: '淡水老街美食探索', tag: '淡水', detail: '憑出站紀錄領20點', category: 'offline', img: u('1488459716781-31db52582fe9'), colorKey: 'variant-3' },
  { id: 'evt-4', title: '士林夜市市集', tag: '士林', detail: '消費100元送20點', category: 'offline', img: u('1508248467877-aec1b08de376'), colorKey: 'variant-5' },
  { id: 'evt-5', title: '台北車站街頭音樂節', tag: '台北車站', detail: '街頭最動聽的旋律', category: 'participation', img: u('1533174072545-7a4b6ad7a6c3'), colorKey: 'variant-2' },
  { id: 'evt-6', title: '信義區藝術展', tag: '信義', detail: '購票加碼送50點', category: 'offline', img: u('1518998053901-5348d3961a04'), colorKey: 'variant-6' },
  { id: 'evt-7', title: '大稻埕文創市集', tag: '大稻埕', detail: '看影片送2點', category: 'online', img: u('1545389336-cf090694435e'), colorKey: 'variant-3' },
  { id: 'evt-8', title: '北投溫泉祭', tag: '北投', detail: '暖湯與點數一起收', category: 'participation', img: u('1545569341-9eb8b30979d9'), colorKey: 'variant-4' },
  { id: 'evt-9', title: '松山夜跑', tag: '松山', detail: '完賽打卡送5點', category: 'online', img: u('1531058020387-3be344556be6'), colorKey: 'variant-1' },
  { id: 'evt-10', title: '南港科技講座', tag: '南港', detail: '報名觀看送3點', category: 'online', img: u('1524178232363-1fb2b075b655'), colorKey: 'variant-5' },
  { id: 'evt-11', title: '文山書展', tag: '文山', detail: '線上導覽送2點', category: 'online', img: u('1481627834876-b7833e8f5570'), colorKey: 'variant-2' },
  { id: 'evt-12', title: '內湖運動會', tag: '內湖', detail: '到場報到送30點', category: 'offline', img: u('1461896836934-ffe607ba8211'), colorKey: 'variant-6' },
]

export function getEvents() {
  return events
}
