import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {createPersistedState} from 'pinia-persistedstate-plugin'
import 'event-source-polyfill/src/eventsource.min.js'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/dist/locale/zh-cn.js'
// import './styles/element-variables.scss'; // 引入自定义样式

const app = createApp(App)
const persist=createPersistedState()
const pinia=createPinia()
pinia.use(persist)
app.use(ElementPlus,{locale})
app.use(pinia)
app.use(router)
router.isReady().then(()=>{
    app.mount('#app')
})



