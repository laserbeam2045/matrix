<template>
  <div>
    <input
      type="number"
      v-show="false"
      v-bind="settings"
      :value:number="value"
    />
    <span>{{ animatedNumberRef }}</span>
  </div>
</template>

<script>
import { defineComponent, reactive, computed, watch } from 'vue'
import { TweenLite } from 'gsap'

export default defineComponent({
  name: 'BaseInputNumber',
  props: {
    value: {
      type: Number,
      required: true,
    },
    // EX: min, max, step
    settings: {
      type: Object,
      required: false,
      default() {
        return {
          step: 1,
        }
      },
    },
  },
  setup(props) {
    const state = reactive({
      value: props.value,
    })

    const animatedNumberRef = computed(() => {
      return state.value.toFixed(0)
    })

    watch(() => props.value, (newValue) => {
      TweenLite.to(state, 0.33, { value: newValue })
    })

    return {
      animatedNumberRef,
    }
  },
})
</script>

<style lang="scss" scoped>
div {
  display: inline-block;
  
  span {
    display: inline-block;
    text-align: center;
    cursor: text;
  }
}
</style>