# 驗證流程

沒有單元測試框架;靠兩支工具驗證:路由健檢腳本(`npm run check`)與冒煙測試(`npm test`)。
每完成一項改動,兩者都要跑過。

## `npm run check` — 路由健檢 CLI

`scripts/check.mjs` 逐條路由 × 視窗尺寸(phone 390×844、tablet 1024×768)載入頁面,收集
console error、pageerror、失敗請求與 4xx/5xx 回應,並各存一張全頁截圖。**零錯誤才算通過**
(截圖只是輔助)。

```bash
npm run check                       # 檢查內建 ROUTES 全部路由
npm run check -- /points /coupons   # 只檢查指定 hash 路由
npm run check -- --viewport=phone / # 只跑單一視窗尺寸
```

- 會重用已在跑的 dev server;沒有就自己開一個(結束時收掉)。
- 截圖輸出到 `screenshots/check/<route-slug>--<viewport>.png`(gitignored)。用 Read 工具看圖。
- 任何一條有錯就以 exit 1 結束。
- 路由清單是 `scripts/check.mjs` 裡對照 `src/router/index.js` 手動維護的陣列(Vite 外無法匯入
  router),需要參數的路由帶示範 query(如 `/use/product?id=cat-001`)。

## `npm test` — 冒煙測試

`tests/smoke.spec.js`(Playwright)6 條測試,每條也斷言零 console error。**斷言可見文字 /
角色,絕不斷言內部 class 名稱**(class 會在重構中改變)。

```bash
npm test                # = playwright test(chromium only)
```

目前涵蓋:首頁摘要卡、我的點數頁、`/coupons` 合併列表(禮物在上 + 優惠券)、
禮物編輯器載入 Konva 畫布、送禮中心導向商品頁、商品頁走到結帳。

## 新增路由 / 測試時

- 新增路由 → 同步更新 `scripts/check.mjs` 的 `ROUTES` 陣列(需參數的帶示範 query)。
- 新增冒煙測試 → 斷言使用者看得到的文字或角色,不要碰 class 名稱。

## 首次環境設定

```bash
npm i
npx playwright install chromium
```
