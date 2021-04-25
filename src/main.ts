import { createApp } from 'vue'
import App from '@/App.vue'

// import { router } from './router'

import registerCustomDirectives from '@/plugins/custom-directives'
import registerGlobalComponents from '@/plugins/global-components'

// 具体的なCSSを出力する設定を適用する
import '@/assets/sass/app.scss'
// TailWindCSSを読み込む
import '@/assets/styles.css'

const vm = createApp(App)

// vm.use(router)
registerCustomDirectives(vm)
registerGlobalComponents(vm)

vm.mount('#app')