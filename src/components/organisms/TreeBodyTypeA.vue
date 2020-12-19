<template>
  <VueDraggableNext
    tag="ul"
    :class="{ 'top-level': value }"
    :list="realValue"
    v-bind="dragOption"
    @end.self="onDragEnd"
  >
    <TreeBranchTypeA
      v-for="tag in realValue"
      :key="tag.id"
      :value="tag"
      :isTopLevel="!!value"
      v-on="itemEvents"
    />
  </VueDraggableNext>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { useStore as useTree } from '@/store/tree'

export default defineComponent({
  name: 'TreeBody',
  components: {
    VueDraggableNext,
  },
  emits: [
    'mousedown',
    'mouseup',
    'click',
  ],
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
  setup(props, { emit }) {
    const { dragOptionUnit } = useTree()
    const dragOption = computed(() => dragOptionUnit.value)

    const realValue = props.value ? props.value : props.list

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
      itemEvents,
      onDragEnd,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/app';

ul {
  @include unSelectable;
  margin: 0 0 0 40px;
  padding: 0;
  display: flex;
  flex-direction: column;

  &.top-level {
    margin: 0 20px 20px;
    padding: 0;
  }
}
</style>