<template>
  <transition name="el-fade-in">
    <div
      v-if="visible"
      @click.stop="handleClick"
      :style="{
        'right': styleRight,
        'bottom': styleBottom
      }"
      class="el-backtop">
      <slot>
        <el-icon name="caret-top"></el-icon>
      </slot>
    </div>
  </transition>
</template>

<script>
import throttle from 'throttle-debounce/throttle';

const cubic = value => Math.pow(value, 3);
const easeInOutCubic = value => value < 0.5
  ? cubic(value * 2) / 2
  : 1 - cubic((1 - value) * 2) / 2;

export default {
  name: 'ElBacktop',

  props: {
    visibilityHeight: {
      type: Number,
      default: 200
    },
    target: [String],
    right: {
      type: Number,
      default: 40
    },
    bottom: {
      type: Number,
      default: 40
    }
  },

  data() {
    return {
      el: null,
      container: null,
      visible: false
    };
  },

  computed: {
    styleBottom() {
      return `${this.bottom}px`;
    },
    styleRight() {
      return `${this.right}px`;
    }
  },

  mounted() {
    this.init();
    this.throttledScrollHandler = throttle(300, this.onScroll); // throttle
    this.container.addEventListener('scroll', this.throttledScrollHandler); // 监听滚动事件
  },

  methods: {
    init() {
      this.container = document;
      this.el = document.documentElement; // ---------------- 初始化时容器是 html
      if (this.target) {
        this.el = document.querySelector(this.target); // --- 容器是 target
        if (!this.el) {
          throw new Error(`target is not existed: ${this.target}`);
        }
        this.container = this.el; // container
      }
    },
    onScroll() {
      const scrollTop = this.el.scrollTop; // 当前元素的垂直滚动条向下滚动的像素数量
      this.visible = scrollTop >= this.visibilityHeight; // 显示时机
    },
    handleClick(e) {
      this.scrollToTop();
      this.$emit('click', e); // 点击按钮后，暴露给外部的事件
    },
    scrollToTop() {
      const el = this.el;
      const beginTime = Date.now();
      const beginValue = el.scrollTop;
      const rAF = window.requestAnimationFrame || (func => setTimeout(func, 16)); // requestAnimationFrame 的降级保护
      const frameFunc = () => {
        const progress = (Date.now() - beginTime) / 500;
        if (progress < 1) { // 即 时间差小于500ms

          // const cubic = value => Math.pow(value, 3); ---------- value的3次方，pow是次方的意思

          // const easeInOutCubic = value => value < 0.5
          //   ? cubic(value * 2) / 2
          //   : 1 - cubic((1 - value) * 2) / 2;

          el.scrollTop = beginValue * (1 - easeInOutCubic(progress));
          rAF(frameFunc);
        } else {
          el.scrollTop = 0;
        }
      };
      rAF(frameFunc);
    }
  },

  beforeDestroy() {
    this.container.removeEventListener('scroll', this.throttledScrollHandler);
  }
};
</script>
