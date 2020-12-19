<template>
  <div
    ref="root"
    :class="rootClass"
    :style="rootStyle"
  >
    <component
      :is="ResizableWindowComponent"
      v-model:top="topRef"
      v-model:left="leftRef"
      v-model:width="widthRef"
      v-model:height="heightRef"
      :useResizeV="useResizeV"
      :useResizeH="useResizeH"
      :wrapper="root"
    >
      <component
        :is="DraggableWindowComponent"
        v-model:top="topRef"
        v-model:left="leftRef"
        :width="widthRef"
        :height="heightRef"
        :handle="`.${handleClass}`"
        :wrapper="root"
      >
        <VirtualWindowContents
          :handleClass="handleClass"
          :contentsStyle="contentsStyle"
        >
          <template #header>
            <slot name="header"></slot>
          </template>
          <template #default>
            <slot></slot>
          </template>
          <template #footer>
            <slot name="footer"></slot>
          </template>
        </VirtualWindowContents>
      </component>
    </component>

    <VirtualWindowLegend
      :legend="legend"
      :handleClass="handleClass"
    />
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, nextTick } from 'vue'
import { useStore as useMatrix } from '@/store/matrix'
import useWindow from '@/utils/windows'
import useVModelRef from '@/utils/vmodel'
import ResizableWindow from '@/components/organisms/ResizableWindow'
import DraggableWindow from '@/components/organisms/DraggableWindow'
import VirtualWindowLegend from '@/components/organisms/VirtualWindowLegend'
import VirtualWindowContents from '@/components/organisms/VirtualWindowContents'

export default defineComponent({
  name: 'VirtualWindow',
  components: {
    ResizableWindow,
    DraggableWindow,
    VirtualWindowLegend,
    VirtualWindowContents,
  },
  emits: [
    'update:top',
    'update:left',
    'update:width',
    'update:height',
  ],
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
    useResizeV: {
      type: Boolean,
      required: false,
      default: false,
    },
    useResizeH: {
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
  setup(props, context) {
    const matrix = useMatrix()
    const windowNum = matrix.getNextWindowNumber()
    const handleClass = `draggable-handle-${windowNum}`

    const topRef = useVModelRef(props, context, 'top')
    const leftRef = useVModelRef(props, context, 'left')
    const widthRef = useVModelRef(props, context, 'width')
    const heightRef = useVModelRef(props, context, 'height')

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

    const ResizableWindowComponent = computed(() => {
      return props.useResizeV || props.useResizeH ? ResizableWindow : 'div'
    })
    const DraggableWindowComponent = computed(() => {
      return props.draggable ? DraggableWindow : 'div'
    })

    const centering = () => {
      const { getCenterPosition } = useWindow()
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
      ResizableWindowComponent,
      DraggableWindowComponent,
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/app';
@import '@/assets/style/colors';
@import '@/assets/style/window';

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
  color: $blueLikeColor6;
  box-shadow: $windowBoxShadow;
  border: 1px solid $blueLikeColor6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;

  $BR: 8px;
  &.inside-legend {
    border-radius: $BR;
  }
  &.outside-legend {
    border-radius: 0 $BR $BR $BR;
  }
}
</style>