import App from './App.vue'
import { createApp } from 'vue'

import QuizTag from '@/components/QuizTag'
import Progressbar from '@/components/Progressbar'
import ContentWrapper from '@/components/ContentWrapper'
import TreeToggleButton from '@/components/TreeToggleButton'
import TreeAlphaBody from '@/components/TreeAlphaBody'
import TreeAlphaBranch from '@/components/TreeAlphaBranch'
import TreeBetaBody from '@/components/TreeBetaBody'
import TreeBetaBranch from '@/components/TreeBetaBranch'
import HeaderItem from '@/components/HeaderItem'
import HeaderItemBox from '@/components/HeaderItemBox'
import VirtualWindow from '@/components/VirtualWindow'
import customDirectives from '@/utilities/customDirectives'

import '@/assets/styles.css'
require("@/assets/scss/app.scss")

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
  .component('QuizTag', QuizTag)
  .component('Progressbar', Progressbar)
  .component('ContentWrapper', ContentWrapper)
  .component('TreeToggleButton', TreeToggleButton)
  .component('TreeAlphaBody', TreeAlphaBody)
  .component('TreeAlphaBranch', TreeAlphaBranch)
  .component('TreeBetaBody', TreeBetaBody)
  .component('TreeBetaBranch', TreeBetaBranch)
  .component('HeaderItem', HeaderItem)
  .component('HeaderItemBox', HeaderItemBox)
  .component('VirtualWindow', VirtualWindow)
  .mount('#app')