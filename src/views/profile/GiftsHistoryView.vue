<script setup>
import { useGiftStore } from '@/data/gifts' // 1. 已修正為正確的兩層路徑
import { storeToRefs } from 'pinia'

// 2. 初始化你的禮物資料庫
const giftStore = useGiftStore()

// 3. 直接從 Pinia 資料庫把你寫好的計算屬性撈出來用，不用在這邊重新 filter 囉！
const { 
  currentTab, 
  availableNearGifts, 
  availableOtherGifts, 
  historyCoupons, 
  historySentGifts 
} = storeToRefs(giftStore)

// 4. 根據蓋章狀態輸出對應的中文文字
const getStampText = (status) => {
  if (status === 'used') return '已使用'
  if (status === 'expired') return '已過期'
  if (status === 'sent') return '已送出'
  return ''
}
</script>

<template>
  <div class="tablet-bg">
    <div class="gift-page-container">
      
      <div class="page-header">
        <div class="back-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="back-icon"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </div>
        <h1 class="page-title">我的禮物</h1>
        <div class="header-placeholder"></div>
      </div>

      <div class="tab-wrapper">
        <div class="tab-toggle-bg">
          <div 
            @click="currentTab = 'available'" 
            :class="['tab-item', currentTab === 'available' ? 'active' : '']"
          >
            可使用
          </div>
          <div 
            @click="currentTab = 'history'" 
            :class="['tab-item', currentTab === 'history' ? 'active' : '']"
          >
            歷史紀錄
          </div>
        </div>
      </div>

      <div class="gift-content-grid">
        
        <template v-if="currentTab === 'available'">
          <div class="gift-column">
            <h2 class="column-title">附近</h2>
            
            <div class="card coupon-card" v-for="gift in availableNearGifts" :key="gift.id">
              <div class="coupon-img-wrapper">
                <img :src="gift.img" :alt="gift.title" class="coupon-img" />
              </div>
              <div class="coupon-info">
                <h3 class="coupon-title">{{ gift.title }}</h3>
                <p class="coupon-expiry">使用期限 {{ gift.expiry }}</p>
              </div>
            </div>
          </div>

          <div class="gift-column">
            <h2 class="column-title">其他優惠券</h2>
            
            <div class="card coupon-card" v-for="gift in availableOtherGifts" :key="gift.id">
              <div class="coupon-img-wrapper">
                <img :src="gift.img" :alt="gift.title" class="coupon-img" />
              </div>
              <div class="coupon-info">
                <h3 class="coupon-title">{{ gift.title }}</h3>
                <p class="coupon-expiry">使用期限 {{ gift.expiry }}</p>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="gift-column">
            <h2 class="column-title">所有優惠券</h2>
            
            <div class="card coupon-card history-mode" v-for="gift in historyCoupons" :key="gift.id">
              <div class="coupon-img-wrapper">
                <img :src="gift.img" :alt="gift.title" class="coupon-img" />
              </div>
              <div class="coupon-info">
                <h3 class="coupon-title">{{ gift.title }}</h3>
                <p class="coupon-expiry">{{ gift.expiry }}</p>
              </div>
              <div class="stamp-badge">{{ getStampText(gift.status) }}</div>
            </div>
          </div>

          <div class="gift-column">
            <h2 class="column-title">送出的禮物</h2>
            
            <div class="card coupon-card history-mode" v-for="gift in historySentGifts" :key="gift.id">
              <div class="coupon-img-wrapper">
                <img :src="gift.img" :alt="gift.title" class="coupon-img" />
              </div>
              <div class="coupon-info">
                <h3 class="coupon-title">{{ gift.title }}</h3>
                <p class="coupon-expiry">{{ gift.expiry }}</p>
              </div>
              <div class="stamp-badge">{{ getStampText(gift.status) }}</div>
            </div>
          </div>
        </template>

      </div>

    </div>
  </div>
</template>

<style scoped>
.tablet-bg {
  width: 100%;
  max-width: 1193px; 
  padding: 40px 24px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

.gift-page-container {
  width: 100%;
  max-width: 890px;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 4px;
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
}

.back-icon {
  width: 24px;
  height: 24px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #111111;
  margin: 0;
  text-align: center;
}

.header-placeholder {
  width: 40px;
}

.tab-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.tab-toggle-bg {
  width: 100%;
  max-width: 600px;
  height: 46px;
  background-color: #e9ecef;
  border-radius: 12px;
  display: flex;
  padding: 4px;
  box-sizing: border-box;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  color: #868e96;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.tab-item.active {
  background-color: #ffffff;
  color: #111111;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.gift-content-grid {
  display: flex;
  gap: 32px;
}

.gift-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.column-title {
  font-size: 18px;
  font-weight: 700;
  color: #111111;
  margin: 0;
  margin-bottom: 4px;
  padding-left: 4px;
}

.card {
  background-color: #ffffff;
  border-radius: 16px;
  border: none !important; 
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.025); 
  box-sizing: border-box;
}

.coupon-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px;
  gap: 16px;
  min-height: 96px;
  position: relative; /* 為了讓右下角的蓋章能絕對定位 */
}

.coupon-img-wrapper {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f1f3f5;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.coupon-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.coupon-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.coupon-info .coupon-title {
  font-size: 16px;
  font-weight: 700;
  color: #111111;
  margin: 0;
}

.coupon-info .coupon-expiry {
  font-size: 12px;
  color: #868e96;
  margin: 0;
}

/* ================= 3. 新增的動態樣式（歷史紀錄蓋章效果） ================= */
/* 讓歷史紀錄的卡片帶點半透明褪色感 */
.coupon-card.history-mode {
  opacity: 0.75;
}

/* 紅色戳印鋼印效果 */
.stamp-badge {
  position: absolute;
  right: 16px;
  bottom: 12px;
  border: 1.5px solid #dc3545;
  color: #dc3545;
  font-size: 11px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  transform: rotate(-12deg); /* 完美還原蓋章微歪斜的斜角 */
  background-color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.5px;
}
</style>
