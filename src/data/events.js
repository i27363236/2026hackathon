// Read-only catalog of "大家都參加" events shown on HomeView.
// Each item carries a stable id and a colorKey (variant-1 … variant-6, see _card-colors.scss).

const events = [
  { id: 'evt-1', title: '捷運到日市集', tag: '中山', img: '#cfe8c8', colorKey: 'variant-1' },
  { id: 'evt-2', title: '信義計畫區音樂會', tag: '台北捷運', img: '#cfe1e8', colorKey: 'variant-4' },
  { id: 'evt-3', title: '淡水老街美食探索', tag: '淡水', img: '#e8dfc8', colorKey: 'variant-3' },
  { id: 'evt-4', title: '士林夜市市集', tag: '士林', img: '#e8cfd8', colorKey: 'variant-5' },
  { id: 'evt-5', title: '台北車站街頭音樂節', tag: '台北車站', img: '#cfe5f0', colorKey: 'variant-2' },
  { id: 'evt-6', title: '信義區藝術展', tag: '信義', img: '#cfe2d0', colorKey: 'variant-6' },
  { id: 'evt-7', title: '大稻埕文創市集', tag: '大稻埕', img: '#e8c0b8', colorKey: 'variant-3' },
  { id: 'evt-8', title: '北投溫泉祭', tag: '北投', img: '#cfe0e8', colorKey: 'variant-4' },
  { id: 'evt-9', title: '松山夜跑', tag: '松山', img: '#e8e0c8', colorKey: 'variant-1' },
  { id: 'evt-10', title: '南港科技講座', tag: '南港', img: '#cfe8d0', colorKey: 'variant-5' },
  { id: 'evt-11', title: '文山書展', tag: '文山', img: '#e8d8f8', colorKey: 'variant-2' },
  { id: 'evt-12', title: '內湖運動會', tag: '內湖', img: '#cfe4c8', colorKey: 'variant-6' },
]

export function getEvents() {
  return events
}
