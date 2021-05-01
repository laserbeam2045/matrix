<template>
  <div v-on="windowEvents">
    <AppVirtualWindow legend="UserData">
      <template #buttons>
        <AppHeaderItem name="times" @click="closeWindow" />
      </template>
      <template #default>
        <AppScrollable>
          <div class="user-data">
            <ul class="menu">
              <li>Profile</li>
              <li>Quiz</li>
            </ul>
            <p class="name">
              <span class="green">CODE_NAME</span><br>
              {{ user.profile.name }}
            </p>
            <img class="icon" :src="user.profile.iconSource">
            <p class="board">
              {{ user.profile.bulletinBoard }}
            </p>
          </div>
        </AppScrollable>
      </template>
    </AppVirtualWindow>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { MOUSE_TOUCH_EVENT } from '@/utilities/v_event_functions'

export default defineComponent({
  props: {
    user: {
      type    : Object,
      required: true,
    },
  },
  emits: [
    'touch',
    'close',
  ],
  setup(props, { emit }) {
    const windowEvents = {
      [`${MOUSE_TOUCH_EVENT.START}Passive`]() { emit('touch') },
    }

    const closeWindow = () => emit('close')

    return {
      windowEvents,
      closeWindow,
    }
  },
})
</script>

<style lang="scss" scoped>
.user-data {
  min-width: 280px;
  padding: 0 20px 50px;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
  border-top: 1px solid;

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
    vertical-align: middle;
    border-radius: 7px;
    box-shadow: 0 0 5px white;
  }

  .name {
    display: inline-block;
    font-family: $font-family-electrolize;
    font-size: 1rem;
    vertical-align: middle;

    .green {
      display: inline-block;
      margin-bottom: 5px;
      font-family: $font-family-orbitron;
      font-size: 0.9rem;
    }
  }

  .board {
    margin: 30px 0 0;
  }

  // .green {
  //   color: limegreen;
  // }
}
</style>
