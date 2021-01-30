<template>
  <template v-if="isVisible">
    <teleport :to="`#layer-${level}`">
      <div class="modal-window">
        <AppVirtualWindow
          v-model:top="windowState.top"
          v-model:left="windowState.left"
          v-model:width="windowState.width"
          v-model:height="windowState.height"
          v-model:position="windowState.position"
          v-model:draggable="windowState.draggable"
          :contentsStyle="contentsStyle"
          :legend="legend"
        >
          <template #header>
            <AppHeaderItemBox>
              <AppHeaderItem name="times" @click="close" />
            </AppHeaderItemBox>
          </template>
          <template #default>
            <slot />
          </template>
        </AppVirtualWindow>
      </div>
    </teleport>
  </template>
</template>

<script>
import { defineComponent, ref, reactive, watch } from 'vue'
import { useStore as useAudio, AUDIOS } from '@/store/audio'

export default defineComponent({
  props: {
    level: {
      type: Number,
      required: false,
      default: 2,
    },
    legend: {
      type: Object,
      required: false,
      default() {
        return {
          text: '',
          type: 'inside',
        }
      },
    },
    contentsStyle: {
      type: Object,
      required: false,
      default() {
        return {}
      },
    },
  },
  emits: ['open', 'close'],

  setup(_, { emit }) {
    const { playAudio } = useAudio()

    const windowState = reactive({
      top: 'center',
      left: 'center',
      width: 'auto',
      height: 'auto',
      position: 'fixed',
      draggable: true,
    })

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

    return {
      windowState,
      isVisible,
      open,
      close,
      toggle,
    }
  }
})
</script>

<style scoped>
.modal-window {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(0, 0, 0);
  background: rgba(0, 0, 0, 0.7);
}
</style>