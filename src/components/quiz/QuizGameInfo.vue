<template>
  <AppModalWindow ref="modal" legend="Info" @close="$emit('close')">
    <div>
      <p>There are no quizzes.</p>
      <p>Please select related tags.</p>
    </div>
  </AppModalWindow>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useWindowManager } from 'store/useWindowManager'

export default defineComponent({
  emits: ['close'],
  setup() {
    const modal = ref(null)

    const { open } = useWindowManager(modal)

    onMounted(() => open())

    return { modal }
  },
})
</script>
