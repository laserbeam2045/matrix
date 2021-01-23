<template>
  <FontAwesomeIcon :icon="[set, name]" />
</template>

<script>
import { defineComponent, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

import { faFan, faDoorOpen, faLongArrowAltUp, faLongArrowAltDown, faLongArrowAltLeft, faLongArrowAltRight, faMicrophone, faMicrophoneAlt, faMicrophoneAltSlash, faMicrophoneSlash, faSpellCheck, faEquals, faNotEqual, faBalanceScale, faColumns, faCompressAlt, faExpandAlt, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'
import { faQuora, faGoogle, faAndroid } from '@fortawesome/free-brands-svg-icons'
import { faLightbulb } from '@fortawesome/free-regular-svg-icons'

library.add(
  faFan,
  faDoorOpen,
  faLongArrowAltUp,
  faLongArrowAltDown,
  faLongArrowAltLeft,
  faLongArrowAltRight,
  faMicrophone,
  faMicrophoneAlt,
  faMicrophoneAltSlash,
  faMicrophoneSlash,
  faSpellCheck,
  faEquals,
  faNotEqual,
  faBalanceScale,
  faColumns,
  faCompressAlt,
  faExpandAlt,
  faTimes,
  faPlus,
  faQuora,
  faGoogle,
  faAndroid,
  faLightbulb,
)

export default defineComponent({
  components: { FontAwesomeIcon },
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const set = computed(() => {
      switch (props.name) {
        case 'fan':
        case 'door-open':
        case 'long-arrow-alt-up':
        case 'long-arrow-alt-down':
        case 'long-arrow-alt-left':
        case 'long-arrow-alt-right':
        case 'microphone':
        case 'microphone-slash':
        case 'spell-check':
        case 'equals':
        case 'not-equal':
        case 'balance-scale':
        case 'compress-alt':
        case 'expand-alt':
        case 'times':
        case 'plus':
          return 'fas'
        case 'quora':
        case 'google':
        case 'android':
          return 'fab'
        case 'lightbulb':
          return 'far'
      }
    })

    return { set }
  }
})
</script>
