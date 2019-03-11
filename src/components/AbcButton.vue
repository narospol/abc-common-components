<script>
export default {
  methods: {
    onButtonClicked(event) {
      this.$emit("click", event);
    }
  }
};
</script>

<template>
  <button type="button" class="abc-button" @click="onButtonClicked">
    <slot />
  </button>
</template>

<style lang="scss">
@import "../assets/styles/variables";

.abc-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 128px;
  min-height: 36px;
  font-size: 1.5rem;
  font-family: $fontScb;
  line-height: 1rem;
  color: $colorPurpleLight;
  background-color: white;
  border: 1px solid $colorPurpleLight;
  border-radius: 2px;
  outline: none;
  user-select: none;
  cursor: pointer;
  &.--fill {
    color: white;
    background-color: $colorPurpleLight;
    border: 1px solid transparent;
  }
  &.--round {
    border-radius: 20px;
  }

  // Color button
  &.--color-gold {
    color: $colorGoldDark;
    border: 1px solid $colorGoldDark;
    &.--fill {
      color: white;
      background-color: $colorGoldDark;
      border: 1px solid transparent;
    }
  }
}
</style>
