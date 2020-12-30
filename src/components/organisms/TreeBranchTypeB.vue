<template>
  <li
    :class="{ 'top-level': isTopLevel }"
    :data-id="value.id"
  >
    <VueDraggableNext v-bind="dragOption">
      <component
        :is="itemComponent"
        :id="value.id"
        :class="handleClass"
        @click="onClickItem"
      />
    </VueDraggableNext>
    <div class="tree-nodes">
      <BaseAccordion :is-open="isOpenChildren">
        <TreeBodyTypeB
          :data-id="value.id"
          :list="value.children"
          @click-item="onClickItem"
        />
      </BaseAccordion>
    </div>
  </li>
</template>

<script>
import { defineComponent, ref, computed, inject } from 'vue'
import { useStore as useSound, AUDIOS } from '@/store/audio'
import { useStore as useTree } from '@/store/tree'
import { VueDraggableNext } from 'vue-draggable-next'
import BaseAccordion from '@/components/atoms/BaseAccordion'

export default defineComponent({
  name: 'TreeBranch',
  components: {
    VueDraggableNext,
    BaseAccordion,
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
    isTopLevel: {
      type: Boolean,
      required: true,
    },
  },
  emits: [
    'click-item',
  ],
  setup(props, { emit }) {
    const isOpenChildren = ref(true)

    const { playAudio } = useSound()
    const { state: treeState, dragOptionSingle } = useTree()
    const handleClass = computed(() => treeState.handleClass)
    const dragOption = computed(() => dragOptionSingle.value)

    const itemComponent = inject('itemComponent')

    const onClickItem = value => emit('click-item', value)

    const onClickToggleButton = () => {
      isOpenChildren.value = !isOpenChildren.value
      playAudio(AUDIOS.ETC.DECISION_43)
    }

    return {
      isOpenChildren,
      handleClass,
      dragOption,
      itemComponent,
      onClickItem,
      onClickToggleButton,
    }
  }
})
</script>

<style lang="scss" scoped>

body.light-theme {
  li {
    border: 1px solid $blueLikeColor1;
    background: $greenLikeColor2;
  }
}
body.dark-theme {
  li {
    border: 1px solid $blueLikeColor1;
    background: $greenLikeColor2;
  }
}

li {
  padding: 2px 10px 2px 20px;
  position: relative;         // 樹形図線の位置の基準にする目的
  white-space: nowrap;        // 開閉時のToggleButtonの改行を防ぐ目的
  display       : flex;
  align-items   : center;
  flex-direction: row;

  // 2つ目以降のノードのborder-topを重ねさせる目的
  &:nth-child(n + 2) {
    margin-top: -1px;
  }
  // Drag中の要素に適用されるスタイル
  &.sortable-ghost {
    background: rgba(255, 255, 255, 0.5) !important;
  }
  // Drag開始時に複製される要素のスタイル
  &.sortable-drag {
    opacity: 0 !important;
  }
  // コンテンツ(クラス名をTreeStoreのhandleClassと一致させる必要がある)
  // .tree-node {
    // position: relative;     // .tree-branchより手前に表示させる目的
    // display: inline-block;  // ToggleButtonを右側に配置させる目的
  // }
  // 子要素のラッパー
  .tree-nodes {
    overflow: hidden;
  }
}
</style>