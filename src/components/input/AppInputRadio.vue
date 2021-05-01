<template>
  <label>
    <input
      v-show="showInput"
      type="radio"
      :value="value"
      :checked="checked"
      @change="$emit('change', $event.target.checked)"
      @keydown.enter.prevent=""
    ><!--
 --><slot />
  </label>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    value: {
      type   : String,
      default: '',
    },
    checked: {
      type    : Boolean,
      required: true,
    },
    showInput: {
      type   : Boolean,
      default: true,
    },
  },
  emits: [
    'change',
  ],
})
</script>

<style lang="scss" scoped>
label {
  display: inline-block;
  font-family: $font-family-normal;
  cursor: pointer;

  input {
    cursor: pointer;
  }
}
</style>
