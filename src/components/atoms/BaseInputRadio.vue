<template>
  <label>
    <input
      type="radio"
      v-show="showInput"
      :value="value"
      :checked="checked"
      @change="$emit('change', $event.target.checked)"
      @keydown.enter.prevent=""
    /><!--
 --><slot></slot>
  </label>
</template>

<script>
export default {
  name: 'BaseInputRadio',
  emits: [
    'change',
  ],
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
}
</script>

<style lang="scss" scoped>
label {
  display: inline-block;
  margin: 0;
  padding: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  cursor: pointer;

  input {
    cursor: pointer;
  }
}
</style>