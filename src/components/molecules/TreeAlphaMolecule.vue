<template>
  <TreeAlphaBodyMolecule
    :data-id="root.id"
    :value="root.children"
    v-on="itemEvents"
  />
</template>

<script>
import { defineComponent, provide } from 'vue'

export default defineComponent({
  name: 'TreeAlphaMolecule',
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
  emits: [
    'mousedown',
    'mouseup',
    'click',
  ],
  setup(props, { emit }) {
    // アイテムからバブリングされるイベント(ツリー全体で共通)
    const itemEvents = {
      'mousedown': value => emit('mousedown', value),
      'mouseup': value => emit('mouseup', value),
      'click': value => emit('click', value),
    }
    provide('itemEvents', itemEvents)
    provide('itemComponent', props.itemComponent)
    
    return { itemEvents }
  }
})
</script>