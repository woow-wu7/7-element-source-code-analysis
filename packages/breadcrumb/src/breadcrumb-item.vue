<template>
  <span class="el-breadcrumb__item">
    <span
      :class="['el-breadcrumb__inner', to ? 'is-link' : '']"
      ref="link"
      role="link">
      <slot></slot>
    </span>
    <i v-if="separatorClass" class="el-breadcrumb__separator" :class="separatorClass"></i>
    <span v-else class="el-breadcrumb__separator" role="presentation">{{separator}}</span>
  </span>
</template>
<script>
  // ElBreadcrumbItem
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

    inject: ['elBreadcrumb'], // 注入父组件的实例

    mounted() {
      this.separator = this.elBreadcrumb.separator; // 分隔符
      this.separatorClass = this.elBreadcrumb.separatorClass; // 分隔符class
      const link = this.$refs.link; // 获取 link dom
      link.setAttribute('role', 'link');
      link.addEventListener('click', _ => { // ElBreadcrumbItem 的 children 作为 slot
        const { to, $router } = this;
        if (!to || !$router) return;
        this.replace ? $router.replace(to) : $router.push(to);
      });
    }
  };
</script>
