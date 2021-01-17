<template>
  <li
    class="tree-beta-branch-molecule"
    :class="{ 'top-level': isTopLevel }"
    :data-id="value.id"
  >
    <VueDraggableNext v-bind="dragOption">
      <component
        :is="itemComponent"
        :id="value.id"
        :class="handleClass"
        v-on="itemEvents"
      />
    </VueDraggableNext>
    <div class="tree-nodes">
      <AppAccordion :is-open="isOpenChildren">
        <TreeBetaBody
          :data-id="value.id"
          :list="value.children"
          v-on="itemEvents"
        />
      </AppAccordion>
    </div>
  </li>
</template>

<script>
import { defineComponent, ref, computed, inject } from 'vue'
import { useStore as useSound, AUDIOS } from '@/store/audio'
import { VueDraggableNext } from 'vue-draggable-next'

export default defineComponent({
  name: 'TreeBetaBranch',
  components: {
    VueDraggableNext,
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
    'mousedown',
    'mouseup',
    'click',
  ],
  setup(props, { emit }) {
    const { playAudio } = useSound()

    const treeState = inject('treeState')
    const dragOptionSingle = inject('dragOptionSingle')
    const dragOption = computed(() => dragOptionSingle.value)
    const handleClass = computed(() => treeState.handleClass)

    const isOpenChildren = ref(true)

    const onClickToggleButton = () => {
      isOpenChildren.value = !isOpenChildren.value
      playAudio(AUDIOS.ETC.DECISION_43)
    }

    const itemComponent = inject('itemComponent')

    // アイテムからバブリングされるイベント(ツリー全体で共通)
    const itemEvents = {
      'mousedown': value => emit('mousedown', value),
      'mouseup': value => emit('mouseup', value),
      'click': value => emit('click', value),
    }

    return {
      dragOption,
      handleClass,
      isOpenChildren,
      onClickToggleButton,
      itemComponent,
      itemEvents,
    }
  }
})
</script>

<style lang="scss" scoped>
body.light-theme {
  .tree-beta-branch-molecule {
    border: 1px solid $blueLikeColor1;
    background: $greenLikeColor2;
  }
}
body.dark-theme {
  .tree-beta-branch-molecule {
    border: 1px solid $blueLikeColor1;
    background: $greenLikeColor2;
  }
}

.tree-beta-branch-molecule {
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