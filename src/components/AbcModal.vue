<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number,
      default: 9995
    }
  },
  methods: {
    onBackdropClicked() {
      this.$emit("backdropClicked");
    },
    onContentBodyClicked(event) {
      const targetElement = event.target;
      const backdropElement = this.$refs.backdrop;
      const isBackdropClick = targetElement === backdropElement;
      isBackdropClick && this.onBackdropClicked();
    }
  }
};
</script>

<template>
  <transition name="modal">
    <div v-show="show" :style="{ zIndex }" class="modal-mask">
      <div class="modal">
        <div ref="backdrop" class="modal-guts" @click="onContentBodyClicked">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss">
@import "../assets/styles/variables";

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
  .modal {
    display: block;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 100;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .modal .modal-guts {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
  }
}

.modal-enter {
  opacity: 0;
}
.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
