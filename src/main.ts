import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import initialize from './scripts/core/initialize'

initialize()

createApp(App).mount('#app')
