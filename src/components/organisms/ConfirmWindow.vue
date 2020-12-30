<template>
  <ModalWindow
    ref="root"
    :level="1"
    :window-state="windowState"
  >
    <div class="confirm-window">
      <p>{{ text }}</p>
      <ButtonBasicAtom @click="onClickPositive">
        {{ positiveLabel }}
      </ButtonBasicAtom>
      <ButtonBasicAtom @click="onClickNegative">
        {{ negativeLabel }}
      </ButtonBasicAtom>
    </div>
  </ModalWindow>
</template>

<script>
import { defineComponent, ref } from 'vue'
import ButtonBasicAtom from '@/components/atoms/ButtonBasicAtom'

export default defineComponent ({
  name: 'ConfirmWindow',
  components: {
    ButtonBasicAtom,
  },
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
    draggable: {
      type: Boolean,
      required: false,
      default: true,
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
      draggable: props.draggable,
      legend: props.legend,
    }

    const showModal   = () => root.value.showModal()
    const hideModal   = () => root.value.hideModal()
    const toggleModal = () => root.value.toggleModal()
    const onClickPositive = () => emit('positive')
    const onClickNegative = () => emit('negative')

    return {
      root,
      windowState,
      showModal,
      hideModal,
      toggleModal,
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