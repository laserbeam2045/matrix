<template>
  <AppModalWindow
    ref="root"
    :level="1"
    :windowState="windowState"
  >
    <div class="confirm-window">
      <p>{{ text }}</p>
      <AppButton @click="onClickPositive">
        {{ positiveLabel }}
      </AppButton>
      <AppButton @click="onClickNegative">
        {{ negativeLabel }}
      </AppButton>
    </div>
  </AppModalWindow>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent ({
  props: {
    text: {
      type: String,
      required: false,
      default: 'Are you sure ?',
    },
    positiveLabel: {
      type: String,
      required: false,
      default: 'OK',
    },
    negativeLabel: {
      type: String,
      required: false,
      default: 'Cancel',
    },
    legend: {
      type: Object,
      required: false,
      default() {
        return {
          text: '',
          type: 'inside',
        }
      },
    },
  },
  emits: [
    'positive',
    'negative',
  ],
  setup(props, { emit }) {
    const root = ref(null)

    const windowState = {
      legend: props.legend,
    }

    const open   = () => root.value.open()
    const close  = () => root.value.close()
    const toggle = () => root.value.toggle()
    const onClickPositive = () => emit('positive')
    const onClickNegative = () => emit('negative')

    return {
      root,
      windowState,
      open,
      close,
      toggle,
      onClickPositive,
      onClickNegative,
    }
  }
})
</script>

<style lang="scss" scoped>
.confirm-window {
  padding: 0 15px 15px;

  button {
    margin: 15px 10px 0;
  }
}
</style>