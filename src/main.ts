import { createApp } from 'vue'
import App from './App.vue'
import initialize from '@/core/initialize'

import '@/pwa/registerServiceWorker'

initialize()

const app = createApp(App)

app.mount('#app')
