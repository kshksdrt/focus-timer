import { createApp } from 'vue'

import App from './App.vue'
import './registerServiceWorker'
import initialize from './scripts/core/initialize'

initialize()

const app = createApp(App)

app.mount('#app')
