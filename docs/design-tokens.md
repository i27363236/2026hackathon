# 設計代幣

代幣管線:Figma → SCSS primitives → 變數覆寫 → Bootstrap → style-overrides → 元件。

## main.scss 匯入順序(不可更動)

`src/assets/styles/main.scss`:

```scss
@import "primitives";        // 原始色階 / 尺寸(如 $blue-700、$cream)
@import "variables";         // 覆寫 Bootstrap 變數 + 發出 :root CSS 自訂屬性
@import "variables-dark";
@import "safe-area";
@import "spacer";            // 自訂 spacer 刻度
@import "typography";
@import "card-colors";       // MRT 卡片配色 variant-1…6

@import "bootstrap/scss/bootstrap";   // Bootstrap 必須在變數覆寫「之後」

@import "style-overrides";   // 最後一層,只補 Bootstrap 特例
```

> Bootstrap 一定要在我們的變數覆寫之後匯入,否則覆寫無效。SCSS 一律用 `@import`(不用
> `@use`)以配合既有風格。

## Spacer 刻度(自訂,非 Bootstrap 預設)

| level | 1 | 2 | 3 | 4  | 5  | 6  | 7  | 8  |
| ----- | - | - | - | -- | -- | -- | -- | -- |
| px    | 2 | 4 | 8 | 12 | 16 | 20 | 24 | 32 |

`p-4`、`gap-3`、`mb-7` 等都走這套刻度 — **不要**假設 Bootstrap 的 `rem` 級距。

## :root CSS 自訂屬性

SFC 的 scoped style 透過這些 `:root` 變數消費代幣(`_variables.scss` 尾端發出),
避免在每個 SFC 用 `additionalData` 重複發出 `:root`:

| 變數                     | 值 / 用途                                             |
| ------------------------ | ---------------------------------------------------- |
| `--px-phone`             | 手機水平內距(16px)                                 |
| `--px-tablet-content`    | 平板主內容內距(24px)                               |
| `--surface-cream`        | 米色縮圖底(`$cream`);ContentCard gift / 結帳縮圖   |
| `--tile-gradient-blue`   | ActionTile 藍變體漸層                                |
| `--tile-gradient-green`  | ActionTile 綠變體漸層                                |
| `--tile-gradient-gray`   | ActionTile 灰變體漸層(首頁功能磚)                  |
| `--gift-note-gradient`   | 禮物卡便箋底漸層                                      |
| `--badge-size-bg/color`  | 尺寸徽章(M/S/L)底色與字色                          |

硬編碼顏色 / 間距只在別無選擇時使用;優先用 SCSS 變數或上述 `:root` 代幣。

## MRT 卡片配色

`_card-colors.scss` 定義 `variant-1`…`variant-6`。資料模組用 `colorKey: 'variant-N'`
指定,`ContentCard` 映射成副標 / 價格的配色類別。

## 版面內距

- 手機水平內距:`$px-phone`(16px)
- 平板工具 / 側欄內距:`$px-tablet-tools`(10px)
- 平板主內容內距:`$px-tablet-content`(24px)

## 字型

刻意使用**系統字體堆疊**(Bootstrap 預設),**不**載入網頁字型(如 Noto Sans TC) —
Figma 標的是 Noto Sans TC,但我們以系統字型呈現,故與 mockup 有輕微字形 / 度量差異。
`$font-family-sans-serif` 在 `_typography.scss` 保持註解掉;以既有 typography 代幣調字級 / 字重。
