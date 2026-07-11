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
  await expect(page).toHaveTitle(/我的點數/)
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

test('禮物卡片編輯器載入 Konva 畫布(lazy chunk)', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/#/use/gift/setup')
  await expect(page.locator('canvas').first()).toBeVisible({ timeout: 15_000 })
  expect(errors).toEqual([])
})

test('商品頁可走到結帳', async ({ page }) => {
  const errors = trackErrors(page)
  // cat-001 是捷運點商品(180 點),而測試帳號僅有 15 點,會觸發新增的點數不足鎖定;
  // 改用 cat-041(NT$ 購買商品)驗證結帳流程本身仍可正常走通。
  await page.goto('/#/use/product?id=cat-041')
  await page.getByRole('button', { name: '選擇數量' }).click()
  await page.getByRole('button', { name: '購買' }).click()
  await expect(page).toHaveURL(/use\/checkout/)
  await expect(page.getByText('訂單明細')).toBeVisible()
  expect(errors).toEqual([])
})

test('捷運點不足時,商品頁鎖定結帳', async ({ page }) => {
  const errors = trackErrors(page)
  // cat-001 需要 180 捷運點,測試帳號只有 15 點 — 應顯示不足提示且無法進入結帳。
  await page.goto('/#/use/product?id=cat-001')
  await expect(page.getByText('捷運點不足，無法兌換')).toBeVisible()
  await expect(page.getByRole('button', { name: '選擇數量' })).toBeDisabled()
  expect(errors).toEqual([])
})
