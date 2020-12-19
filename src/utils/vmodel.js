// import { watch, customRef } from 'vue'
import { computed } from 'vue'

// propsの特定の値をリアクティブにする
// export default function useVModelRef(props, context, name) {
//   let value = props[name]

//   watch(() => props[name],
//     newVal => value = newVal
//   )
//   watch
//   return customRef((track, trigger) => {
//     return {
//       get() {
//         track()
//         return value
//       },
//       set(newValue) {
//         value = newValue
//         context.emit(`update:${name}`, newValue)
//         trigger()
//       },
//     }
//   })
// }

// propsの特定の値をリアクティブにする(改良版)
export default function useVModelRef(props, context, name) {
  return computed({
    get: () => props[name],
    set: val => context.emit(`update:${name}`, val),
  })
}