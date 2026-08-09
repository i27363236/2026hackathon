// 禮物/優惠券可使用地點 — LocationHintCard(最近一處)與收禮頁 BottomSheet 清單共用同一份資料。
//
// lines: 台北捷運路線代碼,對應 _metro-lines.scss 的 $metro-lines key(R/G/Y/BL/BR),
//        由 <MetroLineBadge> 渲染成識別色塊。
// exit:  這個地點最近的單一出口(卡片標題用)。
// exits: 同站其他也走得到的出口(卡片「位於這些出口」那行用),不含「號出口」字樣。
// photo: 裸 URL,直接餵給 <img :src> — 與 stationPhotos.js 同契約,不是 CSS background 簡寫。
//
// 「最近」在這個 Demo 是假的:專案沒有接 geolocation,清單第一筆即視為最近的地點。

const u = (id) => `https://images.unsplash.com/photo-${id}?w=800&h=500&fit=crop&q=80`

const usableLocations = [
  {
    id: 'loc-zhongshan',
    station: '中山站',
    lines: ['R', 'G'],
    exit: '5號出口',
    exits: ['3', '5', 'K1'],
    store: '誠品南西店',
    photo: u('1481437156560-3205f6a55735'),
  },
  {
    id: 'loc-zhongxiao-fuxing',
    station: '忠孝復興站',
    lines: ['BL', 'BR'],
    exit: '2號出口',
    exits: ['2', '4'],
    store: '誠品復興館',
    photo: u('1441986300917-64674bd600d8'),
  },
  {
    id: 'loc-shuanglian',
    station: '雙連站',
    lines: ['R'],
    exit: '1號出口',
    exits: ['1', '2'],
    store: '全家雙連店',
    photo: u('1601599963565-b7ba29c8e3ff'),
  },
  {
    id: 'loc-ximen',
    station: '西門站',
    lines: ['BL', 'G'],
    exit: '6號出口',
    exits: ['1', '6'],
    store: '7-11 西門店',
    photo: u('1528360983277-13d401cdc186'),
  },
]

export function getUsableLocations() {
  return usableLocations
}

// Demo:沒有定位資訊,固定回傳清單第一筆當作「最近的地點」。
export function getNearestLocation() {
  return usableLocations[0]
}
