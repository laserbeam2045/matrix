<template>
  <table v-if="isEditMode">
    <tr>
      <th><label>Id</label></th>
      <td><BaseInputText v-model:value="idRef" disabled /></td>
    </tr>
    <tr>
      <th><label>Label</label></th>
      <td><BaseInputText v-model:value="labelRef" /></td>
    </tr>
  </table>

  <table v-else>
    <tr>
      <th><label>Parent</label></th>
      <td><BaseInputText v-model:value="parentLabelRef" disabled /></td>
    </tr>
    <tr>
      <th><label>Label</label></th>
      <td><BaseInputText v-model:value="labelRef" /></td>
    </tr>
  </table>
</template>

<script>
import { defineComponent, computed } from 'vue'
import useVModelRef from '@/utils/vmodel'
import BaseInputText from '@/components/atoms/BaseInputText'

export default defineComponent({
  name: 'TemplateFormQuizTag',
  components: {
    BaseInputText,
  },
  emits: [
    'update:id',
    'update:label',
    'update:parentLabel',
  ],
  props: {
    id: {
      type: Number,
      required: false,
      default: null,
    },
    label: {
      type: String,
      required: true,
    },
    parentLabel: {
      type: String,
      required: false,
      default: null,
    },
  },
  setup(props, context) {
    const idRef = useVModelRef(props, context, 'id')
    const labelRef = useVModelRef(props, context, 'label')
    const parentLabelRef = useVModelRef(props, context, 'parentLabel')

    const isEditMode = computed(() => parentLabelRef.value === null)

    return {
      idRef,
      labelRef,
      parentLabelRef,
      isEditMode,
    }
  },
})
</script>

<style lang="scss" scoped>
table {
  th {
    padding: 0 10px 0 0;
  }
  td {
    padding: 3px 0;
  }
}
</style>