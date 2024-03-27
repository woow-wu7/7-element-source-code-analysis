<template>
  <div
    class="el-switch"
    :class="{ 'is-disabled': switchDisabled, 'is-checked': checked }"
    role="switch"
    :aria-checked="checked"
    :aria-disabled="switchDisabled"
    @click.prevent="switchValue"
  >
    <input
      class="el-switch__input"
      type="checkbox"
      @change="handleChange"
      ref="input"
      :id="id"
      :name="name"
      :true-value="activeValue"
      :false-value="inactiveValue"
      :disabled="switchDisabled"
      @keydown.enter="switchValue"
    />
    <span
      :class="[
        'el-switch__label',
        'el-switch__label--left',
        !checked ? 'is-active' : '',
      ]"
      v-if="inactiveIconClass || inactiveText"
    >
      <i :class="[inactiveIconClass]" v-if="inactiveIconClass"></i>
      <span v-if="!inactiveIconClass && inactiveText" :aria-hidden="checked">{{
        inactiveText
      }}</span>
    </span>
    <span
      class="el-switch__core"
      ref="core"
      :style="{ width: coreWidth + 'px' }"
    >
    </span>
    <span
      :class="[
        'el-switch__label',
        'el-switch__label--right',
        checked ? 'is-active' : '',
      ]"
      v-if="activeIconClass || activeText"
    >
      <i :class="[activeIconClass]" v-if="activeIconClass"></i>
      <span v-if="!activeIconClass && activeText" :aria-hidden="!checked">{{
        activeText
      }}</span>
    </span>
  </div>
</template>
<script>
import emitter from "element-ui/src/mixins/emitter";
import Focus from "element-ui/src/mixins/focus";
import Migrating from "element-ui/src/mixins/migrating";

export default {
  name: "ElSwitch",
  mixins: [Focus("input"), Migrating, emitter],
  inject: {
    elForm: {
      default: "",
    },
  },
  props: {
    // 1
    // value/v-model
    value: {
      type: [Boolean, String, Number],
      default: false,
    },

    // 2
    disabled: {
      type: Boolean,
      default: false,
    },

    // 3
    // The with of the switch component.
    width: {
      type: Number,
      default: 40,
    },

    // class
    activeIconClass: {
      type: String,
      default: "",
    },
    inactiveIconClass: {
      type: String,
      default: "",
    },

    // text
    activeText: String,
    inactiveText: String,

    // color
    activeColor: {
      type: String,
      default: "",
    },
    inactiveColor: {
      type: String,
      default: "",
    },

    // 4
    // The value of the active state.
    activeValue: {
      type: [Boolean, String, Number],
      default: true,
    },
    inactiveValue: {
      type: [Boolean, String, Number],
      default: false,
    },

    name: {
      type: String,
      default: "",
    },
    validateEvent: {
      type: Boolean,
      default: true,
    },
    id: String,
  },
  data() {
    return {
      coreWidth: this.width, // The with of the switch component.
    };
  },
  created() {
    if (!~[this.activeValue, this.inactiveValue].indexOf(this.value)) {
      this.$emit("input", this.inactiveValue);
    }
  },
  computed: {
    checked() {
      return this.value === this.activeValue;
    },
    switchDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
  },
  watch: {
    checked() {
      // input ref
      this.$refs.input.checked = this.checked;

      // Actions performed after 'checked' value changes.
      if (this.activeColor || this.inactiveColor) {
        this.setBackgroundColor();
      }

      if (this.validateEvent) {
        this.dispatch("ElFormItem", "el.form.change", [this.value]);
      }
    },
  },
  methods: {
    handleChange(event) {
      // Invert two states
      const val = this.checked ? this.inactiveValue : this.activeValue;

      // Modify the v-model's value
      this.$emit("input", val);
      this.$emit("change", val);

      this.$nextTick(() => {
        // set input's checked property
        // in case parent refuses to change component's value
        this.$refs.input.checked = this.checked;
      });
    },
    setBackgroundColor() {
      let newColor = this.checked ? this.activeColor : this.inactiveColor;
      this.$refs.core.style.borderColor = newColor;
      this.$refs.core.style.backgroundColor = newColor;
    },
    switchValue() {
      !this.switchDisabled && this.handleChange();
    },
    getMigratingConfig() {
      return {
        props: {
          "on-color": "on-color is renamed to active-color.",
          "off-color": "off-color is renamed to inactive-color.",
          "on-text": "on-text is renamed to active-text.",
          "off-text": "off-text is renamed to inactive-text.",
          "on-value": "on-value is renamed to active-value.",
          "off-value": "off-value is renamed to inactive-value.",
          "on-icon-class": "on-icon-class is renamed to active-icon-class.",
          "off-icon-class": "off-icon-class is renamed to inactive-icon-class.",
        },
      };
    },
  },
  mounted() {
    /* istanbul ignore if */
    this.coreWidth = this.width || 40;
    
    if (this.activeColor || this.inactiveColor) {
      this.setBackgroundColor();
    }
    this.$refs.input.checked = this.checked;
  },
};
</script>
