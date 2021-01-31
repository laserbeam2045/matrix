<template>
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
</template>

<script>
import { defineComponent, ref } from 'vue'
import { provideStore as provideMatrix } from '@/store/matrix'
import { provideStore as provideAudio } from '@/store/audio'
import AppContents from '@/pages/AppContents'
import AppLoading from '@/pages/AppLoading'

export default defineComponent({
  components: {
    AppContents,
    AppLoading,
  },
  setup() {
    const error = ref(null)
    
    provideAudio()
    provideMatrix()

    // TODO: ErrorHandling
    return { error }
  }
})
</script>
