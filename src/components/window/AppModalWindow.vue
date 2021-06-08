<template>
  <template v-if="isVisible">
    <teleport :to="`#layer-${level}`">
      <div class="modal-window">
        <AppVirtualWindow :legend="legend">
          <template #buttons>
            <AppHeaderItem name="times" @click="close" />
          </template>
          <template #default>
            <slot />
          </template>
        </AppVirtualWindow>
      </div>
    </teleport>
  </template>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useAudio, AUDIOS } from 'store/useAudio'

export default defineComponent({
  props: {
    level: {
      type   : Number,
      default: 2,
    },
    legend: {
      type   : [String, Object],
      default: '',
    },
  },
  emits: ['open', 'close'],

  setup(props, { emit }) {
    const { playAudio } = useAudio()

    const isVisible = ref(false)
    const open   = () => isVisible.value = true
    const close  = () => isVisible.value = false
    const toggle = () => isVisible.value = !isVisible.value

    watch(() => isVisible.value, newValue => {
      if (newValue) {
        playAudio(AUDIOS.ETC.DECISION_33)
        emit('open')
      } else {
        emit('close')
      }
    })

    return { isVisible, open, close, toggle }
  },
})
</script>

<style lang="scss" scoped>
.modal-window {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgb(0, 0, 0);
  background: rgba(0, 0, 0, 0.7);
}
</style>
