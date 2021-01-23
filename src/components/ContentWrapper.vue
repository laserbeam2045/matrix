<template>
  <div class="content-wrapper">
    <Progressbar>
      <slot />
    </Progressbar>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ContentWrapper',
  setup() {

  }
})
</script>

<style lang="scss" scoped>
.content-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>