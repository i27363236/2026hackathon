# 捷點大集合（mpoints-assemble）

2026 捷運黑客松作品 — 捷運點集點 / 兌換 / 送禮的行動網頁原型。
Vue 3 + Vite + Bootstrap 5 + SCSS,無 TypeScript,以雜湊路由運作。

## 快速開始

```bash
npm i
npx playwright install chromium   # check 腳本與冒煙測試需要
npm run dev                        # 開發伺服器 http://localhost:5173
```

## 指令

| 指令                 | 作用                                                     |
| -------------------- | -------------------------------------------------------- |
| `npm run dev`        | 啟動 Vite 開發伺服器                                     |
| `npm run build`      | 打包到 `dist/`                                          |
| `npm run preview`    | 預覽打包結果                                              |
| `npm run lint`       | ESLint(`src`)                                          |
| `npm run type-check` | vue-tsc 型別檢查                                         |
| `npm run check`      | 路由健檢:逐路由收集 console 錯誤 + 截圖(見 docs/verification.md）|
| `npm test`           | Playwright 冒煙測試                                       |

## 目錄概觀

```
src/
  components/   外殼(AppLayout/TopToolbar/側欄)+ 各頁區塊元件
  views/        路由目標(home / points / coupons / use / profile)
  data/         純資料模組
  stores/       Pinia store(購買 / 送禮流程)
  nav.js        導覽與首頁功能磚的單一資料來源
  assets/styles SCSS 設計代幣管線
docs/           架構 / 代幣 / 資料 / 驗證文件
scripts/        路由健檢 CLI
tests/          冒煙測試
```

## 文件

- [docs/architecture.md](docs/architecture.md) — 目錄地圖、AppLayout route meta、nav.js 契約、兌換動線
- [docs/design-tokens.md](docs/design-tokens.md) — 代幣管線、main.scss 順序、spacer 刻度、:root 變數
- [docs/data-and-stores.md](docs/data-and-stores.md) — 資料模組形狀、gifts store 生命週期
- [docs/verification.md](docs/verification.md) — check 腳本與冒煙測試流程
- [docs/icons.md](docs/icons.md) — Phosphor + Iconify 圖示教學
- [AGENTS.md](AGENTS.md) — 給 AI 代理 / 貢獻者的工作規則

## 外部連結

- PRD / 設計:見 [AGENTS.md](AGENTS.md) 的 References(Notion PRD、Figma Design / Slides）
