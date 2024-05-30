import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'

const app = createApp(App)

app.use(router)
app.use(ElementPlus)

app.mount('#app')

const instance = axios.create()
instance.interceptors.response.use(
  (response) => {
    console.log(response)
    if (response.data.code === '403') {
      sessionStorage.clear()
      return response
    }
    return response
  },
  (error) => {
    console.log(error)
    if (error.data.code === '403') {
      sessionStorage.clear()
    }
    return Promise.reject(error)
  }
)
