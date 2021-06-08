import TheMatrix3 from 'components/TheMatrix3.vue'
import TheAudios  from 'components/TheAudios.vue'
import TheButtons from 'components/TheButtons.vue'
import TheEditor  from 'components/editor/TheEditor.vue'
import GPT2       from 'components/editor/GPT2.vue'
import TheUser    from 'components/user/TheUser.vue'
import TheQuiz    from 'components/quiz/TheQuiz.vue'

export const windowNameKinds = [
  'THE_MATRIX',
  'THE_AUDIO',
  'THE_BUTTON',
  'THE_EDITOR',
  'THE_GPT_2',
  'THE_USER',
  'THE_QUIZ',
] as const

export const windowKinds = [
  TheMatrix3,
  TheAudios,
  TheButtons,
  TheEditor,
  GPT2,
  TheUser,
  TheQuiz,
]

export type WindowName = typeof windowNameKinds[number]

export type Window = typeof windowKinds[number]

export interface Windows {
  // [WindowName]: InstanceType<typeof Window>
  THE_MATRIX  : InstanceType<TheMatrix3>
  THE_AUDIO   : InstanceType<TheAudios>
  THE_BUTTON  : InstanceType<TheButtons>
  THE_EDITOR  : InstanceType<TheEditor>
  THE_GPT_2   : InstanceType<GPT2>
  THE_USER    : InstanceType<TheUser>
  THE_QUIZ    : InstanceType<TheQuiz>
}
