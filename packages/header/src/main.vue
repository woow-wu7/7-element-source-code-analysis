<template>
  <header class="el-header" :style="{ height }">
    <slot></slot>
  </header>
</template>

<script>
export default {
  name: "ElHeader",

  componentName: "ElHeader",

  // header 和 footer 只有一个 height属性

  // - 思考
  // - 问题：为什么 Header 和 Footer 只有 height 属性，而没有 width 属性呢？
  // - 回答：
  //  - 因为Header和Footer只能在Container中
  //    - 如果没有Aside和Main，必然占据整行
  //    - 如果有Aside和Main并且没有其他Container也会上下排列还是占据整行
  //    - 如果有Aside和Main并且还有同层级的Container-中，那么Header和Footer在这个同层级的Container-B中也会占据这个container-B的整行
  //    - 所以无论上面三种情况的那种，Heder和Footer都会占据Container的一整行，所以不需要width设置
  props: {
    height: {
      type: String,
      default: "60px", // height默认60px
    },
  },
};
</script>
