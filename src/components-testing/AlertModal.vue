<script>
import AbcModal from "../components/AbcModal";

export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    AbcModal
  },
  methods: {
    onCloseClicked() {
      this.data.show = false;
    }
  }
};
</script>

<template>
  <abc-modal :show="data.show" @backdropClicked="onCloseClicked">
    <div class="abc-modal-wrapper">
      <div class="abc-alert-modal">
        <div class="modal-close-button" @click="onCloseClicked">
          X
        </div>
        <div class="modal-content">
          <div class="modal-title">
            {{ data.title }}
          </div>
          <div class="modal-symbol">
            <img src="https://us.123rf.com/450wm/pixelae/pixelae1612/pixelae161200009/68974872-red-triangle-caution-warning-alert-sign-vector-illustration-isolated-on-white-background-be-careful-.jpg?ver=6" alt="caution" />
          </div>
          <div class="modal-subtitle">
            {{ data.subtitle }}
          </div>
        </div>
      </div>
    </div>
  </abc-modal>
</template>

<style lang="scss">

.abc-modal-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
}

.abc-alert-modal {
  position: relative;
  width: 380px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: white;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  .modal-close-button {
    $buttonSize: 24px;
    position: absolute;
    top: $buttonSize * -0.5;
    right: $buttonSize * -0.5;
    width: $buttonSize;
    height: $buttonSize;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffcb57;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    &:hover {
      background-color: #eaa712;
    }
  }
  .modal-content {
    display: flex;
    flex-direction: column;
    .modal-title {
      width: 100%;
      font-size: 1.5rem;
      font-weight: 500;
    }
    .modal-symbol {
      width: 64px;
      height: 64px;
      margin: 0 auto;
      user-select: none;
      img {
        widows: 100%;
        height: 100%;
        min-width: unset;
        min-height: unset;
      }
    }
    .modal-subtitle {
      width: 100%;
      font-size: 1.5rem;
    }
  }
}
</style>
