<docs>
  詳しい使用方法などは、AppCheckboxを参照してください。
</docs>

<template>
  <AppCheckbox
    v-model="checked"
    :label="label"
    :name="name"
    :value="value"
    :required="required"
    class="app-checkbox-formal"
  />
</template>

<script>
import { defineComponent } from 'vue'
import useModelValue from '@/composables/useModelValue'

export default defineComponent({
  props: {
    modelValue: {
      type    : [Boolean, Array],
      required: true,
    },
    label: {
      type    : String,
      required: true,
    },
    name: {
      type   : String,
      default: null,
    },
    value: {
      type   : [String, Number],
      default: null,
    },
    required: {
      type   : Boolean,
      default: null,
    },
  },
  emits: [
    'update:modelValue',
  ],
  setup(props) {
    const checked = useModelValue(props, 'modelValue')

    return { checked }
  },
})
</script>

<style lang="scss" scoped>
.app-checkbox-formal {
  position: relative;
  display: inline-block;
  padding-left: 24px;
  line-height: 1;

  &.-checked::before {
    background-color: blue;
    border-color: blue;
  }
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 18px;
    height: 17px;
    content: '';
    background: $white;
    border: 1px solid gray;
    border-radius: 2px;
  }

  &.-checked::after {
    opacity: 1;
  }
  &::after {
    position: absolute;
    top: 2px;
    left: 6px;
    display: block;
    width: 5px;
    height: 8px;
    content: '';
    border-right: 2px solid $white;
    border-bottom: 2px solid $white;
    opacity: 0;
    transform: rotate(45deg);
  }
}
</style>
