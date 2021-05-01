<template>
  <button class="app-button-neon">
    <slot />
  </button>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.app-button-neon {
  position: relative;
  padding: 10px 30px;
  font-family: $font-poppins;
  font-size: 20px;
  color: $blue-sparky;
  letter-spacing: 2px;
  outline: none;
  transition: 0.3s;
  -webkit-box-reflect: below 1px linear-gradient(transparent, #0003);

  &.-pink {
    filter: hue-rotate(115deg);
  }
  &.-green {
    filter: hue-rotate(270deg);
  }

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 10px;
    height: 10px;
    content: '';
    border-top: 2px solid $blue-sparky;
    border-left: 2px solid $blue-sparky;
    transition: 0.5s;
    transition-delay: 0.5s;
    transition-delay: 0.3s;
  }
  &::after {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 10px;
    height: 10px;
    content: '';
    border-right: 2px solid $blue-sparky;
    border-bottom: 2px solid $blue-sparky;
    transition: 0.5s;
    transition-delay: 0.3s;
  }

  &:hover {
    color: $black-dreamless;
    background: $blue-sparky;
    box-shadow: 0 0 50px $blue-sparky;
    transition-delay: 0.3s;

    &::before,
    &::after {
      width: 100%;
      height: 100%;
      transition-delay: 0s;
    }
  }
}
</style>
