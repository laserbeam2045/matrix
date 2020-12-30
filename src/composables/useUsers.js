import { fetchUsers } from '@/api/users'
import { ref, unref, onMounted, watch } from 'vue'

export default function useUsers(userIds) {
  const users = ref([])
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