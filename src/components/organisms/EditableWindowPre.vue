<template>
  <pre
    v-if="htmlString"
    v-html="htmlString"
    ref="pre1"
    :spellcheck="spellcheck"
    v-on="listeners"
  ></pre>
  <pre
    v-else
    ref="pre2"
    :spellcheck="spellcheck"
    v-on="listeners"
  ><slot></slot></pre>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'EditableWindowPre',
  props: {
    htmlString: {
      type: [String, Boolean],
      required: false,
      default: false,
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
  setup(props) {
    const pre1 = ref(null)
    const pre2 = ref(null)

    const realPre = computed(() => {
      return props.htmlString ? pre1.value : pre2.value
    })

    const blur            = () => realPre.value.blur()
    const focus           = () => realPre.value.focus()
    const getInnerText    = () => realPre.value.innerText
    const getInnerHTML    = () => realPre.value.innerHTML
    const getChildNodes   = () => realPre.value.childNodes
    const getChildNodeAt  = idx => realPre.value.childNodes.item(idx)
    const getTextContent  = () => realPre.value.textContent
    const getScrollHeight = () => realPre.value.scrollHeight

    return {
      pre1,
      pre2,
      blur,
      focus,
      getInnerText,
      getInnerHTML,
      getChildNodes,
      getChildNodeAt,
      getTextContent,
      getScrollHeight,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/window';

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