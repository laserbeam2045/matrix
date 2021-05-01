<template>
  <div>
    <UserData
      v-for="user in users"
      :key="user.id"
      :user="user"
      @touch="$emit('touch')"
      @close="closeWindow(user)"
    />
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore as useAudio, AUDIOS } from '@/store/audio'
import useUsers from '@/composables/useUsers'
import UserData from './UserData'

export default defineComponent({
  components: {
    UserData,
  },
  emits: ['touch'],
  setup() {
    const userIds = computed(() => [0])

    const { users } = useUsers(userIds)

    const { playAudio } = useAudio()

    // ウィンドウを閉じる処理
    const closeWindow = () => {
      playAudio(AUDIOS.ETC.CYBER_04_1)
    }

    return { users, closeWindow }
  },
})
</script>
