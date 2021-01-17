<template>
  <div>
    <pre>{{ valueString }}</pre>
  </div>
</template>

<script>
export default {
  name: "RawDisplayer",
  props: {
    value: {
      required: true,
    }
  },
  computed: {
    valueString() {
      return JSON.stringify(this.value, null, 2);
    }
  }
};
</script>

<style scoped>
pre {
  width: 300px;
  text-align: start;
  position: fixed;
  top: 50px;
  left: 20px;
  background: #ccc;
  z-index: -20;
}
</style>