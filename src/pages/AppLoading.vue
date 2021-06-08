<template>
  <h2 id="app-loading">
    <span class="char">L</span>
    <span class="char">o</span>
    <span class="char">a</span>
    <span class="char">d</span>
    <span class="char">i</span>
    <span class="char">n</span>
    <span class="char">g</span>
    <span class="char">...</span>
  </h2>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({

})
</script>

<style lang="scss" scoped>
#app-loading {
  @include center;

  font-family: $font-family-consolas;
  font-size: 3rem;

  .char {
    animation: loading 3s linear infinite;

    @for $i from 1 through 8 {
      &:nth-child(#{$i}) {
        animation-delay: #{$i * 0.1}s;
      }
    }
  }
}
</style>
