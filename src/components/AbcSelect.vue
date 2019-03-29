<script>
import { getPropertyFromItem } from "./../utils.js";
import { debounce } from "debounce";
import VirtualList from "vue-virtual-scroll-list";
import Fuse from "fuse.js";

const compareUpperCase = (a = "", b = "", equaly = true) => {
  let result = false;
  if (typeof a === "string" && typeof b === "string") {
    result = a.toUpperCase() === b.toUpperCase();
  } else {
    result = a === b;
  }
  return equaly ? result : !result;
};

export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    itemText: {
      type: String,
      default: ""
    },
    itemValue: {
      type: String,
      default: ""
    },
    // key for display to input tag
    itemDisplay: {
      type: String,
      default: ""
    },
    itemHeight: {
      type: Number,
      default: 40
    },
    numberOfItemDisplay: {
      type: Number,
      default: 4
    },
    value: {
      type: [String, Number, Object, Array],
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: "field-name"
    },
    // see: https://fusejs.io
    filterOptions: {
      type: Object,
      default: null
    },
    errorsObject: {
      type: Object,
      default: () => ({ items: [] })
    },
    errorText: {
      type: String,
      default: ""
    },
    borderError: {
      type: Boolean,
      default: false
    },
    showError: {
      type: Boolean,
      default: true
    }
  },
  components: {
    VirtualList
  },
  data() {
    return {
      isOpen: false,
      isLoading: false,
      text: "",
      previousSearch: "",
      inputValue: this.value,
      allowTyping: true,
      cachedItems: [],
      selectionItems: [],
      selectedItems: [],
      activeIndex: -1,
      removeCounting: 0,
      positionOfSelection: 40,
      page: 1,
      numberPerPage: 20
    };
  },
  watch: {
    inputValue: {
      handler(val) {
        if (val !== this.value) {
          this.$emit("input", val);
        }
      }
    },
    value: {
      handler(val) {
        if (val !== this.inputValue) {
          this.inputValue = val;
          this.setDefaultSelected();
        }
      }
    },
    items: {
      immediate: true,
      handler(val) {
        if (val) {
          // items changed => initialize
          setTimeout(this.initialize.bind(this, val), 100);
        }
      }
    },
    isOpen: {
      handler(val) {
        if (document) {
          if (val) {
            document.addEventListener("keyup", this.onDocumentKeyUp);
            document.addEventListener("click", this.onDocumentClick);
          } else {
            document.removeEventListener("keyup", this.onDocumentKeyUp);
            document.removeEventListener("click", this.onDocumentClick);
          }
        }
      }
    }
  },
  methods: {
    initialize(value) {
      // Filter duplicate item
      const items = this.filterDuplicates(value);
      this.cachedItems = [];
      this.cachedItems = items.map((x, index) => {
        return { data: { ...x }, selected: false, cacheIndex: index };
      });
      this.setDefaultSelected();
    },
    setDefaultSelected() {
      this.cachedItems.forEach(item => {
        const itemValue = this.getValue(item.data);
        const currentValue = this.getValue(this.value);
        let selected = currentValue !== undefined && compareUpperCase(currentValue, itemValue) // eslint-disable-line
        item.selected = selected;
      });
      this.updateSelectionItems();
      this.selectedItems = this.selectionItems.filter(x => x.selected);

      if (this.selectedItems.length === 1) {
        // single selection mode & one item selected
        this.onItemSelected(this.selectedItems[0]);
      } else {
        this.updateTextField();
      }
    },
    setInputValueUpdated() {
      let value = "";
      const selectedItems = this.selectedItems.map(x => x.data);
      const [firstItem] = selectedItems;
      if (firstItem) {
        value = this.getValue(firstItem);
      }
      this.inputValue = value;
      this.$emit("change", value);
    },
    onDocumentKeyUp(event) {
      const { key } = event;
      switch (key) {
        case "Enter": {
          const activeItem = this.selectionItems[this.activeIndex];
          if (activeItem) {
            this.onItemSelected(activeItem);
          }
          break;
        }
        case "Escape": {
          this.hide();
          break;
        }
        case "ArrowUp": {
          const index = this.activeIndex;
          this.activeIndex = index > 0 ? index - 1 : index;
          this.updateSelectionScroll();
          break;
        }
        case "ArrowDown": {
          const index = this.activeIndex;
          this.activeIndex = index < this.selectionItems.length - 1 ? index + 1 : index // eslint-disable-line
          this.updateSelectionScroll();
          break;
        }
        default:
          // console.log("onKeyUp ", event)
          break;
      }
    },
    onDocumentClick(event) {
      const el = this.$refs.selectionControl;
      const isContains = event.path.filter(p => p === el).length > 0;
      if (el && !isContains) {
        this.hide();
      }
    },
    onOpenMenuClicked(isIconClicked) {
      if (isIconClicked) {
        this.toggle();
      } else {
        !this.isOpen && this.toggle();
      }
    },
    onTextInputChanged: debounce(function(event) {
      const key = event.key;
      const text = event.target.value || "";
      // if search is changed then reset page to 1
      if (this.previousSearch !== text) {
        this.page = 1;
      }

      // Remove item selected
      const isRemove = key === "Backspace" && text === "";
      if (isRemove) {
        const { data: removeData = "" } = this.selectedItems.pop() || {};
        const index = this.cachedItems.findIndex(x => x.data === removeData);
        if (index !== -1) {
          this.cachedItems[index].selected = false;
          this.setInputValueUpdated();
        }
      }
      const items = this.filterItemsWithText(text);
      this.updateSelectionItems(items);
      this.previousSearch = text;
    }, 500),
    onItemSelected(item) {
      const { cacheIndex: index } = item;
      const totalItem = this.cachedItems.length;
      this.text = "";
      // Set items selected to false
      for (let i = 0; i < totalItem; ++i) {
        this.cachedItems[i].selected = false;
      }
      this.cachedItems[index].selected = !this.cachedItems[index].selected;
      this.updateSelectedItem();
      this.hide();
      this.setInputValueUpdated();
    },
    onNextPage() {
      const items = this.filterItemsWithText();
      const isMorePage = items.length > this.numberPerPage * (this.page + 1);
      if (!this.isLoading && isMorePage) {
        this.isLoading = true;
        this.page = this.page + 1;
        setTimeout(() => {
          this.updateSelectionItems();
          this.isLoading = false;
        }, 500);
      }
    },
    filterItemsWithText(text = this.text) {
      let items = [...this.cachedItems];
      if (text !== "") {
        const options = this.filterOptions
          ? this.filterOptions
          : { keys: [`data.${this.itemText}`] };
        const fuse = new Fuse(items, options);
        const filterItems = fuse.search(text);
        items = [...filterItems];
      }
      return items;
    },
    updateSelectionScroll() {
      const [activeOption] = this.$refs.options.filter(e => e.className.includes("-active"));
      if (activeOption) {
        const itemHeight = activeOption.clientHeight;
        const scrollTop = itemHeight * this.activeIndex;
        const virtualList = this.$refs.virtualList;
        virtualList.$el.scrollTop = scrollTop;
      }
    },
    updateSelectedItem() {
      this.selectedItems = this.cachedItems.filter(x => x.selected);
    },
    updateTextField() {
      const [item] = this.selectedItems;
      if (item) {
        const key = this.itemDisplay === "" ? this.itemText : this.itemDisplay;
        this.text = this.getText(item.data, key);
      } else {
        this.text = "";
      }
    },
    updateSelectionItems(items = this.filterItemsWithText()) {
      // Update item with page
      const amountOfItem = this.numberPerPage * this.page;
      if (amountOfItem <= items.length) {
        this.selectionItems = items.filter((x, i) => i < amountOfItem);
      }
    },
    updateSelectionPosition() {
      setTimeout(() => {
        const $selectionControl = this.$refs.selectionControl;
        if ($selectionControl) {
          const height = $selectionControl.offsetHeight;
          this.positionOfSelection = height;
        }
      }, 0);
    },
    toggle() {
      this.isOpen ? this.hide() : this.open();
    },
    open() {
      this.isOpen = true;
      this.focusTextInput();
      this.updateSelectionItems();
    },
    hide() {
      const input = this.$refs.textInput;
      input && input.blur();
      this.isOpen = false;
      this.activeIndex = -1;
      this.page = 1;
      this.previousSearch = "";
      this.updateTextField();
    },
    focusTextInput() {
      const input = this.$refs.textInput;
      input && input.focus();
    },
    filterDuplicates(arr) {
      const uniqueValues = new Map();
      for (let index = 0; index < arr.length; ++index) {
        const item = arr[index];
        const val = this.getValue(item);
        !uniqueValues.has(val) && uniqueValues.set(val, item);
      }
      return Array.from(uniqueValues.values());
    },
    getValue(item) {
      return getPropertyFromItem(item, this.itemValue, this.getText(item));
    },
    getText(item, key = this.itemText) {
      return getPropertyFromItem(item, key, item);
    },
    getErrorMessage() {
      let msg = "";
      const { items } = this.errorsObject;
      const [errorField] = items.filter(err => err.field === this.name);
      if (errorField) {
        if (this.errorText) {
          msg = this.errorText;
        }
      }
      return msg;
    }
  }
};
</script>

