// import { watch, customRef } from 'vue'
import { computed, useContext } from 'vue'

// propsの特定の値をリアクティブにする(改良版)
export default function useModelValue(props, name) {
  const { emit } = useContext()

  return computed({
    get: () => props[name],
    set: value => emit(`update:${name}`, value),
  })
}

// propsの特定の値をリアクティブにする(古い方法)
// export default function useModelValue(props, context, name) {
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
