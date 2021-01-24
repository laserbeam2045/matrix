import App from './App.vue'
import { createApp } from 'vue'

import TreeAlphaBody from '@/components/TreeAlphaBody'
import TreeAlphaBranch from '@/components/TreeAlphaBranch'
import TreeBetaBody from '@/components/TreeBetaBody'
import TreeBetaBranch from '@/components/TreeBetaBranch'
import TreeToggleButton from '@/components/TreeToggleButton'
import customDirectives from '@/utilities/customDirectives'

import '@/assets/styles.css'
require('@/assets/scss/app.scss')

const app = createApp(App)

// カスタムディレクティブを設定する
for (let directiveName in customDirectives) {
  const directiveConfig = customDirectives[directiveName]
  app.directive(directiveName, directiveConfig)
}

// 基底コンポーネントをグローバル化する
// MEMO: contextの引数はリテラルである必要がある
const requireComponent = require.context('./components/', true, /App[A-Z]\w+\.(vue|js)$/)
requireComponent.keys().forEach(fileName => {
  let AppComponentConfig = requireComponent(fileName)
  AppComponentConfig = AppComponentConfig.default || AppComponentConfig
  const AppComponentName = AppComponentConfig.name || (
    fileName
      .replace(/^.+\//, '')
      .replace(/\.\w+$/, '')
  )
  app.component(AppComponentName, AppComponentConfig)
})

app
  .component('TreeAlphaBody', TreeAlphaBody)
  .component('TreeAlphaBranch', TreeAlphaBranch)
  .component('TreeBetaBody', TreeBetaBody)
  .component('TreeBetaBranch', TreeBetaBranch)
  .component('TreeToggleButton', TreeToggleButton)
  .mount('#app')