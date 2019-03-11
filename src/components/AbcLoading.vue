<script>
export default {
  props: {
    loadingImage: {
      type: String,
      default: ""
    }
  }
};
</script>

<template>
  <div class="abc-loading">
    <img :src="loadingImage" alt="Loading" />
  </div>
</template>

<style lang="scss">
.abc-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  img {
    $loadingSize: 200px;
    width: $loadingSize;
    height: $loadingSize;
  }
}
</style>
