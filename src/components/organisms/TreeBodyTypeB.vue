<template>
  <VueDraggableNext
    tag="ul"
    :class="{ 'top-level': value }"
    :list="realValue"
    v-bind="dragOption"
    @end.self="onDragEnd"
  >
    <TreeBranchTypeB
      v-for="tag in realValue"
      :key="tag.id"
      :value="tag"
      :is-top-level="!!value"
      @click-item="onClickItem"
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
    'click-item',
  ],
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
    
    const onClickItem = value => emit('click-item', value)

    return {
      dragOption,
      realValue,
      onDragEnd,
      onClickItem,
    }
  },
})
</script>

<style lang="scss" scoped>
ul {
  margin: 0 auto 0 20px;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  &.top-level {
    margin: 0 auto 30px 0;
  }
}
</style>