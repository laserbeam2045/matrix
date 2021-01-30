<template>
  <table v-if="isEditMode">
    <tr>
      <th><label>Id</label></th>
      <td>
        <AppInputText v-model:value="idRef" disabled />
      </td>
    </tr>
    <tr>
      <th><label>Label</label></th>
      <td><AppInputText v-model:value="labelRef" /></td>
    </tr>
  </table>

  <table v-else>
    <tr>
      <th><label>Parent</label></th>
      <td>
        <AppInputText
          v-model:value="parentLabelRef"
          disabled
        />
      </td>
    </tr>
    <tr>
      <th><label>Label</label></th>
      <td><AppInputText v-model:value="labelRef" /></td>
    </tr>
  </table>
</template>

<script>
import { defineComponent, computed } from 'vue'
import useModelValue from '@/composables/useModelValue'

export default defineComponent({
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
  emits: [
    'update:id',
    'update:label',
    'update:parentLabel',
  ],
  setup(props, context) {
    const idRef = useModelValue(props, context, 'id')
    const labelRef = useModelValue(props, context, 'label')
    const parentLabelRef = useModelValue(props, context, 'parentLabel')

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