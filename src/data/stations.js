// 捷運站名冊 + 商家對照 — 篩選面板的「位置」面向資料來源。
//
// 為什麼是 merchant 對照而不是在 catalog.js 每筆商品加欄位:
// 87 筆商品只來自 48 個 merchant,且不少 merchant 本身就是地點(光華商場、士林夜市、
// 誠品生活南西…)。用對照表可以完全不動 catalog.js,同一家店的商品也不會各自重複站名。
//
// lines[] 對應 _metro-lines.scss 的 R/G/Y/BL/BR,直接餵給 <MetroLineBadge>。
// 注意:中和新蘆線(橘)不在 $metro-lines 裡,其色值又與本專案的 Y(#f8b51c)過於接近,
// 貿然新增會讓兩種徽章難以分辨。因此名冊只收錄可以被正確標色的路線 —— 忠孝新生、東門
// 這類同時停靠橘線的站,只列出可渲染的那條(仍為事實,只是未窮舉)。

const ALL_STATIONS = '*'

const stations = [
  // 板南線 BL
  { id: 'taipei-main', name: '台北車站', lines: ['BL', 'R'] },
  { id: 'shandao-temple', name: '善導寺', lines: ['BL'] },
  { id: 'zhongxiao-xinsheng', name: '忠孝新生', lines: ['BL'] },
  { id: 'zhongxiao-fuxing', name: '忠孝復興', lines: ['BL', 'BR'] },
  { id: 'zhongxiao-dunhua', name: '忠孝敦化', lines: ['BL'] },
  { id: 'houshanpi', name: '後山埤', lines: ['BL'] },
  { id: 'nangang', name: '南港', lines: ['BL'] },
  // 松山新店線 G
  { id: 'ximen', name: '西門', lines: ['BL', 'G'] },
  { id: 'beimen', name: '北門', lines: ['G'] },
  { id: 'zhongshan', name: '中山', lines: ['R', 'G'] },
  { id: 'nanjing-fuxing', name: '南京復興', lines: ['G', 'BR'] },
  { id: 'gongguan', name: '公館', lines: ['G'] },
  // 淡水信義線 R
  { id: 'zhishan', name: '芝山', lines: ['R'] },
  { id: 'jiantan', name: '劍潭', lines: ['R'] },
  { id: 'dongmen', name: '東門', lines: ['R'] },
  { id: 'daan-park', name: '大安森林公園', lines: ['R'] },
  { id: 'daan', name: '大安', lines: ['R', 'BR'] },
  { id: 'taipei-101', name: '台北101/世貿', lines: ['R'] },
]

// merchant → 車站 id。'*' 代表全線皆可(目前只有站內租借服務)。
const merchantStations = {
  // 站內服務 / 捷運自營
  ChargeSPOT: ALL_STATIONS,
  'Metro Team': ['taipei-main'],

  // 商圈與地標
  中山站商圈: ['zhongshan'],
  信義商圈: ['taipei-101'],
  台北101: ['taipei-101'],
  西門町: ['ximen'],
  萬年商業大樓: ['ximen'],
  公館商圈: ['gongguan'],
  舊香居: ['gongguan'],
  東區商圈: ['zhongxiao-dunhua'],
  'SOGO忠孝館': ['zhongxiao-fuxing'],
  光華商場: ['zhongxiao-xinsheng'],
  光華數位新天地: ['zhongxiao-xinsheng'],
  後站商圈: ['taipei-main'],
  大稻埕商圈: ['beimen'],
  永康街商圈: ['dongmen'],
  天母商圈: ['zhishan'],
  士林夜市: ['jiantan'],
  五分埔商圈: ['houshanpi'],
  五分埔流行廣場: ['houshanpi'],
  建國花市: ['daan-park'],
  建國假日花市: ['daan-park'],
  南港LaLaport: ['nangang'],
  蔦屋書店: ['nangang'],
  誠品生活南西: ['zhongshan'],
  鼎泰豐: ['dongmen'],

  // 早餐 / 飲品連鎖 — 多站
  路易莎咖啡: ['taipei-main', 'gongguan', 'nanjing-fuxing'],
  摩斯漢堡: ['taipei-main', 'ximen', 'zhongxiao-fuxing'],
  早安美芝城: ['taipei-main', 'jiantan', 'houshanpi'],
  美而美早餐: ['houshanpi', 'jiantan'],
  丹堤咖啡: ['taipei-main', 'gongguan', 'zhongxiao-fuxing'],
  珍煮丹: ['ximen', 'gongguan'],
  古早味飯糰: ['shandao-temple', 'zhongshan'],

  // 單店
  真芳碳烤吐司: ['taipei-main'],
  福來早餐: ['gongguan'],
  春日咖啡: ['dongmen'],
  哈肯鋪: ['dongmen'],
  樂田麵包屋: ['nanjing-fuxing'],
  起司光年: ['nanjing-fuxing'],
  茶韻坊: ['daan'],
  可可研究所: ['zhongxiao-dunhua'],
  果醒坊: ['zhongxiao-fuxing'],
  麗茲烘焙: ['zhongshan'],
  艾蜜莉甜點: ['zhongshan'],
  晨光咖啡: ['zhongshan'],
  日初烘焙: ['zhongshan'],
  京町抹茶所: ['zhongshan'],
  和栗屋: ['zhongshan'],
}

const allStationIds = stations.map((s) => s.id)

export function getStations() {
  return stations
}

export function getStationById(id) {
  return stations.find((s) => s.id === id)
}

// 某商家可取貨/使用的車站 id 陣列。未收錄的商家回傳空陣列(不會被任何車站篩到)。
export function getStationsForMerchant(merchant) {
  const entry = merchantStations[merchant]
  if (entry === ALL_STATIONS) return allStationIds
  return entry ?? []
}
