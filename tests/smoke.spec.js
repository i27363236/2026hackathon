// 冒煙測試 — 驗證關鍵流程能渲染且零 console 錯誤。
// 原則:斷言使用者看得到的文字/角色,不依賴內部 class 名稱(重構時才不會誤報)。
import { test, expect } from '@playwright/test'

function trackErrors(page) {
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(String(err)))
  return errors
}

test('首頁:點數摘要卡正常渲染', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/#/')
  await expect(page.getByRole('heading', { name: '捷運點', exact: true })).toBeVisible()
  // 首頁有多處「優惠券」標題(摘要卡、快捷區),斷言至少第一個可見即可
  await expect(page.getByRole('heading', { name: '優惠券', exact: true }).first()).toBeVisible()
  expect(errors).toEqual([])
})

test('我的點數頁可到達', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/#/points')
  await expect(page).toHaveTitle(/我的捷運點/)
  expect(errors).toEqual([])
})

test('優惠券頁合併列出禮物與優惠券(禮物在上)', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/#/coupons')
  await expect(page.getByRole('heading', { name: '我的禮物' })).toBeVisible()
  await expect(page.getByText('誠品50元抵用券').first()).toBeVisible()
  await expect(page.getByText('誠品生活｜100元優惠券')).toBeVisible()
  expect(errors).toEqual([])
})

test('送禮中心列出禮物並可導向商品頁', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/#/use/gift')
  await expect(page.getByRole('heading', { name: '捷運伴手禮' })).toBeVisible()
  await page.getByText('法式經典可麗露').click()
  await expect(page).toHaveURL(/use\/product\?id=cat-001/)
  expect(errors).toEqual([])
})

test('送禮中心:篩選面板收斂結果並寫進網址,分類籤導向貨架頁', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/#/use/gift')
  await expect(page.getByText('共 87 件')).toBeVisible()

  await page.getByRole('button', { name: /篩選/ }).click()
  const sheet = page.getByRole('dialog')
  // 分類名稱同時是頁面上的導覽籤,所以要限定在面板內點選
  await sheet.getByText('捷客，早安！', { exact: true }).click()
  await expect(sheet.getByText('共 12 件')).toBeVisible()

  // 條件寫進網址 → 重新整理後仍在
  await expect(page).toHaveURL(/cat=morning/)
  await page.reload()
  await expect(page.getByRole('button', { name: /篩選/ })).toContainText('1')

  // 分類籤是連結,不是就地篩選
  await page.getByRole('link', { name: /捷客，早安！/ }).click()
  await expect(page).toHaveURL(/use\/gift\/shelf\?key=morning/)
  await expect(page).toHaveTitle(/捷客，早安！/)
  expect(errors).toEqual([])
})

test('兌換中心:篩選後改用單一結果清單,分類圖示導向分類頁', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/#/coupons/trade')
  await expect(page.getByRole('heading', { name: '速食券' })).toBeVisible()

  await page.getByRole('button', { name: /篩選/ }).click()
  await page.getByRole('dialog').getByText('咖啡券', { exact: true }).click()
  await page.getByRole('button', { name: '關閉' }).click()

  // 結果模式:精選橫列收起,改成單一清單
  await expect(page.getByText('共 4 張')).toBeVisible()
  await expect(page.getByRole('heading', { name: '速食券' })).toBeHidden()

  await page.goto('/#/coupons/trade')
  // 圖示與區塊 › 箭頭都導向同一頁,這裡指定圖示那顆(箭頭的 aria-label 是「查看全部…」)
  await page.getByRole('link', { name: '旅遊券', exact: true }).click()
  await expect(page).toHaveURL(/coupons\/category\?key=travel/)
  await expect(page).toHaveTitle(/旅遊券/)
  expect(errors).toEqual([])
})

test('禮物卡片編輯器載入 Konva 畫布(lazy chunk)', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/#/use/gift/setup')
  await expect(page.locator('canvas').first()).toBeVisible({ timeout: 15_000 })
  expect(errors).toEqual([])
})

test('商品頁可走到結帳', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/#/use/product?id=cat-041')
  await page.getByRole('button', { name: '選擇數量' }).click()
  await page.getByRole('button', { name: '購買' }).click()
  await expect(page).toHaveURL(/use\/checkout/)
  await expect(page.getByText('訂單明細')).toBeVisible()
  expect(errors).toEqual([])
})

