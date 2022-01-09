<template>
  <!-- 这里并没有设置 never 的样式，因为 never 时不需要任何样式 -->

  <!-- header可以通过slot插槽的方式，也可以通过属性的方式传入 -->
  <!-- 插槽：当插槽存在时，渲染header插槽的内容 -->
  <!-- 属性：这里通过默认内容插入header属性的内容 -->
  <!-- 当header和this.$slots.header都不存时，不渲染header -->

  <div class="el-card" :class="shadow ? 'is-' + shadow + '-shadow' : 'is-always-shadow'">
    <div class="el-card__header" v-if="$slots.header || header">
      <slot name="header">{{ header }}</slot>
    </div>
    <div class="el-card__body" :style="bodyStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  // header 设置 header，也可以通过 slot#header 传入 DOM -----> string
  // body-style	 设置 body 的样式 --------------------------> object
  // shadow 设置阴影显示时机 --------------------------------> string -> always / hover / never
  export default {
    name: 'ElCard',
    props: {
      header: {},
      bodyStyle: {},
      shadow: {
        type: String
      }
    }
  };
</script>
