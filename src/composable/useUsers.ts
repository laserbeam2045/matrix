import { Ref, ref, unref, onMounted, watch } from 'vue'
import { fetchUsers } from 'api/users'
import { Users } from 'types/users'

export default function useUsers(userIds: Array<number>) {
  const users: Ref<Users | undefined> = ref([])

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
