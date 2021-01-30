<template>
  <div v-on="windowEvents">
    <AppVirtualWindow
      v-model:top="windowState.top"
      v-model:left="windowState.left"
      v-model:width="windowState.width"
      v-model:height="windowState.height"
      v-bind="windowState"
    >
      <template #header>
        <AppHeaderItemBox>
          <AppHeaderItem
            name="times"
            @click="closeWindow"
          />
        </AppHeaderItemBox>
      </template>
      <template #default>
        <AppScrollable
          :width="windowState.width"
          :height="windowState.height"
        >
          <div class="user-data">
            <ul class="menu">
              <li>Profile</li>
              <li>Quiz</li>
            </ul>
            <p class="name">
              <span class="green">CODE_NAME</span><br>{{ user.profile.name }}
            </p>
            <img
              class="icon"
              :src="user.profile.iconSource"
            >
            <p class="board">
              {{ user.profile.bulletinBoard }}
            </p>
          </div>
        </AppScrollable>
      </template>
    </AppVirtualWindow>

    <TheQuiz :user="user" />
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'
import { MOUSE_TOUCH_EVENT } from '@/utilities/v_event_functions'
import TheQuiz from '@/components/TheQuiz'

export default defineComponent({
  components: {
    TheQuiz,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  emits: [
    'touch',
    'close',
  ],
  setup(props, { emit }) {
    const windowState = reactive({
      top: 'center',
      left: 'center',
      width: 'auto',
      height: 'auto',
      draggable: true,
      legend: {
        text: 'UserData',
        type: 'inside',
      },
    })
    const windowEvents = {
      [`${MOUSE_TOUCH_EVENT.START}Passive`]() { emit('touch') },
    }

    const closeWindow = () => emit('close')

    return {
      windowState,
      windowEvents,
      closeWindow,
    }
  }
})
</script>

<style lang="scss" scoped>
.user-data {
  min-width: 280px;
  padding: 0px 20px 50px;
  border-top: 1px solid;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);

  .menu {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;

    li {
      flex-basis: 100px;
      flex-grow: 1;
      padding: 5px 0;
      // color: limegreen;

      &:first-child {
        // @include textStyleA;
      border-bottom: 1px solid;
      }
    }
  }

  .icon {
    display: inline-block;
    max-width: 50px;
    max-height: 50px;
    margin: 0 0 0 20px;
    box-shadow: 0 0 5px white;
    border-radius: 7px;
    vertical-align: middle;
  }

  .name {
    display: inline-block;
    vertical-align: middle;
    font-size: 1rem;
    font-family: $font-family-electrolize;

    .green {
      display: inline-block;
      margin-bottom: 5px;
      font-size: 0.9rem;
      font-family: $font-family-orbitron;
    }
  }

  .board {
    margin: 30px 0 0;
  }

  .green {
    color: limegreen;
  }
}
</style>