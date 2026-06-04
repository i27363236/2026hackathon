import { createRouter, createWebHashHistory } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'

import HomeView from '../views/HomeView.vue'

import PointsView from '../views/points/PointsView.vue'
import CheckInView from '../views/points/CheckInView.vue'
import PointsHistoryView from '../views/points/PointsHistoryView.vue'

import CouponsView from '../views/coupons/CouponsView.vue'

import GetPointEventsView from '../views/earn/GetPointEventsView.vue'
import EarnMapView from '../views/earn/EarnMapView.vue'

import ShoppingView from '../views/use/ShoppingView.vue'
import ProductView from '../views/use/ProductView.vue'
// GiftSetupView is the Konva canvas editor — lazy-loaded so Konva stays out of the Home bundle.
import GiftPreviewView from '../views/use/GiftPreviewView.vue'
import GiftReceivedView from '../views/use/GiftReceivedView.vue'
import UseCouponsView from '../views/use/UseCouponsView.vue'
import RedeemMapView from '../views/use/RedeemMapView.vue'
import MallView from '../views/use/MallView.vue'
import ConvertView from '../views/use/ConvertView.vue'
import DonateView from '../views/use/DonateView.vue'
import PurchaseCheckoutView from '../views/use/PurchaseCheckoutView.vue'
import PurchaseSuccessView from '../views/use/PurchaseSuccessView.vue'

import ProfileView from '../views/profile/ProfileView.vue'
import BasicInfoView from '../views/profile/BasicInfoView.vue'
import AchievementsView from '../views/profile/AchievementsView.vue'
import ActivityView from '../views/profile/ActivityView.vue'
import GiftsView from '../views/profile/GiftsView.vue'
import GiftsAvailableView from '../views/profile/GiftsAvailableView.vue'
import GiftsHistoryView from '../views/profile/GiftsHistoryView.vue'
import GiftsSentView from '../views/profile/GiftsSentView.vue'
import SettingsView from '../views/profile/SettingsView.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', name: 'home', component: HomeView, meta: { title: '捷運點', back: true, showSidebar: true, showHomeActions: true, showProfile: true } },

      { path: 'points', name: 'points', component: PointsView },

      { path: 'coupons', name: 'coupons', component: CouponsView },

      { path: 'earn/events', name: 'earn-events', component: GetPointEventsView },
      { path: 'earn/map', name: 'earn-map', component: EarnMapView },

      { path: 'use/shopping', name: 'use-shopping', component: ShoppingView },
      { path: 'use/product', name: 'use-product', component: ProductView },
      { path: 'use/gift/setup', name: 'use-gift-setup', component: () => import('../views/use/GiftSetupView.vue'), meta: { title: '編輯卡片', back: true } },
      { path: 'use/gift/preview', name: 'use-gift-preview', component: GiftPreviewView, meta: { title: '禮物預覽', back: true } },
      { path: 'use/gift/received', name: 'use-gift-received', component: GiftReceivedView, meta: { title: '', back: true } },
      { path: 'use/coupons', name: 'use-coupons', component: UseCouponsView },
      { path: 'use/map', name: 'use-redeem-map', component: RedeemMapView },
      { path: 'use/mall', name: 'use-mall', component: MallView },
      { path: 'use/convert', name: 'use-convert', component: ConvertView },
      { path: 'use/donate', name: 'use-donate', component: DonateView },
      { path: 'use/checkout', name: 'purchase-checkout', component: PurchaseCheckoutView },
      { path: 'use/purchase-success', name: 'purchase-success', component: PurchaseSuccessView },

      { path: 'profile', name: 'profile', component: ProfileView },
      { path: 'profile/info', name: 'profile-info', component: BasicInfoView },
      { path: 'profile/achievements', name: 'profile-achievements', component: AchievementsView },
      { path: 'profile/activity', name: 'profile-activity', component: ActivityView },
      { path: 'profile/gifts', name: 'profile-gifts', component: GiftsView },
      { path: 'profile/gifts/available', name: 'profile-gifts-available', component: GiftsAvailableView },
      { path: 'profile/gifts/history', name: 'profile-gifts-history', component: GiftsHistoryView },
      { path: 'profile/gifts/sent', name: 'profile-gifts-sent', component: GiftsSentView },
      { path: 'profile/settings', name: 'profile-settings', component: SettingsView },
    ],
  },
]

export default createRouter({ history: createWebHashHistory(), routes })
