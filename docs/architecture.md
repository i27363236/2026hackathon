# 架構總覽

捷點大集合 — Vue 3 + Vite + Bootstrap 5 SPA,雜湊路由(`createWebHashHistory`)。

## 目錄地圖

```
src/
  main.js                入口:掛載 App、Pinia、router、Bootstrap JS
  App.vue                只掛 <RouterView>
  router/index.js        路由表 + route meta 旗標(見下)
  nav.js                 側欄 / 浮動導覽 / 首頁功能磚的單一資料來源
  assets/styles/         SCSS(設計代幣管線,見 design-tokens.md)
  components/
    AppLayout.vue        外殼:TopToolbar + 側欄 + <RouterView>,讀 route meta
    TopToolbar.vue       頂欄(標題 / 返回 / #top-toolbar-actions teleport 目標)
    AppSidebar.vue       平板側欄(讀 nav.js)
    FloatingNavPill.vue  手機浮動導覽(讀 nav.js)
    ToolbarButton.vue    頂欄圓鈕
    ActionTile.vue       首頁功能磚
    cards/ContentCard.vue  橫列 / 大圖 / 禮物三合一卡片(variant 切換)
    home/                首頁區塊:HeroCarousel / HomeSummaryCards /
                         SmartRecommendations / ActionTilesSection
    checkout/            結帳區塊:CheckoutOptionGroup / CheckoutFooter / PointsStepper
    profile/MedalSection.vue  個人檔案的獎章卡(成就 / 送出禮物共用)
    editor/              禮物卡編輯器:GiftCanvas(Konva)/ EditorOptionsPanel /
                         EditToolbar / StampBuilder / stampShapes.js / stampIcons
    gift/                FlipCard / ProductFace / QrFace / GiftCard / CouponCard
  views/                 路由目標(見路由表)
  data/                  純資料模組(見 data-and-stores.md)
  stores/gifts.js        Pinia 購買 / 送禮流程 store(見 data-and-stores.md)
  composables/useUndoHistory.js  編輯器 undo/redo
docs/                    本文件夾
scripts/check.mjs        路由健檢 CLI(見 verification.md)
tests/smoke.spec.js      冒煙測試(見 verification.md)
```

## AppLayout 外殼與 route meta 旗標

所有頁面都是 `AppLayout` 的子路由。`AppLayout` 讀當前 route 的 `meta` 決定外殼呈現:

| meta 旗標           | 作用                                                     |
| ------------------- | -------------------------------------------------------- |
| `title`             | 頂欄標題(同時寫入 `document.title`)                    |
| `hideTitle`         | 隱藏頂欄標題文字(編輯器用)                             |
| `back`              | 顯示返回鍵(`router.back()`)                            |
| `showProfile`       | 頂欄右側顯示頭像                                          |
| `showSidebar`       | 顯示平板側欄 / 手機浮動導覽                               |
| `heroTop`           | 頂欄疊在 Hero 之上(首頁)                               |
| `showHomeActions`   | 頂欄動作區:首頁專用動作                                 |
| `showCouponActions` | 頂欄動作區:優惠券頁專用動作                             |
| `showEventActions`  | 頂欄動作區:累點活動頁專用動作                           |

## nav.js 契約

`src/nav.js` 匯出 `mainNav` / `earnPointNav` / `usePointNav`,是側欄、浮動導覽與首頁功能磚的**單一來源**。每個項目:

- `label` — 顯示名稱
- `icon` — 側欄 / 導覽用圖示(`ph:*-light` 細線)
- `tileIcon` — 首頁功能磚專用圖示(省略時退回 `icon`)
- `to` — 路由目標;`null` = 尚未實作的底欄佔位,`{ name: 'in-development' }` 目標在磚上呈現停用

## 兌換 / 送禮動線

- 首頁**摘要卡**的「優惠券」→ `{ name: 'coupons' }`(兌換總覽:禮物在上 + 優惠券)
- 首頁**功能磚**與**側欄**的「優惠券」→ `{ name: 'coupon-trade' }`(`/coupons/trade` 交換中心)
- 首頁功能磚與側欄的「送禮」→ `{ name: 'gift-home' }`(`/use/gift` 送禮中心)
- 送禮中心 → 商品頁(`use-product`)→ 結帳(`purchase-checkout`)→ 編輯器(`use-gift-setup`)→ 預覽(`use-gift-preview`)→ 收禮(`use-gift-received`)

## 未接線的隊友 WIP

`views/coupons/MyCoupon.vue` 與 `MyCouponUsed.vue` 尚未接進路由,是隊友進行中的檔案 —
**請勿刪除**。同理 `views/profile/` 下的 `GiftsView` / `GiftsAvailableView` /
`GiftsHistoryView` / `GiftsSentView` 已接線但屬隊友負責範圍。
