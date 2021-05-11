<template>
  <li
    class="tree-alpha-branch"
    :class="{ 'top-level': isTopLevel }"
    :data-id="value.id"
  >
    <VueDraggableNext v-bind="dragOptionSingle">
      <component
        :is="itemComponent"
        :id="value.id"
        :class="handle"
        v-on="itemEvents"
      />
      <TreeToggleButton
        v-if="value.children.length"
        :isOpen="isOpenChildren"
        @click="onClickToggleButton"
      />
    </VueDraggableNext>
    <div class="tree-nodes">
      <AppAccordion :isOpen="isOpenChildren">
        <TreeAlphaBody
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
import { injectStore as injectAudio, AUDIOS } from '@/store/audio'
import { VueDraggableNext } from 'vue-draggable-next'
import TreeToggleButton from './TreeToggleButton'

export default defineComponent({
  components: {
    VueDraggableNext,
    TreeToggleButton,
  },
  props: {
    value: {
      type    : Object,
      required: true,
    },
    isTopLevel: {
      type    : Boolean,
      required: true,
    },
  },
  emits: [
    'mousedown',
    'mouseup',
    'click',
  ],
  setup() {
    const { playAudio } = injectAudio()

    const itemEvents = inject('itemEvents')
    const itemComponent = inject('itemComponent')

    const treeState = inject('treeState')
    const dragOptionSingle = inject('dragOptionSingle')
    const handle = computed(() => treeState.handle)

    const isOpenChildren = ref(true)

    const onClickToggleButton = () => {
      isOpenChildren.value = !isOpenChildren.value
      playAudio(AUDIOS.ETC.DECISION_43)
    }

    return {
      itemEvents,
      itemComponent,
      dragOptionSingle,
      handle,
      isOpenChildren,
      onClickToggleButton,
    }
  },
})
</script>

<style lang="scss" scoped>
.tree-alpha-branch {
  @include unSelectable;

  position: relative;         // 樹形図線の位置の基準にする目的
  display       : flex;       // 親のulと併せてflex指定をすることで、
  flex-direction: column;
  align-items   : flex-start; // 横幅を兄弟要素の最大幅に合わせるようにしている
  padding: 4px 7px 0;
  white-space: nowrap;        // 開閉時のToggleButtonの改行を防ぐ目的

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
  // コンテンツ(クラス名をTreeStoreのhandleと一致させる必要がある)
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

    position: absolute;
    top: -1482px;
    left: -20px;
    width: 30px;
    height: 1500px;
    color: white;
    pointer-events: none;
    content: '';
    border-bottom: 1px solid;
    border-left  : 1px solid;
    border-radius: 0 0 0 5px;
  }
}

.main.dark {
  .tree-alpha-branch {
    background: $greenLikeColor2;
    border: 1px solid $blueLikeColor1;
  }
}
.main.light {
  .tree-alpha-branch {
    background: $greenLikeColor2;
    border: 1px solid $blueLikeColor1;
  }
}
.main.classic {
  .tree-alpha-branch {
    background: $greenLikeColor2;
    border: 1px solid $blueLikeColor1;
  }
}
</style>
