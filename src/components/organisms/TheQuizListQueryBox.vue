<template>
  <div id="query-box">
    <p id="hit-count">HIT：
      <BaseInputNumber :value="hitCount" />
    </p>
    <BaseInputText
      v-model:value="valueRef"
      placeholder="search"
      @change="$emit('update:query', valueRef)"
      @keydown.enter="$emit('update:query', valueRef)"
    />
    <div id="selected-tag-box">
      <QuizTag
        v-for="tagId in activeTagIds"
        :key="'active-' + tagId"
        :id="tagId"
        @click="onClickTag($event)"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useStore as useSound, AUDIOS } from '@/store/audio'
import BaseInputNumber from '@/components/atoms/BaseInputNumber'
import BaseInputText from '@/components/atoms/BaseInputText'
import QuizTag from '@/components/organisms/QuizTag'

export default defineComponent({
  name: 'TheQuizListQueryBox',
  components: {
    BaseInputText,
    BaseInputNumber,
    QuizTag,
  },
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
  setup(props) {
    const { playAudio } = useSound()

    const valueRef = ref(props.query)

    const onClickTag = id => {
      playAudio(AUDIOS.ETC.CYBER_15_2)
      id// store.toggleActiveTagId(id)
    }

    return {
      activeTagIds: [],
      onClickTag,
      valueRef,
    }
  },
})
</script>

<style lang="scss" scoped>
#query-box {
  height: auto;
  margin: 0 auto -1px;
  padding: 0;
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
    box-sizing: border-box;
    transition: all .5s;

    .quiz-tag {
      margin: 8px 3px 0;
    }
  }
}
</style>