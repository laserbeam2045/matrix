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

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useAudio, AUDIOS } from 'store/useAudio'
import useUsers from 'composable/useUsers'
import UserData from './UserData.vue'

export default defineComponent({
  name      : 'TheUser',
  components: {
    UserData,
  },
  emits: ['touch'],
  setup() {
    const userIds = computed(() => [0])

    const { users } = useUsers(userIds.value)

    const { playAudio } = useAudio()

    // ウィンドウを閉じる処理
    const closeWindow = () => {
      playAudio(AUDIOS.ETC.CYBER_04_1)
    }

    return { users, closeWindow }
  },
})
</script>
