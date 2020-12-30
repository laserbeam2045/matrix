<template>
  <div v-if="error">
    {{ error.message }}
  </div>

  <Suspense v-else>
    <template #fallback>
      <div class="loading">
        Loading...
      </div>
    </template>
    
    <template #default>
      <AppContents />
    </template>
  </Suspense>
</template>

<script>
import { defineComponent, ref } from 'vue'
import AppContents from '@/pages/AppContents'
import { provideStore as provideMatrix } from '@/store/matrix'
import { provideStore as provideAudio } from '@/store/audio'
import { provideStore as provideTag } from '@/store/quiz_tag'

export default defineComponent({
  components: {
    AppContents,
  },
  setup() {
    const error = ref(null)
    
    provideAudio()
    provideMatrix()
    provideTag()

    // TODO: ErrorHandling
    return { error }
  },
})
</script>

<style lang="scss" scoped>
.loading {
  top: 40%;
  position: relative;
  text-align: center;
}
</style>