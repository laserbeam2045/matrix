<template>
  <div class="quiz-list-query">
    <p class="hit-count">
      HIT：<AppInputNumber :value="filteredQuizzes.length" />
    </p>
    <AppInputText
      v-model:value="valueRef"
      placeholder="search"
      @keydown="onKeydown"
      @input="onInput"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from 'vue'
import { useAudio, AUDIOS } from 'store/useAudio'
import _ from 'lodash'

export default defineComponent({
  setup() {
    const { playAudio } = useAudio()

    const searchQuery = inject('searchQuery')
    const filteredQuizzes = inject('filteredQuizzes')

    const valueRef = ref(searchQuery.value)

    // MEMO: 入力時(全角の未確定入力時を除く)に、queryをemitしたい
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
      searchQuery.value = valueRef.value
    }, 200)

    const onClickTag = (id: number) => {
      playAudio(AUDIOS.ETC.CYBER_15_2)
      id// store.toggleActiveTagId(id)
    }

    return {
      filteredQuizzes,
      valueRef,
      onKeydown,
      onInput,
      onClickTag,
    }
  },
})
</script>

<style lang="scss" scoped>
.quiz-list-query {
  height: auto;
  padding: 0 0 15px;
  margin: 0 auto;
  border-bottom: 1px solid;

  .hit-count {
    display: inline-block;
    width: 90px;
    margin: 0 0 0 -80px;
    text-align: left;

    & > * {
      color: orange;
    }
  }
  // & ::v-deep(input) {
  //   width: 150px;
  // }
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
