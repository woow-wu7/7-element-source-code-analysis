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
    props: {
      width: {
        type: String,
        default: '300px'
      }
    }
  };
</script>
