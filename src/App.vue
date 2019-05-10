<script>
import AbcSelect from "./components/AbcSelect";
import AbcInput from "./components/AbcInput";

export default {
  name: "app",
  components: {
    AbcSelect,
    AbcInput,
  },
  data() {
    return {
      price: "0"
    }
  },
  methods: {}
};
</script>

<template>
  <div id="app">
    Abc common components
    <br />
  </div>
</template>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
