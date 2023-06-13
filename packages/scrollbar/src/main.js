// reference https://github.com/noeldelgado/gemini-scrollbar/blob/master/index.js

import {
  addResizeListener,
  removeResizeListener,
} from "element-ui/src/utils/resize-event";
import scrollbarWidth from "element-ui/src/utils/scrollbar-width";
import { toObject } from "element-ui/src/utils/util";
import Bar from "./bar";

/* istanbul ignore next */
export default {
  name: "ElScrollbar",

  components: { Bar },

  props: {
    native: Boolean, // 原生bar
    wrapStyle: {}, // 包裹容器 的自定义样式
    wrapClass: {}, // 包裹容器 的自定义类名
    viewClass: {}, // 视图 的自定义类名
    viewStyle: {}, // 视图的自定义样式
    noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    tag: {
      // 视图的元素标签
      type: String,
      default: "div",
    },
  },

  data() {
    return {
      sizeWidth: "0",
      sizeHeight: "0",
      moveX: 0,
      moveY: 0,
    };
  },

  computed: {
    wrap() {
      return this.$refs.wrap;
    },
  },

  render(h) {
    let gutter = scrollbarWidth();
    let style = this.wrapStyle;

    // 样式处理
    if (gutter) {
      const gutterWith = `-${gutter}px`;
      const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`;

      if (Array.isArray(this.wrapStyle)) {
        style = toObject(this.wrapStyle);
        style.marginRight = style.marginBottom = gutterWith;
      } else if (typeof this.wrapStyle === "string") {
        style += gutterStyle;
      } else {
        style = gutterStyle;
      }
    }

    // view
    // 将 slot 渲染到 div 中
    const view = h(
      this.tag, // tag默认div
      {
        class: ["el-scrollbar__view", this.viewClass],
        style: this.viewStyle,
        ref: "resize",
      },
      this.$slots.default
    );
    const wrap = (
      <div
        ref="wrap"
        style={style}
        onScroll={this.handleScroll}
        class={[
          this.wrapClass,
          "el-scrollbar__wrap",
          gutter ? "" : "el-scrollbar__wrap--hidden-default",
        ]}
      >
        {[view]}
      </div>
    );

    let nodes;
    // 1. 非 native
    if (!this.native) {
      nodes = [
        wrap,
        <Bar move={this.moveX} size={this.sizeWidth}></Bar>, // x轴 bar
        <Bar vertical move={this.moveY} size={this.sizeHeight}></Bar>, // y轴 bar
      ];
    } else {
      // 2. native
      // - 仅仅外面包装了一层 div
      nodes = [
        <div
          ref="wrap"
          class={[this.wrapClass, "el-scrollbar__wrap"]}
          style={style}
        >
          {[view]}
        </div>,
      ];
    }
    return h("div", { class: "el-scrollbar" }, nodes);
  },

  methods: {
    // 滚动事件
    handleScroll() {
      const wrap = this.wrap;

      this.moveY = (wrap.scrollTop * 100) / wrap.clientHeight;
      this.moveX = (wrap.scrollLeft * 100) / wrap.clientWidth;
    },

    update() {
      let heightPercentage, widthPercentage;
      const wrap = this.wrap;
      if (!wrap) return;

      heightPercentage = (wrap.clientHeight * 100) / wrap.scrollHeight;
      widthPercentage = (wrap.clientWidth * 100) / wrap.scrollWidth;

      this.sizeHeight = heightPercentage < 100 ? heightPercentage + "%" : "";
      this.sizeWidth = widthPercentage < 100 ? widthPercentage + "%" : "";
    },
  },

  mounted() {
    if (this.native) return;
    this.$nextTick(this.update);
    !this.noresize && addResizeListener(this.$refs.resize, this.update);
  },

  beforeDestroy() {
    if (this.native) return;
    !this.noresize && removeResizeListener(this.$refs.resize, this.update);
  },
};
