<template>
  <slot />
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { provideTheme, Theme } from '@/composables/useTheme'

export default defineComponent({
  props: {
    theme: {
      type   : String as PropType<Theme>,
      default: 'dark',
    },
  },
  setup(props) {
    provideTheme(ref(props.theme))
  },
})
</script>
