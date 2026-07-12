<script setup>
// 單純靜態畫面，不寫任何資料庫邏輯
import MedalSection from '@/components/profile/MedalSection.vue'
import { getAchievements, getSentGifts } from '@/data/profile.js'
import { useSettingsStore } from '@/stores/settings.js'

const achievements = getAchievements()
const sentGifts = getSentGifts()
const settings = useSettingsStore()
</script>

<template>
  <div class="tablet-bg">
    <div class="main-content-container">

      <div class="left-column">
        
        <div class="card profile-card">
          <div class="profile-avatar-block">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" alt="小捷的頭像" class="profile-avatar" />
            <div class="profile-name">小捷</div>
          </div>
          
          <div class="profile-stats-block">
            <div class="stat-item">
              <div class="label">里程數</div>
              <div class="value">968 <span class="unit">km</span></div>
            </div>
            <div class="stat-item">
              <div class="label">減碳數 🌱</div>
              <div class="value">17.6 <span class="unit">kg</span></div>
            </div>
            <div class="stat-item">
              <div class="label">最愛車站</div>
              <div class="station-info">
                <div class="station-badges">
                  <span class="tag tag-r">R 11</span>
                  <span class="tag tag-g">G 14</span>
                </div>
                <div class="station-name">中山</div>
              </div>
            </div>
          </div>
        </div>

        <MedalSection title="我的成就" :items="achievements" />

        <div class="section-title-bar">
          <h2>最近參加的活動</h2>
          <div class="circle-arrow-btn">
            <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23868e96' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='9 18 15 12 9 6'></polyline></svg>" alt="更多" class="arrow-icon" />
          </div>
        </div>

        <div class="card activity-card">
          <div class="activity-text-left">
            <p class="sub-title">獲得10點捷運點</p>
            <h3>聲聲流動 捷運心動</h3>
            <p class="date">2026-04-24 參加</p>
          </div>
          <img src="../../img/mynaui_music-square.png" alt="琴聲流動紀念章" class="stamp-img-right" />
        </div>
      </div>

      <div class="right-column">
        <MedalSection title="我的禮物" :items="sentGifts" />

        <div class="section-title-bar setting-margin">
          <h2>設定</h2>
        </div>

        <div class="button-group">
          <button class="action-button">修改支付密碼</button>
          <button class="action-button">設定綁定帳號</button>
          <div class="action-button setting-switch-row">
            <span>情境推薦</span>
            <div class="form-check form-switch p-0 m-0">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                v-model="settings.contextualRecs"
                style="width: 2.5em; height: 1.25em; cursor: pointer"
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* 平板背景 */
.tablet-bg {
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
}

/* 佈局總容器：窄螢幕單欄堆疊，寬螢幕可換行並排 */
.main-content-container {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: flex-start;
  width: 100%;
}

/* 左側欄位 */
.left-column {
  flex: 1 1 320px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 右側欄位 */
.right-column {
  flex: 1 1 280px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 標題與帶圓底箭頭列 */
.section-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  margin-bottom: 6px;
}

.section-title-bar h2 {
  font-size: 20px;
  font-weight: 700;
  color: #111111;
  margin: 0;
}

/* 🌟 修正後的圓底座：完美置中包覆開源箭頭 */
.circle-arrow-btn {
  width: 32px;
  height: 32px;
  background-color: #f1f3f5; 
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.15s;
}

.circle-arrow-btn:hover {
  background-color: #e9ecef;
}

/* 🌟 開源內聯 SVG 箭頭圖標樣式 */
.arrow-icon {
  width: 16px;
  height: 16px;
  display: block;
}

.setting-margin {
  margin-top: 24px;
}

/* 🌟 統一卡片底座：換上與設計圖一致的高質感輕柔陰影 (Shadow) */
.card {
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); /* 輕柔且深邃的摩登陰影 */
  box-sizing: border-box;
  border: none;
}

/* ================= 🌟 1. 個人資料卡片 (整體內容置中修正) ================= */
.profile-card {
  display: flex;
  flex-direction: row;          
  justify-content: center;     /* 關鍵：讓大頭貼和數據區整體在卡片中居中 */
  align-items: center;           
  padding: 32px 40px;            
  min-height: 180px;
}

.profile-avatar-block {
  display: flex;
  flex-direction: column;        
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  width: 110px;                  
}

.profile-avatar {
  width: 85px;
  height: 85px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-name {
  font-size: 22px;
  font-weight: 700;
  color: #000000;
}

/* 數據欄位包覆區 */
.profile-stats-block {
  display: flex;
  flex-direction: column;  
  gap: 12px;              
  align-items: flex-start;
  margin-left: 24px;
  padding-left: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;     
  align-items: right;
}

.stat-item .label {
  font-size: 12px;
}

.stat-item .value {
  font-size: 18px;
  font-weight: 700;
  color: #111111;
}

.stat-item .unit {
  font-size: 13px;
  color: #495057;
  font-weight: 500;
  margin-left: 4px;
}

/* 車站專用左右排布 */
.station-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.station-badges {
  display: flex;
  gap: 4px;
}

.tag {
  color: #ffffff;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 10px;
}

.tag-r { background-color: #e64980; } 
.tag-g { background-color: #12b886; } 

.station-name {
  font-size: 18px;
  font-weight: 700;
  color: #000000;
}

/* ================= 2. 活動成就卡片 ================= */
.activity-card {
  display: flex;
  flex-direction: row;          
  justify-content: space-between;
  align-items: center;          
  padding: 24px;
  min-height: 115px;
}

.activity-text-left {
  flex: 1;
  display: flex;
  flex-direction: column;       
  gap: 4px;
}

.activity-text-left .sub-title {
  font-size: 12px;
  margin: 0;
}


.activity-text-left h3 {
  font-size: 16px;
  font-weight: 700;
  color: #111111;
  margin: 2px 0;
}

.activity-text-left .date {
  font-size: 12px;
  margin: 0;
}

.stamp-img-right {
  width: 72px;
  object-fit: cover;
  flex-shrink: 0;
  margin-left: 12px;
}

/* 右側按鈕組 */
.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 🌟 按鈕同步換上高規格陰影與圓角 */
.action-button {
  background-color: #ffffff;
  border: none;
  border-radius: 16px;
  padding: 16px 20px;
  font-size: 15px;
  font-weight: 700;
  color: #111111;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04); /* 與卡片一致的陰影 */
  transition: all 0.15s;
  width: 100%;
}

.action-button:hover {
  background-color: #f1f3f5;
}

.setting-switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: default;
}
</style>