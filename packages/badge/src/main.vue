<template>
  <div class="el-badge">
    <slot></slot>
    <transition name="el-zoom-in-center">
      <sup
        v-show="!hidden && (content || content === 0 || isDot)"
        v-text="content"
        class="el-badge__content"
        :class="[
          type ? 'el-badge__content--' + type : null,
          {
            'is-fixed': $slots.default,
            'is-dot': isDot
          }
        ]">
      </sup>
    </transition>
  </div>
</template>

<script>
// 1
// sup
// - 包含在 <sup> 标签和其结束标签 </sup> 中的内容将会以当前文本流中字符高度的一半来显示，但是与当前文本流中文字的字体和字号都是一样的
// - sup标签在向文档添加脚注以及表示方程式中的指数值时非常有用
// - sup 是一小口的意思

// 2
// value ---------> 显示值 ------> string|number类型
// max -----------> 最大值，超过最大值会显示 '{max}+'，要求 value 是 Number 类型
// is-dot --------> 小圆点 ------> boolean
// hidden	--------> 隐藏 badge -> boolean
// type ----------> 类型 -------> primary / success / warning / danger / info
// https://zhuanlan.zhihu.com/p/107246696

// 3
// 如何做到是 badge 的位置在子元素的右上角？
//  <span class="father">
//     <button>按钮</button>
//     <sup class="child">10</sup>
//   </span>
// ----------------
// .father {
//   background: red;
//   position: relative;
//   display: inline-block;
// }
// .child {
//   display: inline-block;
//   height: 18px;
//   line-height: 18px;
//   text-align: center;

//   padding: 0 2px;
//   background: yellow;
//   font-size: 12px;
//   white-space: nowrap;
//   border: 1px solid black;
//   border-radius: 100px;

//   position: absolute;
//   top: 0;
//   right: calc(18px / 2);
//   transform: translateY(-50%) translateX(100%);
// }

export default {
  name: 'ElBadge',

  props: {
    value: [String, Number],
    max: Number,
    isDot: Boolean,
    hidden: Boolean,
    type: {
      type: String,
      validator(val) {
        return ['primary', 'success', 'warning', 'info', 'danger'].indexOf(val) > -1;
      }
    }
  },

  computed: {
    content() {
      if (this.isDot) return; // 小红点不显示内容

      const value = this.value;
      const max = this.max;

      // value -> number
      if (typeof value === 'number' && typeof max === 'number') {
        return max < value ? `${max}+` : value;
        // value 超过 max，则显示 max+
        // value 小于 max，则显示 value
      }

      // value -> string
      return value;
    }
  }
};
</script>
