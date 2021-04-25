<template>
  <slot />
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { provideTheme, Theme } from '@/composables/useTheme'

export default defineComponent({
  name: 'ThemeContext',
  props: {
    theme: {
      type: String as PropType<Theme>,
      default: 'light',
    },
  },
  setup(props) {
    provideTheme(ref(props.theme))
  },
})
</script>
