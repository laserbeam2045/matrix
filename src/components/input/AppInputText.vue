<template>
  <input
    ref="input"
    v-quick-focus
    v-bind="props"
    @input="onInput"
  >
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    value: {
      type    : [String, Number],
      required: true,
    },
    type: {
      type   : String,
      default: 'text',
    },
    placeholder: {
      type   : String,
      default: '',
    },
    spellcheck: {
      type   : Boolean,
      default: false,
    },
    autocomplete: {
      type   : String,
      default: 'off',
    },
  },
  emits: [
    'update:value',
  ],
  setup(props, { emit }) {
    const input = ref(null)

    const focus = () => input.value.focus()
    const onInput = e => emit('update:value', e.target.value)

    return {
      props,
      input,
      focus,
      onInput,
    }
  },
})
</script>

<style lang="scss" scoped>

input {
  width: auto;
  padding: 6px 12px;
  font: $normalFont;
  color: $blueLikeColor6;
  background: transparent;
  border: 1px solid $def-wrap-c2;
  transition: $neutral-transition;

  &::placeholder {
    color: $grayLikeColor2;
    transition: $neutral-transition;
  }
  &:focus {
    color: $act-input-c1;
    text-shadow: $text-shadow;
    background: $act-input-c2;
    border: 1px solid $act-wrap-c2;
    outline: none;
    box-shadow : $act-input-c4  2px  2px 20px,
                 $act-input-c4 -2px -2px 20px,
                 $act-input-c4 -2px  2px 20px inset,
                 $act-input-c4  2px -2px 20px inset;
    transition : $focused-transition;

    &::placeholder {
      color: transparent;
      text-shadow: none;
      transition: all .5s;
    }
  }
  &:disabled {
    color: $grayLikeColor1;
  }
}
</style>
