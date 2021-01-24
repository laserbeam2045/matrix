<template>
  <div
    v-if="data"
    class="quiz-tag"
    :class="{ active }"
    v-on="events"
  >
    {{ text }}
  </div>
</template>

<script>
import { defineComponent, computed, inject } from 'vue'
import { MOUSE_TOUCH_EVENT } from '@/utils/event_functions'

export default defineComponent({
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
    const getQuizTag = inject('getQuizTag')
    const data = getQuizTag(props.id)

    const activeTagIds = inject('activeTagIds')

    const active = computed(() => activeTagIds.value.has(props.id))

    const text = computed(() => {
      if (props.showCount && data.quizCount)
        return `${data.label} (${data.quizCount})`
      else
        return data.label
    })

    const events = {
      [`${MOUSE_TOUCH_EVENT.START}Passive`]: () => emit('mousedown', props.id),
      [`${MOUSE_TOUCH_EVENT.END}Passive`]  : () => emit('mouseup', props.id),
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

.quiz-tag {
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