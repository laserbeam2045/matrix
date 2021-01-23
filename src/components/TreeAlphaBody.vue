<template>
  <VueDraggableNext
    v-model="realValue"
    tag="ul"
    class="tree-alpha-body"
    :class="{ 'top-level': value }"
    v-bind="dragOptionUnit"
    @end.self="onDragEnd"
  >
    <TreeAlphaBranch
      v-for="tag in realValue"
      :key="tag.id"
      :value="tag"
      :is-top-level="!!value"
      v-on="itemEvents"
    />
  </VueDraggableNext>
</template>

<script>
import { defineComponent, reactive, computed, inject } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'

export default defineComponent({
  name: 'TreeAlphaBody',
  components: { VueDraggableNext },
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
  setup(props) {
    const realValue = computed({
      get: () => props.value ? props.value : props.list,
      set: () => {},
    })

    const itemEvents = inject('itemEvents')
    const getQuizTag = inject('getQuizTag')
    const dragOptionUnit = inject('dragOptionUnit')

    const updateProps = reactive({
      cID: null,
      pID: null,
      idx: null,
    })
    const updatable = computed(() => (
      updateProps.cID !== undefined &&
      updateProps.pID !== undefined &&
      updateProps.idx !== undefined
    ))
    const updateMessage = computed(() => {
      const labelA = getQuizTag(Number(updateProps.cID)).label
      const labelB = getQuizTag(Number(updateProps.pID)).label
      const index = Number(updateProps.idx) + 1
      return `【${labelA}】を、\n【${labelB}】内の、${index}番目に移動させます。よろしいですか？`
    })

    // 所属グループを変更した場合、または、
    // 所属グループ内での位置を変更した場合に、ツリー構造を更新する
    const onDragEnd = evt => {
      if (evt.from !== evt.to || evt.oldIndex !== evt.newIndex) {
        updateProps.cID = evt.item.dataset.id
        updateProps.pID = evt.to.dataset.id
        updateProps.idx = evt.newIndex
        if (updatable.value) {
          if (window.confirm(updateMessage.value)) {
            1 // TODO: 更新処理
          } else {
            2
          }
        }
      }
    }
    
    return { realValue, itemEvents, dragOptionUnit, onDragEnd }
  }
})
</script>

<style lang="scss" scoped>
.tree-alpha-body {
  @include unSelectable;
  display: flex;
  flex-direction: column;
  margin: 0 0 0 40px;

  &.top-level {
    margin: 0;
  }
}
</style>