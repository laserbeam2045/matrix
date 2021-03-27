<template>
  <AppVirtualWindow
    v-bind="windowState"
    v-on="windowEvents"
  >
    <EditableWindow
      ref="editableWindow"
      v-model:value="text"
    />
  </AppVirtualWindow>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
import EditableWindow from '@/components/EditableWindow'

export default defineComponent({
  components: { EditableWindow },
  props: {
    value: {
      type: String,
      required: true,
      default: '',
    },
  },
  emits: [
    'mousedown',
    'mouseup',
    'keydown',
    'keyup',
    'input',
    'scroll',
    'update:scrollTop',
  ],
  setup() {
    const windowState = reactive({
      width: 'auto',
      height: '90%',
      legend: {
        text: 'Vue3',
        type: 'inside'
      }
    })
    const text = ref('')

    return {
      windowState,
      text,
    }
  }
})
</script>