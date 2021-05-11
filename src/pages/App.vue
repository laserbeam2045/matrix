<template>
  <div v-if="error">
    {{ error.message }}
  </div>
  <ThemeContext v-else>
    <Suspense>
      <template #default>
        <AppContents />
      </template>
      <template #fallback>
        <AppLoading />
      </template>
    </Suspense>
  </ThemeContext>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { provideStore as provideAudio } from '@/store/audio'
import { provideStore as provideMatrix } from '@/store/matrix'
import { provideStore as provideWindowManager } from '@/store/windowManager'

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
