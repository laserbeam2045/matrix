<template>
  <pre
    ref="root"
    v-focus
    contenteditable
    :spellcheck="spellcheck"
    v-on="listeners"
    v-text="htmlString"
  />
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'EditableWindowPre',
  props: {
    htmlString: {
      type: String,
      required: true,
    },
    spellcheck: {
      type: Boolean,
      required: false,
      default: false,
    },
    listeners: {
      type: Object,
      required: false,
      default() {
        return {}
      }
    },
  },
  setup() {
    const root = ref(null)

    const blur            = () => root.value.blur()
    const focus           = () => root.value.focus()
    const getInnerText    = () => root.value.innerText
    const getInnerHTML    = () => root.value.innerHTML
    const getChildNodes   = () => root.value.childNodes
    const getChildNodeAt  = idx => root.value.childNodes.item(idx)
    const getTextContent  = () => root.value.textContent
    const getScrollHeight = () => root.value.scrollHeight

    return {
      root,
      blur,
      focus,
      getInnerText,
      getInnerHTML,
      getChildNodes,
      getChildNodeAt,
      getTextContent,
      getScrollHeight,
    }
  }
})
</script>

<style lang="scss" scoped>
body.light-theme {
  pre {
    background: $windowLightBackgroundEditor;
  }
}
body.dark-theme {
  pre {
    background: $windowDarkBackgroundEditor;
  }
}

pre {
  margin: 0 $windowScrollbarWidth $windowScrollbarWidth $windowScrollbarWidth;
  padding: 12px 15px 12px;
  text-align: left;
  white-space: pre-wrap;
  font: inherit;
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
</style>