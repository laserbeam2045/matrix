<template>
  <ModalWindow
    ref="modalWindow"
    v-bind="windowState"
    @close="$emit('close')"
  >
    <div>
      <p>There are no quizzes.</p>
      <p>Please select related tags.</p>
    </div>
  </ModalWindow>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'QuizGameInfo',
  emits: [ 'close' ],
  setup() {
    const modalWindow = ref(null)
    const windowState = {
      legend: {
        text: 'Info',
        type: 'inside',
      },
      contentsStyle: {
        padding: '5px 20px 20px',
        textAlign: 'left',
      },
    }

    onMounted(() => modalWindow.value.showModal())

    return {
      modalWindow,
      windowState,
    }
  }
})
</script>