import App from './App.vue'
import { createApp } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { MOUSE_TOUCH_EVENT as EVENT } from '@/store/constants'
import ModalWindow from '@/components/organisms/ModalWindow'
import HeaderItem from '@/components/organisms/HeaderItem'
import HeaderItemBox from '@/components/organisms/HeaderItemBox'
import VirtualWindow from '@/components/organisms/VirtualWindow'
import TreeBodyTypeA from '@/components/organisms/TreeBodyTypeA'
import TreeBodyTypeB from '@/components/organisms/TreeBodyTypeB'
import TreeBranchTypeA from '@/components/organisms/TreeBranchTypeA'
import TreeBranchTypeB from '@/components/organisms/TreeBranchTypeB'

// v-scroll
// MEMO: ウィンドウのスクロールイベント用
const scrollDirective = {
  mounted (el, binding) {
    let f = function(evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener('scroll', f)
      }
    }
    window.addEventListener('scroll', f)
  }
}
// v-focus
// MEMO: mount時に自動的にfocusする
const focusDirective = {
  mounted (el) {
    el.focus()
  }
}
// v-quick-focus
// MEMO: モバイル端末のフォーム要素への素早いfocusを可能にする
const quickFocusDirective = {
  mounted (el, binding) {
    const focus = evt => {
      // TODO: dirty hack
      // evt.stopPropagation()
      if (evt.target === el) el.focus()
      if (binding.value && binding.value(evt, el)) {
        el.removeEventListener(EVENT.START, focus)
        window.removeEventListener(EVENT.END, blur)
      }
    }
    const blur = evt => {
      if (evt.target !== el) el.blur()
    }
    el.addEventListener(EVENT.START, focus)
    window.addEventListener(EVENT.END, blur)
  }
}
// v-resize
const resizeDirective = {
  mounted (el, binding) {
    let f = function(evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener('resize', f)
      }
    }
    window.addEventListener('resize', f)
  }
}

createApp(App)
  .component('fa', FontAwesomeIcon)
  .component('TreeBodyTypeA', TreeBodyTypeA)
  .component('TreeBodyTypeB', TreeBodyTypeB)
  .component('TreeBranchTypeA', TreeBranchTypeA)
  .component('TreeBranchTypeB', TreeBranchTypeB)
  .component('HeaderItem', HeaderItem)
  .component('HeaderItemBox', HeaderItemBox)
  .component('VirtualWindow', VirtualWindow)
  .component('ModalWindow', ModalWindow)
  .directive('focus', focusDirective)
  .directive('resize', resizeDirective)
  .directive('scroll', scrollDirective)
  .directive('quick-focus', quickFocusDirective)
  .mount('#app')