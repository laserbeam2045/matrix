import TreeAlphaBody from '@/components/tree/TreeAlphaBody.vue'
import TreeBetaBody from '@/components/tree/TreeBetaBody.vue'

/**
 * 基底(ファイル名にAppを含む)コンポーネントをグローバル化する
 * @param vm Vueインスタンス
 */
export default function registerGlobalComponents(vm: { component: Function }) {
  const requireComponents = require.context('@/components/', true, /App[A-Z]\w+\.(vue|js)$/)

  requireComponents.keys().forEach(fileName => {
    let AppConfig = requireComponents(fileName)
    AppConfig = AppConfig.default || AppConfig
    const AppName = AppConfig.name || (
      fileName
        .replace(/^.+\//, '')
        .replace(/\.\w+$/, '')
    )
    vm.component(AppName, AppConfig)
  })

  vm.component('TreeAlphaBody', TreeAlphaBody)
    .component('TreeBetaBody', TreeBetaBody)
}
