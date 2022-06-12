<template>
  <main class="el-main">
    <slot></slot>
  </main>
</template>

<script>
  // el-main 仅仅是一个 main 标签容器
  // 特点：没有任何属性
  // 因为：
  // header footer 可以设置高度，因为垂直排列
  // aside 可以设置宽度，因为水平排列
  // 所以 el-main 不需要任何属性，会制动填充剩余空间 ( css中设置了 flex: 1 )
  export default {
    name: 'ElMain',
    componentName: 'ElMain'
  };
</script>
