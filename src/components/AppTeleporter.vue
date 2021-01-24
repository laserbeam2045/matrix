<template>
  <teleport :to="teleportTo">
    <slot />
  </teleport>
</template>

<script>
import { defineComponent, toRef, computed } from 'vue'

export default defineComponent({
  props: {
    level: {
      type: Number,
      required: false,
      default: 3,
    }
  },
  setup(props) {
    const level = toRef(props, 'level')
    const teleportTo = computed(() => `#layer-${level.value}`)

    return { teleportTo }
  }
})
</script>
