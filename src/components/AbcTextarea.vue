<script>
export default {
  props: {
    value: [String, Number]
  },
  methods: {
    onInputUpdated(event) {
      const { value } = event.target;
      this.$emit("input", value);
    }
  }
};
</script>

<template>
  <textarea
    class="abc-textarea"
    :value="value"
    autoComplete="off"
    @input="onInputUpdated"
  ></textarea>
</template>

<style lang="scss">
@import "../assets/styles/variables";

.abc-textarea {
  display: flex;
  padding: 0.25rem 0.8rem;
  font-size: 1.5rem;
  line-height: 1.5;
  width: 100%;
  font-family: $fontScb;
  color: black;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #bbbbbb;
  border-radius: 6px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  box-sizing: border-box;
  outline: none;
  resize: vertical;
  &::placeholder {
    color: #cccccc;
  }
}
</style>
