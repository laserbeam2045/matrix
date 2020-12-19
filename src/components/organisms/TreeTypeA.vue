<template>
  <TreeBodyTypeA
    :data-id="root.id"
    :value="root.children"
    v-on="itemEvents"
  />
</template>

<script>
import { defineComponent, provide } from 'vue'

export default defineComponent({
  name: 'TreeTypeA',
  emits: [
    'mousedown',
    'mouseup',
    'click',
  ],
  props: {
    root: {
      type: Object,
      required: true,
    },
    itemComponent: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    provide('itemComponent', props.itemComponent)

    // アイテムからバブリングされるイベント
    const itemEvents = {
      'mousedown': value => emit('mousedown', value),
      'mouseup': value => emit('mouseup', value),
      'click': value => emit('click', value),
    }
    
    return { itemEvents }
  }
})
</script>