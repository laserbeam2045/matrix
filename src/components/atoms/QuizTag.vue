<template>
  <div
    v-if="data"
    class="tag, quiz-tag"
    :class="{ active }"
    v-on="events"
  >
    {{ text }}
  </div>
</template>

<script>
import { defineComponent, computed, unref, inject } from 'vue'
import { useStore as useQuizTag } from '@/store/quiz_tag'
import { MOUSE_TOUCH_EVENT } from '@/store/constants'

export default defineComponent({
  name: 'QuizTag',
  props: {
    id: {
      type: Number,
      required: true,
    },
    showCount: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  emits: [
    'mousedown',
    'mouseup',
    'click',
  ],
  setup(props, { emit }) {
    const data = useQuizTag().find(props.id)

    const activeTagIds = inject('activeTagIds')

    const active = computed(() => unref(activeTagIds).has(props.id))

    const text = computed(() => {
      if (props.showCount && data.quizCount)
        return `${data.label} (${data.quizCount})`
      else
        return data.label
    })

    const events = {
      [MOUSE_TOUCH_EVENT.START]: () => emit('mousedown', props.id),
      [MOUSE_TOUCH_EVENT.END]: () => emit('mouseup', props.id),
      click: () => emit('click', props.id),
    }

    return {
      data,
      text,
      active,
      events,
    }
  }
})
</script>

<style lang="scss" scoped>
$bgColor    : $blackLikeColor7;
$textColor  : $blueLikeColor4;
$borderColor: $blueLikeColor4;
$textColor  : $blueLikeColor6;
$borderColor: $blueLikeColor6;

div {
  @include unSelectable;
  display: inline-block;
  padding: 7px 9px;
  font-size: 14px;
  line-height: 14px;
  color: $textColor;
  background: $bgColor;
  border-radius: 5px;
  border: 1px solid $borderColor;
  font-family: $font-family-normal;
  white-space: nowrap;
  transition: all .2s;

  &:hover {
    cursor: pointer;
  }
  &:active {
    cursor: grabbing;
  }
  &.active {
    color: orange;
    border-color: orange;
  }
}
</style>