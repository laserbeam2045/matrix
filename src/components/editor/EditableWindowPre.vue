<template>
  <pre
    ref="root"
    class="editable-pre"
    :contenteditable="contenteditable"
    :spellcheck="spellcheck"
    v-on="listeners"
    v-text="htmlString"
  />
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  props: {
    htmlString: {
      type    : String,
      required: true,
    },
    spellcheck: {
      type   : Boolean,
      default: false,
    },
    listeners: {
      type   : Object,
      default: () => {},
    },
  },
  setup() {
    const root = ref(null)

    const blur            = () => root.value.blur()
    const focus           = () => root.value.focus()
    const getElement      = () => root.value
    const getInnerText    = () => root.value.innerText
    const getInnerHTML    = () => root.value.innerHTML
    const getChildNodes   = () => root.value.childNodes
    const getChildNodeAt  = idx => root.value.childNodes.item(idx)
    const getTextContent  = () => root.value.textContent
    const getScrollHeight = () => root.value.scrollHeight

    const contenteditable = ref(false)

    onMounted(() => contenteditable.value = true)

    return {
      root,
      blur,
      focus,
      getElement,
      getInnerText,
      getInnerHTML,
      getChildNodes,
      getChildNodeAt,
      getTextContent,
      getScrollHeight,
      contenteditable,
    }
  },
})
</script>

<style lang="scss" scoped>
.editable-pre {
  padding: 12px 15px 12px;
  margin: 0;
  font: inherit;
  text-align: left;
  white-space: pre-wrap;
  cursor: text;

  &:not(.hidden) {
    color: inherit;
  }
  &.hidden {
    position: absolute;
    top: 0;
    color: transparent;
    pointer-events: none;
  }
  &:focus {
    outline: none;
  }
}

.main.dark {
  .editable-pre {
    background: $windowDarkBackgroundEditor;
  }
}
.main.light {
  .editable-pre {
    background: $windowLightBackgroundEditor;
  }
}
.main.classic {
  .editable-pre {
    background: $windowLightBackgroundEditor;
  }
}
</style>
