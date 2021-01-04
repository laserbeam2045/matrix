<template>
  <div class="content-wrapper-atom">
    <ProgressbarAtom>
      <slot />
    </ProgressbarAtom>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ContentWrapperAtom',
  setup() {

  }
})
</script>

<style lang="scss" scoped>
.content-wrapper-atom {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>