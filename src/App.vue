<template>
  <div v-if="error">
    {{ error.message }}
  </div>

  <Suspense v-else>
    <template #default>
      <AppContents />
    </template>
    <template #fallback>
      <div class="loading">
        Loading...
      </div>
    </template>
  </Suspense>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { provideStore as provideMatrix } from '@/store/matrix'
import { provideStore as provideAudio } from '@/store/audio'
import AppContents from '@/pages/AppContents'

export default defineComponent({
  components: {
    AppContents,
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

<style lang="scss" scoped>
.loading {
  position: absolute;
  top: 40%;
  left: 0;
  right: 0;
  text-align: center;
}
</style>