// 近 45 天的捷運點交易假資料 — 供 stores/points.js 種子用。
// 以「今天」為基準決定性產生(不用亂數),讓「即將到期」「週趨勢」隨時保持合理。
// Transaction shape: { id, type: 'earn'|'redeem', category: 'ride'|'checkin'|'event'|'redeem',
//                      title, ts, date, amount, expiresAt? }
// type 供列表 icon/顏色(沿用 PointsView 既有判斷);category 供明細分類;
// earn 交易帶 expiresAt(ts + 60 天)模擬點數分批到期。

const DAY = 86400000
const EXPIRE_DAYS = 60
const pad = (n) => String(n).padStart(2, '0')

function fmt(ts) {
  const d = new Date(ts)
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function at(dayTs, hour, minute = 0) {
  const d = new Date(dayTs)
  d.setHours(hour, minute, 0, 0)
  return d.getTime()
}

const LINES = ['板南線', '淡水信義線', '文湖線', '松山新店線']

export function getPointsHistory() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const txs = []
  let id = 1

  for (let back = 45; back >= 1; back--) {
    const dayTs = today.getTime() - back * DAY
    const dow = new Date(dayTs).getDay() // 0=日 … 6=六

    // 平日通勤:早晚各一趟 +5
    if (dow >= 1 && dow <= 5) {
      const line = LINES[back % LINES.length]
      const morning = at(dayTs, 8, 30)
      txs.push({
        id: id++, type: 'earn', category: 'ride', title: `搭乘捷運 - ${line}`,
        ts: morning, date: fmt(morning), amount: 5, expiresAt: morning + EXPIRE_DAYS * DAY,
      })
      const evening = at(dayTs, 18, 20)
      txs.push({
        id: id++, type: 'earn', category: 'ride', title: `搭乘捷運 - ${line}`,
        ts: evening, date: fmt(evening), amount: 5, expiresAt: evening + EXPIRE_DAYS * DAY,
      })
    }

    // 每 3 天簽到一次 +10(示意過去不完美的簽到習慣)
    if (back % 3 === 0) {
      const t = at(dayTs, 7, 0)
      txs.push({
        id: id++, type: 'earn', category: 'checkin', title: '每日簽到獎勵',
        ts: t, date: fmt(t), amount: 10, expiresAt: t + EXPIRE_DAYS * DAY,
      })
    }

    // 週六參加累點活動 +30
    if (dow === 6 && back % 2 === 1) {
      const t = at(dayTs, 14, 0)
      txs.push({
        id: id++, type: 'earn', category: 'event', title: '參加捷運集章活動',
        ts: t, date: fmt(t), amount: 30, expiresAt: t + EXPIRE_DAYS * DAY,
      })
    }

    // 每 11 天兌換一次
    if (back % 11 === 0) {
      const t = at(dayTs, 15, 45)
      const redeem = back % 22 === 0
        ? { title: '兌換捷運一日票', amount: -150 }
        : { title: '兌換大冰拿鐵 (中)', amount: -55 }
      txs.push({
        id: id++, type: 'redeem', category: 'redeem', title: redeem.title,
        ts: t, date: fmt(t), amount: redeem.amount,
      })
    }
  }

  // 近期在前(與 PointsView 列表一致)
  return txs.sort((a, b) => b.ts - a.ts)
}
