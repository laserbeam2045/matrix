<docs>
[使用パターン１]
  [前提データ]
    checked = false
    label = 'foo'
  [使用例]
    <AppCheckbox v-model="checked" :label="foo" />
  [備考]
    チェックボックスにチェックを入れると、
    v-modelに渡したプロパティの値がtrueになります。

[使用パターン２]
  [前提データ]
    checked = []
    items = [
      {
        label: 'foo',
        value: 1,
      }, {
        label: 'bar',
        value: 2,
      }
    ]
  [使用例]
    <AppCheckbox v-model="checked" v-bind="items[0]" />
    <AppCheckbox v-model="checked" v-bind="items[1]" />
  [備考]
    チェックボックスにチェックを入れると、
    対応する要素のvalueがcheckedに追加されます。
</docs>

<template>
  <label
    class="app-checkbox"
    :class="{ '-checked': isChecked }"
  >
    <input
      v-model="checked"
      type="checkbox"
      class="input"
      :name="name"
      :value="value"
      :required="required"
    >
    {{ label }}
  </label>
</template>

<script>
import { defineComponent, computed } from 'vue'
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
    // modelValueが配列の場合は、valueが必須
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

    const isChecked = computed(() => {
      const { modelValue, value } = props

      return typeof(modelValue) === 'object' ?
        modelValue.includes(value) :
        modelValue
    })

    return { checked, isChecked }
  },
})
</script>

<style lang="scss" scoped>
.app-checkbox {
  white-space: nowrap;
  cursor: pointer;
  @include unSelectable;

  > .input {
    display: none;
  }
}
</style>
