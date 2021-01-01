<template>
  <div id="query-box">
    <p id="hit-count">
      HIT：<InputNumberAtom :value="hitCount" />
    </p>
    <InputTextAtom
      v-model:value="valueRef"
      placeholder="search"
      @keydown="onKeydown"
      @input="onInput"
    />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useStore as useSound, AUDIOS } from '@/store/audio'
import _ from 'lodash'

export default defineComponent({
  name: 'TheQuizListQueryBox',
  props: {
    hitCount: {
      type: Number,
      required: true,
    },
    query: {
      type: String,
      required: true,
    },
  },
  emits: [ 'update:query' ],

  setup(props, { emit }) {
    const { playAudio } = useSound()

    const valueRef = ref(props.query)

     //MEMO: 入力時(全角の未確定入力時を除く)に、queryをemitしたい
    const onKeydown = () => {
      if (event.isComposing === true && event.key === 'Enter') {
        updateQuery()
      }
    }
    const onInput = () => {
      if (event.isComposing === false || event.data === null) {
        updateQuery()
      }
    }
    const updateQuery = _.debounce(() => {
      emit('update:query', valueRef.value)
    }, 200)

    const onClickTag = id => {
      playAudio(AUDIOS.ETC.CYBER_15_2)
      id// store.toggleActiveTagId(id)
    }

    return {
      valueRef,
      onKeydown,
      onInput,
      onClickTag,
    }
  }
})
</script>

<style lang="scss" scoped>
#query-box {
  height: auto;
  margin: 0 auto -1px;
  border-bottom: 1px solid;

  #hit-count {
    width: 90px;
    margin: 0 0 0 -80px;
    display: inline-block;
    text-align: left;

    & > * {
      color: orange;
    }
  }
  & ::v-deep(input) {
    width: 150px;
  }
  #selected-tag-box {
    height: auto;
    padding: 2px 10px 10px;
    transition: all .5s;

    .quiz-tag {
      margin: 8px 3px 0;
    }
  }
}
</style>