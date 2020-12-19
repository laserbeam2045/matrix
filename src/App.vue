<template>
  <div v-if="error">{{ error.message }}</div>
  <Suspense v-else>
    <template #default>
      <AppContents />
    </template>
    <template #fallback>
      <div class="loading">Loading...</div>
    </template>
  </Suspense>
</template>

<script>
import { defineComponent, ref } from 'vue'
import AppContents from '@/pages/AppContents'

export default defineComponent({
  components: {
    AppContents,
  },
  setup() {
    const error = ref(null)

    // TODO: ErrorHandling
    return { error }
  },
})
</script>

<style lang="scss">
@import '@/assets/style/colors';
@import '@/assets/style/text';

html, body, #app {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  touch-action: manipulation;
}

h1, h2, h3, h4, h5, h6 {
  margin: 0;
  font-family: $fontFamily3;
}

p {
  margin: 0;
  font-family: $fontFamily1;
}

table {
  border-collapse: collapse;
  th {
    user-select: none;
  }
}

button {
  user-select: none;
}

ul {
  list-style: none;
}

body {
  &.light-theme {
    background: white;
    color: 'black';
  }
  &.dark-theme {
    background: black;
    color: $blueLikeColor6;
  }
  .loading {
    top: 40%;
    position: relative;
    text-align: center;
  }
}
</style>