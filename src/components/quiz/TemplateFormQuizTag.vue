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
      type   : Number,
      default: null,
    },
    label: {
      type    : String,
      required: true,
    },
    parentLabel: {
      type   : String,
      default: null,
    },
  },
  emits: [
    'update:id',
    'update:label',
    'update:parentLabel',
  ],
  setup(props) {
    const idRef = useModelValue(props, 'id')
    const labelRef = useModelValue(props, 'label')
    const parentLabelRef = useModelValue(props, 'parentLabel')

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
