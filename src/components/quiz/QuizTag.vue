<template>
  <AppCheckbox
    v-model="active"
    :label="label"
    class="quiz-tag"
    v-on="events"
  />
</template>

<script>
import { defineComponent, computed, inject } from 'vue'
import { MOUSE_TOUCH_EVENT } from 'utilities/v_event_functions'

export default defineComponent({
  props: {
    id: {
      type    : Number,
      required: true,
    },
    showCount: {
      type   : Boolean,
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

    const active = computed({
      get: () => activeTagIds.value.includes(props.id),
      set: value => value,
    })

    const label = computed(() => {
      if (props.showCount && data.quizCount)
        return `${data.label} (${data.quizCount})`
      else
        return data.label
    })

    const events = {
      [`${MOUSE_TOUCH_EVENT.START}Passive`]: () => emit('mousedown', props.id),
      [`${MOUSE_TOUCH_EVENT.END}Passive`]  : () => emit('mouseup', props.id),
      click                                : () => emit('click', props.id),
    }

    return {
      active,
      label,
      events,
    }
  },
})
</script>

<style lang="scss" scoped>
$bgColor    : $blackLikeColor7;
$textColor  : $blueLikeColor4;
$borderColor: $blueLikeColor4;
$textColor  : $blueLikeColor6;
$borderColor: $blueLikeColor6;

.quiz-tag {
  display: inline-block;
  padding: 7px 9px;
  font-family: $font-family-normal;
  font-size: 14px;
  line-height: 14px;
  color: $textColor;
  background: $bgColor;
  border: 1px solid $borderColor;
  border-radius: 5px;
  transition: all .2s;

  &:active {
    cursor: grabbing;
  }
  &.-checked {
    color: orange;
    border-color: orange;
  }
}
</style>
