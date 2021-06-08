
// store/useAudio.ts
// ${API_ROOT}/path/audios/select.php
export interface Audio {
  path: string
  fileName: string
  extension: string
  volume: number
  label: string
}

export type Audios = Array<Audio>

// src/api/quizzes.js
export interface Quiz {
  id: number
  question: string
  answer1: string
  answer2: string
  pressPoint: number
  tagIds: Array<number>
}

export type Quizzes = Array<Quiz>

// src/api/tags.js
export type Tag = {
  id: number
  lft: number
  label: string
  parentId: number
  children: Array<Tag>
  quizCount: number
}

export type Tags = Array<Tag>
