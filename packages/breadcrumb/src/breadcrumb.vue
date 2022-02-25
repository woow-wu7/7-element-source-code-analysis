<template>
  <div class="el-breadcrumb" aria-label="Breadcrumb" role="navigation">
    <slot></slot>
  </div>
</template>
<script>
  // Breadcrumb 和 BreadcrumbItem

  // 1
  // 属性：
  // Breadcrumb
  // - separator ------------- 分隔符 string ‘/’
  // - separator-class ------- 图标分隔符class string
  // - 上面这两个属性都是给子组件 ElBreadcrumbItem 使用的
  // BreadcrumbItem
  // - to -------------------- string/object
  // - replace --------------- boolean

  // 2
  // aria-label -------------- 当焦点落到该输入框时，读屏软件就会读出aria-label里的内容
  // role -------------------- role属性作用是告诉Accessibility类应用（比如屏幕朗读程序，为盲人提供的访问网络的便利程序），这个元素所扮演的角色，主要是供残疾人使用。使用role可以增强文本的可读性和语义化

  // 3
  // Element.setAttribute()
  // - Element.setAttribute方法用于为当前节点设置属性
  // - 如果属性已经存在，将更新属性值，否则将添加该属性
  // - 该方法没有返回值

  // 4
  // Element.querySelector() -------- 接收css选择器作为参数，返回父元素第一个匹配的子元素，没有找到返回null；
  // Element.querySelectorAll() ----- 接受css选择器作为参数，返回一个 NodeList 静态集合实例，包含所有匹配的子元素

  // 5
  // NodeList 和 HTMLCollection 的区别
  // 5.1 动态和静态
  // - 静态：NodeList 是一个 ( 静态集合 )，其 ( 不受DOM树元素变化的影响 )，即增删改查DOM元素，NodeList不会变化
  // - 动态：HTMLCollection 是 ( 动态集合 )
  // 5.2 案例
  // - NodeList ---------------------- querySelectorAll() ------- 静态
  // - HTMLCollection ---------------- getElementsByTagName() --- 动态

  export default {
    name: 'ElBreadcrumb',

    props: {
      separator: {
        type: String,
        default: '/'
      },
      separatorClass: {
        type: String,
        default: ''
      }
    },

    // provide 向子组件传递 ( 数据或方法 )
    // inject 接受父级元素传来的数据

    // 函数签名
    // - provide：Object | () => Object
    // - inject：Array<string> | { [key: string]: string | Symbol | Object }

    provide() {
      return {
        elBreadcrumb: this // 向子组件注入实例
      };
    },

    mounted() {
      const items = this.$el.querySelectorAll('.el-breadcrumb__item'); // 获取所有子元素，注意是 NodeList 静态集合类型
      if (items.length) {
        items[items.length - 1].setAttribute('aria-current', 'page'); // 从后往前给元素添加属性
      }
    }
  };
</script>
