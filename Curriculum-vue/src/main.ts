import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { LocalDB } from '@/components/classes/LocalDB'

const app = createApp(App)
export const urlRoot = 'http://localhost:8080'
export const localDB = new LocalDB()

app.use(router)
app.use(ElementPlus)

app.mount('#app')
