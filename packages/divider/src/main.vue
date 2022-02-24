<template functional>
  <!-- 绑定 属性，事件，动态静态class -->
  <div
    v-bind="data.attrs"
    v-on="listeners"
    :class="[data.staticClass, 'el-divider', `el-divider--${props.direction}`]"
  >
    <!-- ( defaultSlot存在 ) 并且  ( 纵向 ) 则显示children -->
    <!-- slot 上用一层div做包装，用于样式设定 -->
    <div
      v-if="slots().default && props.direction !== 'vertical'"
      :class="['el-divider__text', `is-${props.contentPosition}`]"
    >
      <slot />
    </div>
  </div>
</template>

<script>
// Divider

// 1
// 组件属性
// - direction --------------- 设置分割线的方向 string horizontal / vertical
// - content-position -------- 设置分割线文案的位置 string	left / right / center	center

// 2
// 函数式组件
// 1. 如何开启函数式组件
// - 在 template 标签中通过 functional 开启
// 2. 特点
// - 函数式组件只能接收 props 和 context
// - 即只能接收 slots attrs emit 的普通函数创建
// 3. 应用场景
// - vue 2.0
//   - 作为性能优化，因为 ( 函数式组件 ) 的 ( 初始化速度 ) 比 ( 有状态组件 )
//   - 返回多个根节点
// - vue 3.0
//   - 3.0中已经又状态组件已经能返回多个节点，同时性能已已经提升了
//   - 所以函数式组件只能剩下唯一的应用场景：简单组件

// 3
// 使用技巧
// (1) context ---------------- 因为函数式组件没有this，所以参数是靠 context 来传递的
// - data --------------------- 传递组件的整个数据对象
// - parent ------------------- 对父组件的引用
// - slots -------------------- 一个函数，返回了包含所有插槽的对象
// (2) attr 和 listener
// <template functional>
//   <div v-bind="data.attrs" v-on="listeners">
//     <h1>{{ props.title }}</h1>
//   </div>
// </template>
// -------------------------- v-bind="data.attrs" 用来绑定所有的属性
// -------------------------- v-on="listeners" 绑定所有的事件
// (3) class 与 style 绑定
// <template functional>
//   <div :class="[data.class, data.staticClass]" :style="data.staticStyle">
//     <h1>{{ props.title }}</h1>
//   </div>
// </template>
// data.class --------------- 动态绑定class
// data.staticClass --------- 绑定静态class
// data.staticStyle --------- 绑定内联样式
// (4) component组件的引入
// - 详见 https://segmentfault.com/a/1190000022937276

// 4
// 资料
// - 源码分析：https://juejin.cn/post/6995183045212897311
// - vue函数组件：https://segmentfault.com/a/1190000022937276
export default {
  name: "ElDivider",
  props: {
    direction: {
      // horizontal ｜ vertical
      type: String,
      default: "horizontal",
      validator(val) {
        return ["horizontal", "vertical"].indexOf(val) !== -1; // 只能是枚举范围
      },
    },
    contentPosition: {
      // 	left / right / center
      type: String,
      default: "center",
      validator(val) {
        return ["left", "center", "right"].indexOf(val) !== -1;
      },
    },
  },
};
</script>