<template>
  <div ref="selectionControl" class="selection-control">
    <div :class="{ '-error': borderError }" class="controls">
      <div class="input-wrapper" @click="onOpenMenuClicked(false)">
        <input
          ref="textInput"
          v-model="text"
          :placeholder="selectedItems.length > 0 ? '' : placeholder"
          :readonly="!allowTyping"
          class="input-text"
          type="text"
          @keyup="onTextInputChanged"
        />
      </div>
      <div id="selection-dropdown-icon" class="icon-wrapper" @click="onOpenMenuClicked(true)">
        <div v-if="isLoading" class="spinner">
          <div class="clip"></div>
        </div>
        <v-icon v-else :class="{ '-flip': isOpen }" name="dropdown" class="icon" scale="1.6" />
      </div>
      <div v-if="isOpen" :style="{ top: `${positionOfSelection}px` }" class="selection">
        <div v-if="selectionItems.length === 0" class="selection-list-empty">
          No data
        </div>
        <div v-else class="selection-list" :style="{ maxHeight: `${itemHeight * numberOfItemDisplay}px` }">
          <virtual-list ref="virtualList" :size="itemHeight" :remain="numberOfItemDisplay" :tobottom="onNextPage">
            <div
              ref="options"
              v-for="(item, index) in selectionItems"
              :key="index"
              :style="{ height: `${itemHeight}px` }"
              :class="{ '-active': activeIndex === index }"
              class="select-item"
              @click="onItemSelected(item)"
            >
              <div class="item-label"
                :class="{ '-selected': item.selected }">
                <slot name="selectItem" v-bind:item="item.data">
                  {{ getText(item.data) }}
                </slot>
              </div>
            </div>
          </virtual-list>
        </div>
      </div>
    </div>
    <div v-if="showError" class="error-message">
      {{ getErrorMessage() }}
    </div>
  </div>
