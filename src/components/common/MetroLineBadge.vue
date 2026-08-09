<script setup>
// 捷運路線識別色塊(R/G/Y/BL/BR)。底色來自 _metro-lines.scss 產生的全域 .metro-line--{code}
// class — scoped 樣式讀不到 SCSS 變數,所以顏色只能走全域 class,這裡只負責尺寸與字級。
defineProps({
  code: { type: String, required: true }, // 'R' | 'G' | 'Y' | 'BL' | 'BR'
})
</script>

<template>
  <span
    class="metro-line-badge rounded-1 text-white fw-bold d-inline-flex align-items-center justify-content-center flex-shrink-0"
    :class="`metro-line--${code}`"
  >
    {{ code }}
  </span>
</template>

<style scoped>
.metro-line-badge {
  min-width: 18px;
  height: 18px;
  padding-inline: 3px;
  font-size: 11px;
  line-height: 1;
}
</style>
