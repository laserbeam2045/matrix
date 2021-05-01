<template>
  <template v-for="(window, index) in windows" :key="index">
    <component :is="window" @touch="pullUp(window)" />
  </template>
  <!-- <teleport to="#layer-3">
    <div id="windows-tab">
      <AppVirtualWindowLegend
        v-for="name in matrix.state.hiddenWindows"
        :key="name"
        :legend="{ text: name, type: 'outside' }"
        style="position: relative;"
        @touch="teleportToFront(name)"
      />
    </div>
  </teleport> -->
</template>

<script>
import { defineComponent } from 'vue'
import { injectStore } from '@/store/windowManager'

export default defineComponent({
  setup() {
    const {
      stack: windows,
      pullUp,
    } = injectStore()

    return { windows, pullUp }
  },
})
</script>
