import { createRouter, createWebHashHistory } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'

import HomeView from '../views/HomeView.vue'

import PointsView from '../views/points/PointsView.vue'

import CouponsView from '../views/coupons/CouponsView.vue'
import CouponTradeCenter from '../views/coupons/CouponTradeCenter.vue'

import GetPointEventsView from '../views/points/GetPointEventsView.vue'
import InDevelopmentView from '../views/InDevelopmentView.vue'

import ProductView from '../views/use/ProductView.vue'
// GiftSetupView is the Konva canvas editor — lazy-loaded so Konva stays out of the Home bundle.
import GiftPreviewView from '../views/use/GiftPreviewView.vue'
import GiftReceivedView from '../views/use/GiftReceivedView.vue'
import UseCouponsView from '../views/use/UseCouponsView.vue'
import PurchaseCheckoutView from '../views/use/PurchaseCheckoutView.vue'
import PurchaseSuccessView from '../views/use/PurchaseSuccessView.vue'

import ProfileView from '../views/profile/ProfileView.vue'
import GiftsView from '../views/profile/GiftsView.vue'
import GiftsAvailableView from '../views/profile/GiftsAvailableView.vue'
import GiftsHistoryView from '../views/profile/GiftsHistoryView.vue'
import GiftsSentView from '../views/profile/GiftsSentView.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', name: 'home', component: HomeView, meta: { showSidebar: true, showHomeActions: true, showProfile: true, heroTop: true } },

      { path: 'points', name: 'points', component: PointsView, meta: { title: '我的點數', back: true } },

      { path: 'coupons', name: 'coupons', component: CouponsView, meta: { title: '優惠券', back: true } },
      { path: 'coupons/trade', name: 'coupon-trade', component: CouponTradeCenter, meta: { title: '優惠券媒合中心', back: true } },

      { path: 'points/events', name: 'earn-events', component: GetPointEventsView, meta: { title: '獲點活動', back: true } },

      { path: 'in-development', name: 'in-development', component: InDevelopmentView, meta: { title: '開發中', back: true } },

      { path: 'use/product', name: 'use-product', component: ProductView, meta: { title: '商品詳情', back: true } },
      { path: 'use/gift/setup', name: 'use-gift-setup', component: () => import('../views/use/GiftSetupView.vue'), meta: { title: '編輯卡片', hideTitle: true, back: true } },
      { path: 'use/gift/preview', name: 'use-gift-preview', component: GiftPreviewView, meta: { title: '禮物預覽', back: true } },
      { path: 'use/gift/received', name: 'use-gift-received', component: GiftReceivedView, meta: { title: '收到禮物', back: true } },
      { path: 'use/coupons', name: 'use-coupons', component: UseCouponsView, meta: { title: '使用優惠券', back: true } },
      { path: 'use/checkout', name: 'purchase-checkout', component: PurchaseCheckoutView, meta: { title: '確認購買', back: true } },
      { path: 'use/purchase-success', name: 'purchase-success', component: PurchaseSuccessView, meta: { title: '購買成功' } },

      { path: 'profile', name: 'profile', component: ProfileView, meta: { title: '個人檔案', back: true } },
      { path: 'profile/gifts', name: 'profile-gifts', component: GiftsView, meta: { title: '我的禮物', back: true } },
      { path: 'profile/gifts/available', name: 'profile-gifts-available', component: GiftsAvailableView, meta: { title: '可用禮物', back: true } },
      { path: 'profile/gifts/history', name: 'profile-gifts-history', component: GiftsHistoryView, meta: { title: '禮物紀錄', back: true } },
      { path: 'profile/gifts/sent', name: 'profile-gifts-sent', component: GiftsSentView, meta: { title: '已送禮物', back: true } },
    ],
  },
]

const SITE_NAME = '捷點大集合'

const router = createRouter({ history: createWebHashHistory(), routes })

router.afterEach((to) => {
  const pageTitle = to.meta?.title
  document.title = pageTitle ? `${pageTitle}｜${SITE_NAME}` : SITE_NAME
})

export default router
