<template>
  <textarea
    ref="textareaRef"
    spellcheck="false"
    autocomplete="off"
    :value="value"
    @input="$emit('update:value', $event.target.value)"
  />
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    value: {
      type    : String,
      required: true,
    },
  },
  emits: [
    'update:value',
  ],
  setup() {
    const textareaRef = ref(null)

    return {
      textareaRef,
      focus: () => textareaRef.value.focus(),
    }
  },
})
</script>

<style lang="scss" scoped>

textarea {
  width: 347px;
  height: 176px;
  padding: 12px;
  font: $normalFont;
  color: $blueLikeColor6;
  background: transparent;
  border: 1px solid $def-wrap-c2;
  transition: $neutral-transition;

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
  }
}
</style>
