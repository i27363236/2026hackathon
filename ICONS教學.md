# 圖示（Icon）使用教學

## 什麼是 Phosphor + Iconify？

- **Phosphor Icons**：一套漂亮的圖示庫，有幾百種常用圖示（房子、搜尋、愛心、箭頭…）。
- **Iconify**：讓我們可以在 Vue 裡輕鬆使用這些圖示的工具。

你不需要自己下載圖片或 SVG，只要寫一行 code 就能顯示圖示。

---

## 第一步：在你的 `.vue` 檔最上方引入 Icon

每個要用圖示的 `.vue` 檔，都要加這一行：

```vue
<script setup>
import { Icon } from '@iconify/vue'
</script>
```

就像 HTML 裡要先 `<link>` CSS 才能用樣式，這裡是先 `import` 才能用 `<Icon>`。

---

## 第二步：在 `<template>` 裡放圖示

```vue
<template>
  <Icon icon="ph:house" />
</template>
```

這樣就會顯示一個房子圖示。

### 圖示名稱的格式

```
ph:圖示名稱
```

- `ph:` 代表 Phosphor 這個圖示庫（固定不變）
- 後面接圖示的名稱，例如 `house`、`magnifying-glass`、`heart`

---

## 常見圖示對照表

| 你想要的圖示 | 使用的名稱 |
|---|---|
| 房子 | `ph:house` |
| 搜尋（放大鏡） | `ph:magnifying-glass` |
| 愛心 | `ph:heart` |
| 星星 | `ph:star` |
| 使用者頭像 | `ph:user` |
| 設定（齒輪） | `ph:gear` |
| 關閉（X） | `ph:x` |
| 返回箭頭 | `ph:arrow-left` |
| 選單（漢堡） | `ph:list` |
| 加號 | `ph:plus` |
| 打勾 | `ph:check` |
| 垃圾桶 | `ph:trash` |
| 鉛筆（編輯） | `ph:pencil` |
| 地圖標記 | `ph:map-pin` |
| 時鐘 | `ph:clock` |
| 月台 / 火車 | `ph:train` |
| 警告 | `ph:warning` |
| 資訊 | `ph:info` |

> 想找更多圖示？去這裡搜尋：https://phosphoricons.com

---

## 圖示的兩種風格：線條 vs 實心

Phosphor 每個圖示都有多種風格。最常用的兩種：

| 風格 | 寫法 | 外觀 |
|---|---|---|
| 線條（預設） | `ph:heart` | 空心輪廓 |
| 實心 | `ph:heart-fill` | 填滿實心 |
| 粗線 | `ph:heart-bold` | 較粗的輪廓 |

只要在名稱後面加 `-fill` 或 `-bold` 就好。

---

## 調整大小和顏色

### 大小

用 `width` 和 `height` 屬性（單位是 px）：

```vue
<Icon icon="ph:house" width="24" />
<Icon icon="ph:house" width="48" />
```

或者用 CSS 的 `font-size` 也可以：

```vue
<Icon icon="ph:house" style="font-size: 32px;" />
```

### 顏色

用 CSS 的 `color` 屬性：

```vue
<Icon icon="ph:heart-fill" style="color: red;" />
```

或者加上 Bootstrap 的 class：

```vue
<Icon icon="ph:heart-fill" class="text-danger" />
<Icon icon="ph:check" class="text-success" />
```

---

## 完整範例

```vue
<script setup>
import { Icon } from '@iconify/vue'
</script>

<template>
  <div>
    <!-- 基本用法 -->
    <Icon icon="ph:house" />

    <!-- 放大 + 實心 -->
    <Icon icon="ph:heart-fill" width="32" style="color: red;" />

    <!-- 搭配 Bootstrap -->
    <button class="btn btn-primary">
      <Icon icon="ph:magnifying-glass" />
      搜尋
    </button>

    <!-- 導覽列範例 -->
    <nav>
      <Icon icon="ph:house" width="24" />
      <Icon icon="ph:map-pin" width="24" />
      <Icon icon="ph:user" width="24" />
    </nav>
  </div>
</template>
```

---

## 常見錯誤

| 問題 | 原因 | 解法 |
|---|---|---|
| 圖示不顯示，只有空白 | 忘記 import | 確認 `<script setup>` 裡有 `import { Icon } from '@iconify/vue'` |
| 圖示名稱打錯 | 名稱不存在 | 去 https://phosphoricons.com 確認名稱 |
| 大小沒變 | 忘記加 `width` | 加上 `width="24"` 或用 CSS |

---

## 小結

1. 每個用到圖示的 `.vue` 檔，都要 `import { Icon } from '@iconify/vue'`
2. 用 `<Icon icon="ph:圖示名稱" />` 顯示圖示
3. 用 `width` 控制大小，用 `style="color:..."` 或 Bootstrap class 控制顏色
4. 在 https://phosphoricons.com 可以找到所有圖示名稱
