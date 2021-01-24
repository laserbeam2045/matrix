<template>
  <div v-if="isVisible">
    <AppTeleporter :level="level">
      <div class="modal-window">
        <AppVirtualWindow
          v-model:top="windowState.top"
          v-model:left="windowState.left"
          v-model:width="windowState.width"
          v-model:height="windowState.height"
          v-model:position="windowState.position"
          v-model:draggable="windowState.draggable"
          :contents-style="contentsStyle"
          :legend="legend"
        >
          <template #header>
            <AppHeaderItemBox>
              <AppHeaderItem
                name="times"
                @click="hideModal"
              />
            </AppHeaderItemBox>
          </template>
          <template #default>
            <slot />
          </template>
        </AppVirtualWindow>
      </div>
    </AppTeleporter>
  </div>
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
  emits: [
    'close',
  ],
  setup(props, context) {
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
    const showModal   = () => isVisible.value = true
    const hideModal   = () => isVisible.value = false
    const toggleModal = () => isVisible.value = !isVisible.value

    watch(() => isVisible.value, newValue => {
      if (newValue) {
        playAudio(AUDIOS.ETC.DECISION_33)
      } else {
        context.emit('close')
      }
    })

    return {
      windowState,
      isVisible,
      showModal,
      hideModal,
      toggleModal,
    }
  },
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