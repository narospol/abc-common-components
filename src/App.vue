<script>
import AbcSelect from "./components/AbcSelect";
import AbcInput from "./components/AbcInput";
import AlertModal from "./components-testing/AlertModal";

export default {
  name: "app",
  components: {
    AbcSelect,
    AbcInput,
    AlertModal
  },
  data() {
    return {
      price: "0",
      alert: {
        show: false,
        title: "Alert Modal",
        subtitle: "test backdrop clickable"
      }
    }
  },
  methods: {}
};
</script>

<template>
  <div id="app">
    Abc common components
    <br />
    <alert-modal :data="alert" />
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
