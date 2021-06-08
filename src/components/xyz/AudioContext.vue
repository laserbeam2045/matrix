<template>
  <slot />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { provideAudio } from 'store/useAudio'

export default defineComponent({
  name: 'AudioContext',
  setup() {
    provideAudio()
  },
})
</script>
