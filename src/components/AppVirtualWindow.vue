<template>
  <div
    ref="root"
    :class="rootClass"
    :style="rootStyle"
  >
    <AppResizable
      v-model:top="topRef"
      v-model:left="leftRef"
      v-model:width="widthRef"
      v-model:height="heightRef"
      :use-resize-v="resizableV"
      :use-resize-h="resizableH"
      :wrapper="root"
    >
      <AppDraggable
        v-model:top="topRef"
        v-model:left="leftRef"
        :width="widthRef"
        :height="heightRef"
        :handle="`.${handleClass}`"
        :wrapper="root"
      >
        <AppVirtualWindowContents
          :handle-class="handleClass"
          :contents-style="contentsStyle"
        >
          <template #header>
            <slot name="header" />
          </template>
          <template #default>
            <slot />
          </template>
          <template #footer>
            <slot name="footer" />
          </template>
        </AppVirtualWindowContents>
      </AppDraggable>
    </AppResizable>

    <AppVirtualWindowLegend
      :legend="legend"
      :handle-class="handleClass"
    />
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, nextTick } from 'vue'
import useWindow from '@/composables/useWindow'
import useVModel from '@/composables/useVModel'

export default defineComponent({
  props: {
    top: {
      type: [Number, String],
      required: true,
    },
    left: {
      type: [Number, String],
      required: true,
    },
    width: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: false,
      default: 'absolute',
    },
    resizableV: {
      type: Boolean,
      required: false,
      default: false,
    },
    resizableH: {
      type: Boolean,
      required: false,
      default: false,
    },
    draggable: {
      type: Boolean,
      required: false,
      default: false,
    },
    contentsStyle: {
      type: Object,
      required: false,
      default() {
        return {}
      },
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
  },
  emits: [
    'update:top',
    'update:left',
    'update:width',
    'update:height',
  ],
  setup(props, context) {
    const { windowNumber, getCenterPosition } = useWindow()
    const handleClass = `draggable-handle-${windowNumber}`

    const topRef = useVModel(props, context, 'top')
    const leftRef = useVModel(props, context, 'left')
    const widthRef = useVModel(props, context, 'width')
    const heightRef = useVModel(props, context, 'height')

    const root = ref(null)
    const rootClass = computed(() => {
      return [ 'virtual-window', `${props.legend.type}-legend` ]
    })
    const rootStyle = computed(() => {
      return {
        top: topRef.value,
        left: leftRef.value,
        width: widthRef.value,
        height: heightRef.value,
        position: props.position,
      }
    })

    const centering = () => {
      const { top, left } = getCenterPosition(root)
      if ('center' === topRef.value) topRef.value = top + 'px'
      if ('center' === leftRef.value) leftRef.value = left + 'px'
    }

    onMounted(() => {
      nextTick(() => {
        centering()
      })
    })

    return {
      root,
      rootClass,
      rootStyle,
      topRef,
      leftRef,
      widthRef,
      heightRef,
      handleClass,
    }
  }
})
</script>

<style lang="scss" scoped>
body.light-theme {
  .virtual-window {
    color: $windowLightTextColor;
    background: $windowLightBackground;
  }
}
body.dark-theme {
  .virtual-window {
    color: $windowDarkTextColor;
    background: $windowDarkBackground;
  }
}

// 外枠のスタイル
.virtual-window {
  position: relative;
  max-width: 100%;
  color: $blueLikeColor6;
  box-shadow: $windowBoxShadow;
  border: 1px solid $blueLikeColor6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  $BR: 8px;
  &.inside-legend {
    border-radius: $BR;
  }
  &.outside-legend {
    border-radius: 0 $BR $BR $BR;
  }
}
</style>