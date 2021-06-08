<template>
  <slot />
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { Theme } from 'types/theme'
import { provideTheme } from 'store/useTheme'

export default defineComponent({
  name : 'ThemeContext',
  props: {
    theme: {
      type    : String as PropType<Theme>,
      required: false,
      default : 'dark',
    },
  },
  setup(props) {
    provideTheme(ref(props.theme))
  },
})
</script>
