<template>
  <div
    class="header-item"
    @click="$emit('click')"
  >
    <fa
      :icon="[set, type]"
      :class="{ active }"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLightbulb } from '@fortawesome/fontawesome-free-regular' 
import { faGoogle, faQuora } from '@fortawesome/fontawesome-free-brands' 
import { faMicrophone, faMicrophoneAlt, faMicrophoneAltSlash, faMicrophoneSlash, faSpellCheck, faEquals, faNotEqual, faBalanceScale, faColumns, faCompressAlt, faExpandAlt, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons' 

library.add(
  faMicrophone, faMicrophoneAltSlash, faMicrophoneAlt, faMicrophoneSlash,
  faLightbulb, faSpellCheck, faEquals, faNotEqual, faBalanceScale,
  faColumns, faCompressAlt, faExpandAlt, faTimes, faPlus, faGoogle, faQuora,
)

export default defineComponent({
  name: 'HeaderItem',
  props: {
    type: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: [
    'click',
  ],
  setup(props) {
    const set = (() => {
      switch (props.type) {
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
        case 'google':
        case 'quora':
          return 'fab'
      }
    })()

    return { set }
  },
})
</script>

<style lang="scss" scoped>
div {
  display: inline-block;
  width: $windowHeaderItemSize;
  height: $windowHeaderItemSize;
  font-size: $windowHeaderItemSize * 0.6;
  line-height: $windowHeaderItemSize;
  font-weight: normal;
  text-align: center;
  pointer-events: auto;
  @if $test { background: yellow; }

  &.active {
    transition: all .2s;
    color: green;
  }
  &:hover,
  &:focus {
    color: orange;
    cursor: pointer;
    text-decoration: none;
  }
}
</style>