<template>
  <transition name="el-message-fade" @after-leave="handleAfterLeave">
    <div
      :class="[
        'el-message',
        type && !iconClass ? `el-message--${type}` : '',
        center ? 'is-center' : '',
        showClose ? 'is-closable' : '',
        customClass,
      ]"
      :style="positionStyle"
      v-show="visible"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
      role="alert"
    >
      <!-- 鼠标移入 移除 -->
      <!-- @mouseenter="clearTimer" -->
      <!-- @mouseleave="startTimer" -->
      <i :class="iconClass" v-if="iconClass"></i>
      <i :class="typeClass" v-else></i>
      <slot>
        <p v-if="!dangerouslyUseHTMLString" class="el-message__content">
          {{ message }}
        </p>
        <p v-else v-html="message" class="el-message__content"></p>
      </slot>
      <i
        v-if="showClose"
        class="el-message__closeBtn el-icon-close"
        @click="close"
      ></i>
    </div>
  </transition>
</template>

<script type="text/babel">
// 默认: <script type="text/javascript​​"></script> 现代浏览器默认的是 text/javascript​​
// 这里: <script type="text/babel"></script> 表示需要经过 babel 编译

const typeMap = {
  success: "success",
  info: "info",
  warning: "warning",
  error: "error",
};

// Vue.defineComponent
export default {
  data() {
    return {
      visible: false,
      message: "",
      duration: 3000, // 显示时间, 毫秒。设为 0 则不会自动关闭
      type: "info", // success/warning/info/error
      iconClass: "", // 自定义图标的类名，会覆盖 type
      customClass: "",
      onClose: null,
      showClose: false,
      closed: false,
      verticalOffset: 20,
      timer: null,
      dangerouslyUseHTMLString: false,
      center: false, // 文字是否居中
    };
  },

  computed: {
    typeClass() {
      return this.type && !this.iconClass
        ? `el-message__icon el-icon-${typeMap[this.type]}`
        : "";
    },
    positionStyle() {
      return {
        top: `${this.verticalOffset}px`,
      };
    },
  },

  watch: {
    closed(newVal) {
      if (newVal) {
        this.visible = false;
      }
    },
  },

  methods: {

    // handleAfterLeave
    // - @after-leave 是 transition 组件的一个钩子函数
    handleAfterLeave() {
      // vm.$destroy()
      // - 完全销毁一个实例。清理它与其它实例的连接，解绑它的全部指令及事件监听器
      // - 触发 beforeDestroy 和 destroyed 的钩子
      this.$destroy(true);

      // vm.$el
      // - Vue 实例使用的根 DOM 元素
      this.$el.parentNode.removeChild(this.$el);
    },

    close() {
      this.closed = true; // close=true, this.visible一定是false
      if (typeof this.onClose === "function") {
        this.onClose(this); // 执行 传入 的，点击关闭按钮时的 回调
      }
    },

    clearTimer() {
      clearTimeout(this.timer);
    },

    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (!this.closed) {
            // closed 初始化时是 false
            this.close();
          }
        }, this.duration);
      }
    },

    // 当用户按下 ESC 键时关闭所有提示，并在组件销毁前移除监听器
    keydown(e) {
      if (e.keyCode === 27) {
        // esc关闭消息
        if (!this.closed) {
          this.close();
        }
      }
    },
  },

  mounted() {
    this.startTimer();

    // 当用户按下 ESC 键时关闭所有提示，并在组件销毁前移除监听器
    document.addEventListener("keydown", this.keydown);
  },

  beforeDestroy() {
    document.removeEventListener("keydown", this.keydown);
  },
};
</script>
