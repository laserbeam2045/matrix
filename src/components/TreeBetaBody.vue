<template>
  <VueDraggableNext
    tag="ul"
    class="tree-beta-body"
    :class="{ 'top-level': value }"
    :list="realValue"
    v-bind="dragOption"
    @end.self="onDragEnd"
  >
    <TreeBetaBranch
      v-for="tag in realValue"
      :key="tag.id"
      :value="tag"
      :isTopLevel="!!value"
      v-on="itemEvents"
    />
  </VueDraggableNext>
</template>

<script>
import { defineComponent, computed, inject } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import TreeBetaBranch from '@/components/TreeBetaBranch'

export default defineComponent({
  components: {
    VueDraggableNext,
    TreeBetaBranch,
  },
  props: {
    value: {  // MEMO: Tree(root)からはvalueとして受け取る
      type: Array,
      required: false,
      default: null,
    },
    list: {   // MEMO: TreeBranchからはlistとして受け取る
      type: Array,
      required: false,
      default: null,
    },
  },
  emits: [
    'mousedown',
    'mouseup',
    'click',
  ],
  setup(props, { emit }) {
    const dragOptionUnit = inject('dragOptionUnit')
    const dragOption = computed(() => dragOptionUnit.value)

    const realValue = computed(() => props.value ? props.value : props.list)

    const onDragEnd = evt => {
      // 所属グループが変わった場合、または、所属グループ内での位置が変わった場合
      // TODO: REST API呼び出しへの置き換え
      if (evt.from !== evt.to || evt.oldIndex !== evt.newIndex) {
        const isThere = value => value !== undefined
        const cID = evt.item.dataset.id,
              pID = evt.to.dataset.id,
              idx = evt.newIndex
        if (isThere(cID) && isThere(pID) && isThere(idx)) {
          console.log(`タグ(id=${cID})をタグ(id=${pID})の${idx}番目に移動する`)
        }
      }
    }

    // アイテムからバブリングされるイベント(ツリー全体で共通)
    const itemEvents = {
      'mousedown': value => emit('mousedown', value),
      'mouseup': value => emit('mouseup', value),
      'click': value => emit('click', value),
    }

    return {
      dragOption,
      realValue,
      onDragEnd,
      itemEvents,
    }
  }
})
</script>

<style lang="scss" scoped>
.tree-beta-body {
  margin: 0 auto 0 20px;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  &.top-level {
    margin: 0 auto 30px 0;
  }
}
</style>