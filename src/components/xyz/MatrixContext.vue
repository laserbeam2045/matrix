<template>
  <slot />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { provideMatrix } from 'store/useMatrix'

export default defineComponent({
  name: 'MatrixContext',
  setup() {
    provideMatrix()
  },
})
</script>
