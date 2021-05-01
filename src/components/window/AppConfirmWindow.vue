<template>
  <AppModalWindow ref="modal" :level="1" :legend="legend">
    <div class="confirm-window">
      <p>{{ message }}</p>
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
import useWindowManager from '@/store/windowManager'

export default defineComponent({
  props: {
    message: {
      type   : String,
      default: 'Are you sure?',
    },
    positiveLabel: {
      type   : String,
      default: 'OK',
    },
    negativeLabel: {
      type   : String,
      default: 'Cancel',
    },
    legend: {
      type   : [String, Object],
      default: '',
    },
  },
  emits: [
    'positive',
    'negative',
  ],
  setup(props, { emit }) {
    const modal = ref(null)

    const { open, close, toggle } = useWindowManager(modal)

    const onClickPositive = () => emit('positive')
    const onClickNegative = () => emit('negative')

    return {
      modal,
      open,
      close,
      toggle,
      onClickPositive,
      onClickNegative,
    }
  },
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
