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
export default {
  name: 'AppInputRadio',
  props: {
    value: {
      type: String,
      required: false,
      default: '',
    },
    checked: {
      type: Boolean,
      required: true,
    },
    showInput: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  emits: [
    'change',
  ],
}
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