import { ref, unref, onMounted, watch } from 'vue'
import { fetchUsers } from '@/api/users'
import '@types/events'

export default function useUsers(userIds: Array<number>) {
  const users: UsersRef = ref([])

  const getUsers = async () => {
    users.value = await fetchUsers(unref(userIds))
  }

  onMounted(getUsers)
  watch(userIds, getUsers)

  return {
    users,
    getUsers,
  }
}
