<template>
  <span class="el-breadcrumb__item">
    <span
      :class="['el-breadcrumb__inner', to ? 'is-link' : '']"
      ref="link"
      role="link">
      <slot></slot>
    </span>

    <!-- i 分隔符 -->
    <!-- <i> 定义与文本中其余部分不同的部分，并把这部分文本呈现为斜体文本 -->
    <i v-if="separatorClass" class="el-breadcrumb__separator" :class="separatorClass"></i>

    <!-- separatorClass不存在是，使用下面的span -->
    <span v-else class="el-breadcrumb__separator" role="presentation">{{separator}}</span>
  </span>
</template>
<script>
  // ElBreadcrumbItem

  // 1
  // props
  // - to string/object
  // - replace boolean

  export default {
    name: 'ElBreadcrumbItem',
    props: {
      to: {},
      replace: Boolean
    },
    data() {
      return {
        separator: '',
        separatorClass: ''
      };
    },

    inject: ['elBreadcrumb'],

    // 2
    // inject
    // 注入父组件的实例
    // provide() {
    //   return {
    //     elBreadcrumb: this // 向子组件注入实例，即 <el-breadcrumb-item/>
    //   };
    // }


    mounted() {
      this.separator = this.elBreadcrumb.separator; // 分隔符
      this.separatorClass = this.elBreadcrumb.separatorClass; // 分隔符class

      // 3
      // separatorClass
      // 其实是 iconFont 的 class
      // 即 <i class="el-icon-edit"></i>

      const link = this.$refs.link; // 获取 link dom
      link.setAttribute('role', 'link');
      link.addEventListener('click', _ => { // ElBreadcrumbItem 的 children 作为 slot

        // to 是 props 中传入的
        const { to, $router } = this;
        if (!to || !$router) return;
        this.replace ? $router.replace(to) : $router.push(to); // push or replace
      });
    }
  };
</script>
