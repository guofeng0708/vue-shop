import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import { App } from 'vue'

export default {
  install (app: App) {
    app.use(ElementPlus, { size: 'small', zIndex: 2000 })
  }
}
