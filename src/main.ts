import { createApp } from 'vue'

// PrimeVue
import './style.css'
import App from './App.vue'

import PrimeVue from 'primevue/config';
import Tailwind from 'primevue/passthrough/tailwind';

import router from './router'   

const app = createApp(App)

app.use(router)
app.use(PrimeVue)
// app.use(PrimeVue, { unstyled: true, pt: Tailwind })
app.mount('#app')

