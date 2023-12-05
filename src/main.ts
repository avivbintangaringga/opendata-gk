import { createApp } from 'vue'

// PrimeVue
import './style.css'
import App from './App.vue'

import PrimeVue from 'primevue/config';

import router from './router'   

const app = createApp(App)

app.use(router)
app.use(PrimeVue)
app.mount('#app')

