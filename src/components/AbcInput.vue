<script>
import {
  numbersToCurrency,
  addThousandSeparator,
  unFormat
} from "./../utils.js";

export default {
  props: {
    value: [String, Number],
    precision: {
      type: Number,
      default: 0
    },
    currencyFormat: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentValue: ""
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        this.updateCurrentValue(value);
      }
    }
  },
  methods: {
    updateInputElement() {
      const el = this.$el;
      if (!el) return;

      let positionFromEnd = el.value.length - el.selectionEnd;
      el.value = this.currentValue;
      positionFromEnd = el.value.length - positionFromEnd;
      const setSelectionRange = position =>
        el.setSelectionRange(position, position);
      if (el === document.activeElement) {
        setSelectionRange(positionFromEnd);
        setTimeout(setSelectionRange.bind(this, positionFromEnd), 1); // Android Fix
      }
    },
    updateCurrentValue(value) {
      if (this.currencyFormat) {
        this.currentValue = this.setCurrencyFormat(value, this.precision);
        const unformatValue = unFormat(`${value}`);
        this.$emit("input", unformatValue);
        this.updateInputElement();
      } else {
        this.currentValue = value;
        this.$emit("input", value);
      }
    },
    setCurrencyFormat(value, precision) {
      const str = value ? value.toString() : "";
      const number = str.replace(/\D+/g, "") || "0";
      const currency = numbersToCurrency(number, precision);
      const parts = `${currency}`.split(".");
      let [integer, decimal] = parts;
      integer = addThousandSeparator(integer);
      return decimal ? `${integer}.${decimal}` : `${integer}`;
    },
    onInputUpdating(event) {
      const { value } = event.target;
      this.updateCurrentValue(value);
    }
  }
};
</script>

<template>
  <input
    class="abc-input"
    :value="currentValue"
    autoComplete="off"
    @input="onInputUpdating"
  />
</template>

<style lang="scss">
@import "../assets/styles/variables";

.abc-input {
  display: flex;
  width: 100%;
  height: 40px;
  font-family: $fontScb;
  padding: 0.25rem 0.8rem;
  font-size: 1.5rem;
  line-height: 1.5;
  width: 100%;
  font-family: $fontScb;
  color: black;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 6px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  box-sizing: border-box;
  outline: none;
  &:read-only {
    cursor: not-allowed;
    background-color: #e9ecef;
  }
  &::placeholder {
    color: #cccccc;
  }
}
</style>
