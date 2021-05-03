<template>
  <div v-if="error">
    {{ error.message }}
  </div>
  <Suspense v-else>
    <template #default>
      <ThemeContext>
        <AppContents />
      </ThemeContext>
    </template>
    <template #fallback>
      <AppLoading />
    </template>
  </Suspense>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { provideStore as provideMatrix } from '@/store/matrix'
import { provideStore as provideWindowManager } from '@/store/windowManager'
import { provideStore as provideAudio } from '@/store/audio'

import ThemeContext from '@/components/xyz/ThemeContext'

import AppContents from '@/pages/AppContents'
import AppLoading from '@/pages/AppLoading'

export default defineComponent({
  components: {
    ThemeContext,
    AppContents,
    AppLoading,
  },
  setup() {
    const error = ref(null)

    provideAudio()
    provideMatrix()
    provideWindowManager()

    // TODO: ErrorHandling
    return { error }
  },
})
</script>
