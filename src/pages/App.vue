<template>
  <MatrixContext>
    <WindowContext>
      <AudioContext>
        <ThemeContext>
          <div v-if="error">
            {{ error.message }}
          </div>
          <Suspense v-else>
            <template #default>
              <AppContents />
            </template>
            <template #fallback>
              <AppLoading />
            </template>
          </Suspense>
        </ThemeContext>
      </AudioContext>
    </WindowContext>
  </MatrixContext>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue'

import MatrixContext from 'components/xyz/MatrixContext.vue'
import WindowContext from 'components/xyz/WindowContext.vue'
import AudioContext from 'components/xyz/AudioContext.vue'
import ThemeContext from 'components/xyz/ThemeContext.vue'
import AppContents from '@/pages/AppContents.vue'
import AppLoading from '@/pages/AppLoading.vue'

interface ErrorObject {
  message: string
}

type Error = Ref<null | ErrorObject>

export default defineComponent({
  components: {
    MatrixContext,
    WindowContext,
    ThemeContext,
    AudioContext,
    AppContents,
    AppLoading,
  },
  setup() {
    const error: Error = ref(null)

    // TODO: ErrorHandling
    return { error }
  },
})
</script>
