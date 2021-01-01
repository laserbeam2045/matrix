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
        v-on="itemEvents"
      />
      <TreeToggleButton
        v-if="value.children.length"
        :is-open="isOpenChildren"
        @click="onClickToggleButton"
      />
    </VueDraggableNext>
    <div class="tree-nodes">
      <AccordionAtom :is-open="isOpenChildren">
        <TreeBodyTypeA
          :data-id="value.id"
          :list="value.children"
          v-on="itemEvents"
        />
      </AccordionAtom>
    </div>
  </li>
</template>

<script>
import { defineComponent, ref, computed, inject } from 'vue'
import { useStore as useSound, AUDIOS } from '@/store/audio'
import { useStore as useTree } from '@/store/tree'
import { VueDraggableNext } from 'vue-draggable-next'
import TreeToggleButton from '@/components/organisms/TreeToggleButton'

export default defineComponent({
  name: 'TreeBranch',
  components: {
    VueDraggableNext,
    TreeToggleButton,
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
    const { state: treeState, dragOptionSingle } = useTree()
    const handleClass = computed(() => treeState.handleClass)
    const dragOption = computed(() => dragOptionSingle.value)

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
      handleClass,
      dragOption,
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
  @include unSelectable;
  padding: 4px 7px 0px;
  position: relative;         // 樹形図線の位置の基準にする目的
  white-space: nowrap;        // 開閉時のToggleButtonの改行を防ぐ目的
  display       : flex;       // 親のulと併せてflex指定をすることで、
  align-items   : flex-start; // 横幅を兄弟要素の最大幅に合わせるようにしている
  flex-direction: column;

  // 2つ目以降のノードのborder-topを重ねさせる目的
  &:nth-child(n + 2) {
    margin-top: -1px;
  }
  // Drag中の要素に適用されるスタイル
  &.sortable-ghost {
    background: rgba(255, 255, 255, 0.6) !important;
  }
  // Drag開始時に複製される要素のスタイル
  &.sortable-drag {
    opacity: 0 !important;
  }
  // コンテンツ(クラス名をTreeStoreのhandleClassと一致させる必要がある)
  .tree-node {
    @include unSelectable;
    position: relative;     // .tree-branchより手前に表示させる目的
    display: inline-block;  // ToggleButtonを右側に配置させる目的
  }
  // 子要素のラッパー
  .tree-nodes {
    @include unSelectable;
    padding: 2px 0 2px;
    overflow: hidden;
  }
  // 樹形図の線を表現するための簡易的な手法
  &:not(.top-level)::before {
    @include unSelectable;
    content: '';
    position: absolute;
    top: -1482px;
    left: -20px;
    width: 30px;
    height: 1500px;
    color: white;
    border-radius: 0 0 0 5px;
    border-left  : 1px solid;
    border-bottom: 1px solid;
    pointer-events: none;
  }
}
</style>