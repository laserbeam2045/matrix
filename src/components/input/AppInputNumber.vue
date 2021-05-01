<template>
  <div class="app-input-number">
    <input
      v-show="false"
      type="number"
      v-bind="settings"
      :value:number="value"
    >
    <span class="number">
      {{ animatedNumberRef }}
    </span>
  </div>
</template>

<script>
import { defineComponent, reactive, computed, watch } from 'vue'
import { TweenLite } from 'gsap'

export default defineComponent({
  props: {
    value: {
      type    : Number,
      required: true,
    },
    // EX: min, max, step
    settings: {
      type: Object,
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
.app-input-number {
  display: inline-block;

  .number {
    display: inline-block;
    text-align: center;
    cursor: text;
  }
}
</style>
