import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/styles/main.scss'
import 'bootstrap'
import App from './App.vue'
import router from './router/index.js'

// vue-konva is NOT registered globally on purpose — its components are imported locally in the
// lazy-loaded editor (GiftSetupView) so Konva stays out of the Home/initial bundle.
createApp(App).use(createPinia()).use(router).mount('#app')
