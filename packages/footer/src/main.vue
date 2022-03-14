<template>
  <footer class="el-footer" :style="{ height }">
    <slot></slot>
  </footer>
</template>

<script>
  export default {
    name: 'ElFooter',

    componentName: 'ElFooter',

    props: {
      height: {
        type: String, // 和 header 的组件一样，只是class不一样
        default: '60px'
      }
    }
  };
</script>
