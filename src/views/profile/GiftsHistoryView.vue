<script setup>
import { useRoute } from 'vue-router'
import { useGiftStore } from '@/data/gifts' // 1. 已修正為正確的兩層路徑
import { storeToRefs } from 'pinia'
import ContentCard from '@/components/cards/ContentCard.vue'
import StampBadge from '@/components/common/StampBadge.vue'

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

// 轉址進來時可用 ?tab=available|history 指定分頁(profile/gifts/* 舊路徑轉址用)
const route = useRoute()
if (route.query.tab === 'available' || route.query.tab === 'history') {
  currentTab.value = route.query.tab
}

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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="back-icon"><polyline points="15 18 9 12 15 6"></polyline></svg>
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
            <ContentCard
              v-for="gift in availableNearGifts"
              :key="gift.id"
              variant="row-horizontal"
              :img="gift.img"
              :title="gift.title"
              :detail="`使用期限 ${gift.expiry}`"
            />
          </div>

          <div class="gift-column">
            <h2 class="column-title">其他優惠券</h2>
            <ContentCard
              v-for="gift in availableOtherGifts"
              :key="gift.id"
              variant="row-horizontal"
              :img="gift.img"
              :title="gift.title"
              :detail="`使用期限 ${gift.expiry}`"
            />
          </div>
        </template>

        <template v-else>
          <div class="gift-column">
            <h2 class="column-title">所有優惠券</h2>
            <ContentCard
              v-for="gift in historyCoupons"
              :key="gift.id"
              variant="row-horizontal"
              class="opacity-75"
              :img="gift.img"
              :title="gift.title"
              :detail="gift.expiry"
            >
              <template #trailing>
                <StampBadge v-if="getStampText(gift.status)" :text="getStampText(gift.status)" />
              </template>
            </ContentCard>
          </div>

          <div class="gift-column">
            <h2 class="column-title">送出的禮物</h2>
            <ContentCard
              v-for="gift in historySentGifts"
              :key="gift.id"
              variant="row-horizontal"
              class="opacity-75"
              :img="gift.img"
              :title="gift.title"
              :detail="gift.expiry"
            >
              <template #trailing>
                <StampBadge v-if="getStampText(gift.status)" :text="getStampText(gift.status)" />
              </template>
            </ContentCard>
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
  color: var(--bs-body-color);
}

.back-icon {
  width: 24px;
  height: 24px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--bs-body-color);
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
  background-color: var(--bs-gray-200);
  border-radius: var(--bs-border-radius-lg);
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
  color: var(--bs-secondary-color);
  cursor: pointer;
  border-radius: var(--bs-border-radius);
  transition: all 0.2s ease;
}

.tab-item.active {
  background-color: var(--bs-white);
  color: var(--bs-body-color);
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
  color: var(--bs-body-color);
  margin: 0;
  margin-bottom: 4px;
  padding-left: 4px;
}
</style>
