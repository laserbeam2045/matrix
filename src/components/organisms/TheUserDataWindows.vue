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
import { useStore as useMatrix, WINDOWS } from '@/store/matrix'
import { useStore as useAudio, AUDIOS } from '@/store/audio'
import UserData from '@/components/organisms/UserData'
import useUsers from '@/composables/useUsers'

export default defineComponent({
  name: 'TheUserDataWindows',
  components: { UserData },
  emits: [ 'touch' ],
  setup() {
    const matrix = useMatrix()

    const userIds = computed(() => matrix.state[WINDOWS.THE_USER_DATA].userIds)

    const { users } = useUsers(userIds)

    const { playAudio } = useAudio()

    // ウィンドウを閉じる処理
    const closeWindow = ({ id }) => {
      userIds.value.delete(id)
      if (!userIds.value.size) {
        matrix.deactivate(WINDOWS.THE_USER_DATA)
      }
      playAudio(AUDIOS.ETC.CYBER_04_1)
    }

    return { users, closeWindow }
  }
})
</script>