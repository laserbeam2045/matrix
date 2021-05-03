<template>
  <AppVirtualWindow v-bind="windowState" v-on="windowEvents">
    <EditableWindow v-model:value="text" />
  </AppVirtualWindow>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
import EditableWindow from './EditableWindow'
import { MOUSE_TOUCH_EVENT } from '@/utilities/v_event_functions'

export default defineComponent({
  name      : 'TheEditor',
  components: {
    EditableWindow,
  },
  props: {
    value: {
      type    : String,
      required: true,
    },
  },
  emits: [
    'mousedown',
    'mouseup',
    'keydown',
    'keyup',
    'input',
    'scroll',
    'touch',
    'update:scrollTop',
  ],
  setup(_, { emit }) {
    const text = ref('')

    const windowState = reactive({
      width : '75vh',
      height: '90vh',
      legend: 'Vue3',
    })

    const windowEvents = {
      [`${MOUSE_TOUCH_EVENT.START}Passive`]() { emit('touch') },
    }

    return { text, windowState, windowEvents }
  },
})
</script>
