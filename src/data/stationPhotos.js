// MRT station photos the user can drop into the canvas editor (GiftSetupView photo panel).
// Shape: { id, name, src }. `src` is a plain image URL (consumed by <img :src> and the
// Konva Image loader — no url(...) wrapper here). Photos are hand-picked Unsplash shots,
// representative of each station's neighbourhood (not exact landmark photography).
const p = (id) =>
  `https://images.unsplash.com/photo-${id}?w=400&h=400&fit=crop&q=80`

export const stationPhotos = [
  { id: 'st-101', name: '台北101／世貿', src: p('1598935898639-81586f7d2129') },
  { id: 'st-xinyi', name: '信義商圈', src: p('1470004914212-05527e49370b') },
  { id: 'st-tamsui', name: '淡水', src: p('1573790387438-4da905039392') },
  { id: 'st-zhongshan', name: '中山', src: p('1554118811-1e0d58224f24') },
  { id: 'st-ximen', name: '西門', src: p('1528360983277-13d401cdc186') },
  { id: 'st-beitou', name: '北投', src: p('1545569341-9eb8b30979d9') },
  { id: 'st-shilin', name: '士林夜市（劍潭）', src: p('1508248467877-aec1b08de376') },
  { id: 'st-daan', name: '大安森林公園', src: p('1441974231531-c6227db76b6e') },
  { id: 'st-yuanshan', name: '圓山', src: p('1519677100203-a0e668c92439') },
  { id: 'st-cks', name: '中正紀念堂', src: p('1518998053901-5348d3961a04') },
]
