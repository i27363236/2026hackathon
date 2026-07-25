// 樣式漂移守門員(刻意最小化,不套用完整 standard-scss 以免在 hackathon 專案產生大量雜訊)。
// 只擋三件事:元件樣式裡的硬寫色碼、非 scale 的圓角、以及 !important。
// 顏色/圓角一律要走 token(SCSS 變數、var(--bs-*)、或設計 token),對齊 AGENTS.md 的 UI Consistency Canon。
export default {
  plugins: ['stylelint-declaration-strict-value'],
  // _primitives / _variables 是色階與 token 的源頭,本來就寫字面值 → 不檢查。
  ignoreFiles: [
    'src/assets/styles/_primitives.scss',
    'src/assets/styles/_variables.scss',
    'dist/**',
  ],
  overrides: [
    { files: ['**/*.scss'], customSyntax: 'postcss-scss' },
    { files: ['**/*.vue'], customSyntax: 'postcss-html' },
  ],
  rules: {
    // 顏色 / fill / stroke / 圓角必須是 var()、SCSS 變數或允許清單裡的關鍵字 — 禁止裸色碼與非 scale 的 px。
    'scale-unlimited/declaration-strict-value': [
      ['/color/', 'fill', 'stroke', 'border-radius'],
      {
        ignoreValues: [
          'transparent',
          'currentColor',
          'inherit',
          'initial',
          'unset',
          'none',
          '0',
          '50%',
          '100%',
        ],
        disableFix: true,
      },
    ],
    // 顏色/按鈕的 !important 覆寫是漂移的主要來源(見已清掉的 #007bbd 覆寫)。
    'declaration-no-important': true,
  },
}
