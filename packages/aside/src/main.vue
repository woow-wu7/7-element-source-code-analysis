<template>
  <aside class="el-aside" :style="{ width }">
    <slot></slot>
  </aside>
</template>

<script>
  export default {
    name: 'ElAside',

    componentName: 'ElAside',

    // el-aside 仅仅只有一个 width 属性，该属性赋值给了 style 属性
    // 总结
    // 1. header footer 几乎一样，只是class不一样 ------- 都具有 height 属性 -- 因为 header｜footer 是 ( 垂直排列 )
    // 2. aside ------------------------------------- 具有 width 属性 ----- 因为aside是 ( 水平排列 )
    props: {
      width: {
        type: String,
        default: '300px'
      }
    }
  };
</script>