test('捷運點不足時,商品頁鎖定結帳', async ({ page }) => {
  const errors = trackErrors(page)
  // cat-014 需要 480 捷運點,餘額(stores/points.js)為 320 — 連一件都買不起,主按鈕直接鎖住
  // (不再事後跳紅字警告)。
  await page.goto('/#/use/product?id=cat-014')
  await expect(page.getByRole('button', { name: '選擇數量' })).toBeDisabled()
  expect(errors).toEqual([])
})

test('捷運點只夠買一件時,數量加不上去', async ({ page }) => {
  const errors = trackErrors(page)
  // cat-021 需要 400 捷運點,餘額 320… 改用 cat-002(320 點)剛好只買得起 1 件。
  await page.goto('/#/use/product?id=cat-002')
  await page.getByRole('button', { name: '選擇數量' }).click()
  // 數量停在 1,加號停用 — 使用者不會先加到買不起才被擋。
  await expect(page.getByRole('button', { name: '增加數量' })).toBeDisabled()
  await expect(page.getByRole('button', { name: '兌換' })).toBeEnabled()
  expect(errors).toEqual([])
})

test('捷運點餘額單一來源:首頁/點數頁/商品頁一致', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/#/')
  await expect(page.getByRole('heading', { name: '捷運點', exact: true })).toBeVisible()
  await expect(page.getByText('320', { exact: true }).first()).toBeVisible()
  await page.goto('/#/points')
  await expect(page.getByText('320', { exact: true })).toBeVisible()
  // 捷運點商品頁 footer 顯示目前餘額
  await page.goto('/#/use/product?id=cat-001')
  await expect(page.getByText('目前擁有 320 捷運點')).toBeVisible()
  expect(errors).toEqual([])
})

test('送禮閉環E2E:商品→結帳→編輯→送出→收禮→兌換', async ({ page }) => {
  const errors = trackErrors(page)
  // headless Chromium 一律把 Notification.permission 回報為 denied(連 grantPermissions 也無效),
  // 所以這裡把它換成「可授權」的版本,才測得到到期提醒開啟成功的分支。
  // 被封鎖的分支由另一個測試涵蓋。
  await page.addInitScript(() => {
    let state = 'default'
    Object.defineProperty(window, 'Notification', {
      configurable: true,
      value: {
        get permission() {
          return state
        },
        requestPermission: async () => (state = 'granted'),
      },
    })
  })
  // 商品頁:選數量、切到送禮
  await page.goto('/#/use/product?id=cat-001')
  await page.getByRole('button', { name: '選擇數量' }).click()
  await page.getByRole('button', { name: '送禮' }).click()
  await page.getByRole('button', { name: '兌換' }).click()
  // 結帳(points 模式):送禮資訊在這裡填,收禮人必填 — 空白時確認鍵鎖定
  await expect(page).toHaveURL(/use\/checkout/)
  await expect(page.getByRole('button', { name: '結帳並包裝' })).toBeDisabled()
  await page.getByLabel('收禮人暱稱').fill('小美')
  await page.getByLabel('想說的話（選填）').fill('辛苦了，喝杯咖啡！')
  await page.getByRole('button', { name: '結帳並包裝' }).click()
  // 編輯器:等 Konva 畫布載入後按工具列「完成」
  await expect(page).toHaveURL(/use\/gift\/setup/)
  await expect(page.locator('canvas').first()).toBeVisible({ timeout: 15_000 })
  await page.getByRole('button', { name: '完成' }).click()
  // 預覽 → 送出(headless 無 Web Share API,走複製連結後續導頁)
  await expect(page).toHaveURL(/use\/gift\/preview/)
  await page.getByRole('button', { name: '送出禮物' }).click()
  // 購買成功:文案帶收禮人名字;Demo 版才有的收禮頁預覽入口
  await expect(page.getByRole('heading', { name: '禮物已送出！' })).toBeVisible()
  await expect(page.getByText('已經收到你的禮物與卡片')).toBeVisible()
  await page.getByRole('button', { name: '預覽收禮頁面' }).click()
  // 收禮頁:留言可見、開提醒、兌換後鎖定
  await expect(page.getByText('送了一個禮物給你')).toBeVisible()
  await expect(page.getByText('辛苦了，喝杯咖啡！')).toBeVisible()
  await page.getByRole('button', { name: '開啟到期提醒' }).click()
  await expect(page.getByText('已開啟到期提醒')).toBeVisible()
  await page.getByRole('button', { name: '使用禮物' }).click()
  await expect(page.getByRole('button', { name: '已兌換' })).toBeDisabled()
  expect(errors).toEqual([])
})

