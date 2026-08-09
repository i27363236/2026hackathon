// meta.title 可以是字串,也可以是 (route) => string —— 讓標題跟著 query 走
// (貨架頁顯示貨架名、優惠券分類頁顯示分類名)。
//
// 獨立成一支模組是為了避開循環相依:router/index.js 匯入 AppLayout,
// 而 AppLayout 也要用這支解析標題。TopToolbar 與 document.title 共用同一個解析結果,
// 兩邊才不會各自解讀而漂移。
export function resolveTitle(route) {
  const title = route?.meta?.title
  return typeof title === 'function' ? title(route) : title
}
