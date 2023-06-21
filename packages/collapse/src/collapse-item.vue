<template>
  <div
    class="el-collapse-item"
    :class="{ 'is-active': isActive, 'is-disabled': disabled }"
  >
    <!-- aria-expanded 表示展开状态 -->
    <div
      role="tab"
      :aria-expanded="isActive"
      :aria-controls="`el-collapse-content-${id}`"
      :aria-describedby="`el-collapse-content-${id}`"
    >
      <div
        class="el-collapse-item__header"
        @click="handleHeaderClick"
        role="button"
        :id="`el-collapse-head-${id}`"
        :tabindex="disabled ? undefined : 0"
        @keyup.space.enter.stop="handleEnterClick"
        :class="{
          focusing: focusing,
          'is-active': isActive,
        }"
        @focus="handleFocus"
        @blur="focusing = false"
      >
        <slot name="title">{{ title }}</slot>
        <i
          class="el-collapse-item__arrow el-icon-arrow-right"
          :class="{ 'is-active': isActive }"
        >
        </i>
      </div>
    </div>
    <el-collapse-transition>
      <div
        class="el-collapse-item__wrap"
        v-show="isActive"
        role="tabpanel"
        :aria-hidden="!isActive"
        :aria-labelledby="`el-collapse-head-${id}`"
        :id="`el-collapse-content-${id}`"
      >
        <div class="el-collapse-item__content">
          <slot></slot>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>
<script>
import ElCollapseTransition from "element-ui/src/transitions/collapse-transition";
import Emitter from "element-ui/src/mixins/emitter";
import { generateId } from "element-ui/src/utils/util";

export default {
  name: "ElCollapseItem",

  componentName: "ElCollapseItem",

  mixins: [Emitter],

  components: { ElCollapseTransition },

  data() {
    return {
      contentWrapStyle: {
        height: "auto",
        display: "block",
      },
      contentHeight: 0,
      focusing: false,
      isClick: false,
      id: generateId(),
      // export const generateId = function() {
      //   return Math.floor(Math.random() * 10000);
      // };
    };
  },

  // provide 和 inject 配对使用，透传属性
  // 注意：不具有相应式，想要具有响应式需要使用 组合式api 来实现
  // provide() {
  //   return {
  //     collapse: this, // 将父组件 el-collapse 实例传递给子组件 el-collapse-item
  //   };
  // },

  inject: ["collapse"], // 获取 provide 传递过来的值

  // props
  // - title 面板标题 string
  // - name 唯一标志符 string/number
  // - disabled 是否禁用 boolean
  props: {
    title: String,
    name: {
      type: [String, Number],
      default() {
        return this._uid;
      },
    },
    disabled: Boolean,
  },

  computed: {
    isActive() {
      return this.collapse.activeNames.indexOf(this.name) > -1; // 是否被点击过
    },
  },

  methods: {
    handleFocus() {
      setTimeout(() => {
        if (!this.isClick) {
          this.focusing = true;
        } else {
          this.isClick = false;
        }
      }, 50);
    },
    handleHeaderClick() {
      if (this.disabled) return;
      this.dispatch("ElCollapse", "item-click", this); // 执行 ElCollapse 组件的 item-click 事件，参数是vm实例
      this.focusing = false;
      this.isClick = true;
    },
    handleEnterClick() {
      this.dispatch("ElCollapse", "item-click", this);
    },

    // export default {
    //   methods: {
    //     dispatch(componentName, eventName, params) {
    //       var parent = this.$parent || this.$root;
    //       var name = parent.$options.componentName;

    //       while (parent && (!name || name !== componentName)) {
    //         parent = parent.$parent;

    //         if (parent) {
    //           name = parent.$options.componentName;
    //         }
    //       }
    //       if (parent) {
    //         parent.$emit.apply(parent, [eventName].concat(params));
    //       }
    //     },
    //     broadcast(componentName, eventName, params) {
    //       broadcast.call(this, componentName, eventName, params);
    //     }
    //   }
    // };
  },
};
</script>
