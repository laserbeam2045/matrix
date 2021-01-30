import { createApp } from 'vue'
import customDirectives from '@/customDirectives'
import TreeAlphaBody from '@/components/TreeAlphaBody'
import TreeBetaBody from '@/components/TreeBetaBody'
import App from '@/pages/App.vue'

// 具体的なCSSを出力する設定を適用する
import '@/assets/sass/app.scss'
// TailWindCSSを読み込む
import '@/assets/styles.css'

const vm = createApp(App)

// カスタムディレクティブを設定する
for (const directiveName in customDirectives) {
  vm.directive(directiveName, customDirectives[directiveName])
}

// 基底(ファイル名にAppを含む)コンポーネントをグローバル化する
const requireComponents = require.context('./components/', true, /App[A-Z]\w+\.(vue|js)$/)
requireComponents.keys().forEach(fileName => {
  let AppConfig = requireComponents(fileName)
  AppConfig = AppConfig.default || AppConfig
  const AppName = AppConfig.name || fileName.replace(/^.+\//, '').replace(/\.\w+$/, '')
  vm.component(AppName, AppConfig)
})

vm.component('TreeAlphaBody', TreeAlphaBody)
  .component('TreeBetaBody', TreeBetaBody)
  .mount('#app')