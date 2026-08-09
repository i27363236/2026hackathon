#!/usr/bin/env node
// 路由健檢腳本 — 每條路由 × 視窗尺寸載入一次，收集 console 錯誤、頁面例外、
// 失敗請求與 4xx/5xx 回應，並各存一張全頁截圖到 test-results/check/。
// 截圖只是輔助；真正的判定依據是錯誤收集(零錯誤才算通過)。
//
// 用法:
//   npm run check                        # 檢查 ROUTES 全部路由
//   npm run check -- /points /coupons    # 只檢查指定 hash 路由
//   npm run check -- --viewport=phone /  # 只跑單一視窗尺寸
import { chromium } from '@playwright/test'
import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const BASE = 'http://localhost:5173'
// 注意:不能放在 test-results/ 下 — playwright test 每次啟動會清空該目錄。
const OUT_DIR = 'screenshots/check'

const VIEWPORTS = {
  phone: { width: 390, height: 844 },
  tablet: { width: 1024, height: 768 },
}

// 與 src/router/index.js 手動同步;需要參數的路由帶入示範 query。
const ROUTES = [
  '/',
  '/points',
  '/points/history',
  '/points/events',
  '/coupons',
  '/coupons/trade',
  '/coupons/category?key=coffee',
  '/use/product?id=cat-001',
  '/use/product?id=cat-085',
  '/use/gift',
  '/use/gift/shelf?key=morning',
  '/use/gift/setup',
  '/use/gift/preview',
  '/use/gift/received',
  '/use/coupons',
  '/use/checkout',
  '/use/purchase-success',
  '/profile',
  '/profile/gifts',
  '/profile/gifts/available',
  '/profile/gifts/history',
  '/profile/gifts/sent',
]

const args = process.argv.slice(2)
const viewportArg = args.find((a) => a.startsWith('--viewport='))?.split('=')[1]
const routes = args.filter((a) => !a.startsWith('--'))
const targetRoutes = routes.length > 0 ? routes : ROUTES
const targetViewports = viewportArg ? { [viewportArg]: VIEWPORTS[viewportArg] } : VIEWPORTS

if (viewportArg && !VIEWPORTS[viewportArg]) {
  console.error(`未知的 viewport「${viewportArg}」,可用: ${Object.keys(VIEWPORTS).join(', ')}`)
  process.exit(1)
}

async function serverUp() {
  try {
    const res = await fetch(BASE)
    return res.ok
  } catch {
    return false
  }
}

// 重用已在跑的 dev server;沒有就自己開一個(detached 讓整個 process group 可一起收掉)。
let devServer = null
if (!(await serverUp())) {
  console.log('dev server 未啟動,自動執行 npm run dev …')
  devServer = spawn('npm', ['run', 'dev'], { stdio: 'ignore', detached: true })
  const deadline = Date.now() + 30_000
  while (!(await serverUp())) {
    if (Date.now() > deadline) {
      console.error('dev server 未在 30 秒內就緒,中止。')
      process.kill(-devServer.pid, 'SIGTERM')
      process.exit(1)
    }
    await new Promise((r) => setTimeout(r, 500))
  }
}

await mkdir(OUT_DIR, { recursive: true })
const browser = await chromium.launch()
const results = []

for (const route of targetRoutes) {
  for (const [vpName, viewport] of Object.entries(targetViewports)) {
    const page = await browser.newPage({ viewport })
    const errors = []
    const failures = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(String(err)))
    page.on('requestfailed', (req) => {
      const reason = req.failure()?.errorText ?? ''
      if (reason.includes('ERR_ABORTED')) return // 導航取消的請求不算失敗
      failures.push(`${reason} ${req.url()}`)
    })
    page.on('response', (res) => {
      if (res.status() >= 400) failures.push(`HTTP ${res.status()} ${res.url()}`)
    })

    await page.goto(`${BASE}/#${route}`, { waitUntil: 'load' }).catch((err) => errors.push(String(err)))
    await page.waitForTimeout(1500) // 等 lazy chunk、遠端圖片與進場動畫

    const slug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/[/?=&]+/g, '-')
    const file = path.join(OUT_DIR, `${slug}--${vpName}.png`)
    await page.screenshot({ path: file, fullPage: true })
    results.push({ route, viewport: vpName, errors, failures, file })
    await page.close()
  }
}

await browser.close()
if (devServer) process.kill(-devServer.pid, 'SIGTERM')

let failed = 0
console.log('\n路由健檢結果:')
for (const r of results) {
  const ok = r.errors.length === 0 && r.failures.length === 0
  if (!ok) failed++
  console.log(`${ok ? '✅' : '❌'} ${r.route} [${r.viewport}] → ${r.file}`)
  for (const e of r.errors) console.log(`    console/page error: ${e}`)
  for (const f of r.failures) console.log(`    request: ${f}`)
}
console.log(`\n${results.length - failed}/${results.length} 通過;截圖在 ${OUT_DIR}/`)
process.exit(failed > 0 ? 1 : 0)
