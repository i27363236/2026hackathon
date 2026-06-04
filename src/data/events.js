// Read-only catalog of "大家都參加" events shown on HomeView.
// Each item carries a stable id and a colorKey (variant-1 … variant-6, see _card-colors.scss).

const events = [
  { id: 'evt-1', title: '捷運到日市集', tag: '中山', img: '#cfe8c8', colorKey: 'variant-1' },
  { id: 'evt-2', title: '信義計畫區音樂會', tag: '台北捷運', img: '#cfe1e8', colorKey: 'variant-4' },
  { id: 'evt-3', title: '淡水老街美食探索', tag: '淡水', img: '#e8dfc8', colorKey: 'variant-3' },
  { id: 'evt-4', title: '士林夜市市集', tag: '士林', img: '#e8cfd8', colorKey: 'variant-5' },
]

export function getEvents() {
  return events
}