test('收禮頁:瀏覽器封鎖通知時,到期提醒顯示封鎖狀態且不可按', async ({ page }) => {
  const errors = trackErrors(page)
  // headless Chromium 預設就是 denied — 不 stub 即為封鎖情境。
  await page.goto('/#/use/gift/received')
  const row = page.getByRole('button', { name: /通知已封鎖/ })
  await expect(row).toBeVisible()
  await expect(row).toBeDisabled()
  expect(errors).toEqual([])
})

test('收禮頁最近地點卡 → 可使用地點 sheet → 規劃路線說明', async ({ page }) => {
  const errors = trackErrors(page)
  // 先送出一份禮物,收禮頁動作才可用(無禮物時按鈕 disabled)
  await page.goto('/#/use/product?id=cat-007')
  await page.getByRole('button', { name: '選擇數量' }).click()
  await page.getByRole('button', { name: '送禮' }).click()
  await page.getByRole('button', { name: '兌換' }).click()
  await page.getByLabel('收禮人暱稱').fill('阿方')
  await page.getByRole('button', { name: '結帳並包裝' }).click()
  await expect(page.locator('canvas').first()).toBeVisible({ timeout: 15_000 })
  await page.getByRole('button', { name: '完成' }).click()
  await page.getByRole('button', { name: '送出禮物' }).click()
  await page.getByRole('button', { name: '預覽收禮頁面' }).click()
  // 不用點任何東西,最近的可使用地點就在畫面上
  await expect(page.getByRole('heading', { name: '中山站 5號出口' })).toBeVisible()
  // 要看別站才展開清單
  await page.getByRole('button', { name: '其他地點' }).click()
  await expect(page.getByRole('heading', { name: '可使用地點' })).toBeVisible()
  await expect(page.getByText('誠品復興館・2號出口')).toBeVisible()
  // 規劃路線在 Demo 只說明意圖,不假裝成功
  await page.getByRole('button', { name: '規劃路線' }).first().click()
  await expect(page.getByText('將開啟「台北捷運Go」為你規劃路線（Demo 未串接）')).toBeVisible()
  expect(errors).toEqual([])
})

test('每日簽到:點數 +10 且按鈕鎖定', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/#/points')
  await page.getByRole('button', { name: '每日簽到領取捷運點數' }).click()
  // 餘額 320 → 330,按鈕翻成已簽到
  await expect(page.getByText('330')).toBeVisible()
  await expect(page.getByRole('button', { name: '今日已簽到' })).toBeDisabled()
  // 歷史紀錄出現簽到交易
  await expect(page.getByText('每日簽到獎勵').first()).toBeVisible()
  expect(errors).toEqual([])
})

test('點數紀錄頁:三分頁與即將到期提示', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/#/points/history')
  await expect(page.getByRole('button', { name: '即將到期' })).toBeVisible()
  await expect(page.getByRole('button', { name: '累點明細' })).toBeVisible()
  await expect(page.getByRole('button', { name: '銷點明細' })).toBeVisible()
  await expect(page.getByText('近 6 週累/銷點')).toBeVisible()
  await expect(page.getByText(/30 天內到期/)).toBeVisible()
  await page.getByRole('button', { name: '銷點明細' }).click()
  await expect(page.getByText(/兌換/).first()).toBeVisible()
  expect(errors).toEqual([])
})

test('空白禮物頁路徑轉址到禮物紀錄', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/#/profile/gifts/available')
  await expect(page).toHaveURL(/profile\/gifts\/history/)
  await expect(page.getByText('其他優惠券')).toBeVisible() // 可使用分頁內容
  expect(errors).toEqual([])
})

test('智慧推薦說明 sheet 可見，關閉後首頁顯示已關閉狀態', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/#/')
  await page.getByRole('button', { name: '為什麼推薦？' }).click()
  await expect(page.getByRole('heading', { name: '為什麼推薦這個？' })).toBeVisible()
  await expect(page.getByText('怎麼推薦')).toBeVisible()
  await expect(page.getByText('不蒐集什麼')).toBeVisible()
  await expect(page.getByText('你可以關閉')).toBeVisible()
  // sheet 內的開關關閉情境推薦 → 首頁換成靜態卡(手機/平板各一份,取可見的那份)
  await page.getByRole('switch').click()
  await expect(page.getByText('已關閉情境推薦').last()).toBeVisible()
  await expect(page.getByRole('button', { name: '重新開啟' })).toBeVisible()
  expect(errors).toEqual([])
})

test('Profile 頁可見情境推薦開關', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/#/profile')
  await expect(page.getByText('情境推薦', { exact: true })).toBeVisible()
  await expect(page.getByRole('switch')).toBeVisible()
  expect(errors).toEqual([])
})
