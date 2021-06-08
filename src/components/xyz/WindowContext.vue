<template>
  <slot />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { provideWindowManager } from 'store/useWindowManager'

export default defineComponent({
  name: 'WindowContext',
  setup() {
    provideWindowManager()
  },
})
</script>