</template>

<style lang="scss">
@import "../assets/styles/variables";

$controlHeight: 40px;
$itemHeight: 40px;
$itemAmountDisplayed: 6;
$dropdownWidth: 40px;
$colorBorder: #dddddd;

.selection-control {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  width: 100%;
  font-family: $fontScb;
  box-sizing: border-box;
  .controls {
    position: relative;
    display: flex;
    min-height: $controlHeight;
    font-size: 1.5rem;
    line-height: 1.5;
    padding: 0.25rem $dropdownWidth 0.25rem 0.8rem;
    border: 1px solid #ced4da;
    border-radius: 6px;
    background-color: white;
    box-sizing: border-box;
    &.-error {
      border: 1px solid #f44336;
    }
    .input-wrapper {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      width: 100%;
      .input-selected {
        padding-right: 4px;
        &.-focus {
          font-weight: bold;
        }
      }
      .input-text {
        flex: auto;
        width: 20px;
        height: 23px;
        padding: 0;
        outline: none;
        border: 0;
        font-size: 1.5rem;
        font-family: $fontScb;
      }
    }
    .icon-wrapper {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      padding-right: 10px;
      width: $dropdownWidth;
      cursor: pointer;
      color: darken($colorPurpleDark, 10);
      &:hover {
        color: darken($colorPurpleDark, 20);
      }
      .icon {
        color: inherit;
        &.-flip {
          transform: rotate(-180deg);
          transition: 0.3s cubic-bezier(0, 0, 0.2, 1);
        }
      }
    }
    .selection {
      position: absolute;
      top: $itemHeight;
      left: -1px;
      right: -1px;
      z-index: 2;
      overflow: hidden;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
      background-color: white;
      border-radius: 6px;
    }
    .selection-list {
      position: relative;
      .select-item {
        display: flex;
        align-items: center;
        padding: 0 15px;
        min-height: $itemHeight;
        .item-selecter {
          display: flex;
          .icon {
            color: $colorPurpleDark;
          }
        }
        .item-label {
          display: flex;
          align-items: center;
          width: 100%;
          height: 100%;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 1rem;
          &.-selected {
            color: $colorPurpleDark;
            font-weight: bold;
          }
        }
        &:hover {
          background-color: $colorHover;
        }
        &.-active {
          background-color: $colorHover;
        }
      }
    }
    .selection-list-empty {
      display: flex;
      justify-content: center;
      align-items: center;
      height: $itemHeight * 4;
    }
  }
  .error-message {
    color: $colorError;
    font-size: 1rem;
    font-weight: 400;
    line-height: 20px;
    margin-bottom: 5px;
  }
  .spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    .clip {
      $size: 20px;
      display: inline-block;
      width: $size;
      height: $size;
      border-style: solid;
      border-width: 2px;
      border-color: #bbbbbb #bbbbbb $colorHover;
      border-radius: 100%;
      animation: clipDelay 750ms 0s infinite linear;
      animation-fill-mode: both;
    }
  }
  @keyframes clipDelay {
    0% {
      transform: rotate(0deg) scale(1);
    }
    50% {
      transform: rotate(180deg) scale(0.8);
    }
    100% {
      transform: rotate(360deg) scale(1);
    }
  }
}
</style>
