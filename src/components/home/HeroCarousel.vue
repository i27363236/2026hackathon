<script setup>
// 首頁 Hero 橫幅輪播 — 使用 Bootstrap carousel(全域已載入 bootstrap JS)。
defineProps({
  banners: { type: Array, required: true }, // 圖片 src 陣列
})
</script>

<template>
  <section class="position-relative">
    <div id="heroCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
      <div class="carousel-inner">
        <div v-for="(src, i) in banners" :key="i" class="carousel-item" :class="{ active: i === 0 }">
          <div class="banner-frame">
            <img :src="src" class="banner-main d-block w-100" alt="" />
          </div>
        </div>
      </div>
      <div class="carousel-indicators">
        <button
          v-for="(_, i) in banners"
          :key="i"
          type="button"
          data-bs-target="#heroCarousel"
          :data-bs-slide-to="i"
          :class="{ active: i === 0 }"
        />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.banner-frame {
  position: relative;
}
</style>
