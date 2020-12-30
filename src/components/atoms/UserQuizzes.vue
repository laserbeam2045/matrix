<script>
import { toRefs } from 'vue'
import useUserQuizzes from '@/composables/useUserQuizzes'
import useQuizStringSearch from '@/composables/useQuizStringSearch'
import useQuizFilters from '@/composables/useQuizFilters'

export default {
  props: {
    user: {
      type: Object,
      required: false,
      default() {
        return {
          name: 'master',
        }
      },
    },
  },
  setup(props) {
    const { user } = toRefs(props)

    const { quizzes, getUserQuizzes } = useUserQuizzes(user)

    const {
      searchQuery,
      quizzesMatchingSearchQuery
    } = useQuizStringSearch(quizzes)

    const {
      filters,
      activeTagIds,
      updateFilters,
      filteredQuizzes,
    } = useQuizFilters(quizzesMatchingSearchQuery)

    return {
      quizzes: filteredQuizzes,
      getUserQuizzes,
      searchQuery,
      filters,
      activeTagIds,
      updateFilters,
    }
  }
}
</script>