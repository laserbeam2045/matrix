<template>
  <TreeBetaBody
    :data-id="root.id"
    :value="root.children"
    @click-item="onClickItem"
  />
</template>

<script>
import { defineComponent, provide } from 'vue'

export default defineComponent({
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
    'click-item',
  ],
  setup(props, { emit }) {
    provide('itemComponent', props.itemComponent)
    
    const onClickItem = value => emit('click-item', value)

    return { onClickItem }
  }
})
</script>