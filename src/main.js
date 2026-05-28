import { createApp } from 'vue'
import './assets/styles/main.scss'
import 'bootstrap'
import App from './App.vue'
import router from './router/index.js'

createApp(App).use(router).mount('#app')
