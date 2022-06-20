<template>
  <section class="el-container" :class="{ 'is-vertical': isVertical }">
    <slot></slot>
  </section>
</template>

<script>
// Container
// - 用于布局的容器组件，便于搭建页面的基本结构
// 1
// <el-container> 外层容器
// a.排列方式
//  - 在不设置属性 direction 时
//    - 垂直排列：当 ( <el-container>  ) 子元素中包含 ( <el-header> 或 <el-footer> ) 时，全部子元素会垂直上下排列
//    - 水平排列：当子元素中不包含<el-header>或<el-footer>时水平排列
//  - 在设置了 direction 时，按设置的值进行排列，direction的值只能是 ( horizontal 或 vertical )
// b.思考
//  - 问题：为什么要有水平和垂直排列的区别呢？
//  - 回答：因为要实现多不同的布局的组合方式
// c.是否支持嵌套
//  - <el-container> 是可以嵌套 <el-container> 的，在嵌套的<el-container>内又可以通过不同组合实现不同的布局

// 2
// <el-container> ------------------- section 标签
// <el-header>：顶栏容器 -------------- header 标签（ 高默认60px ）
// <el-aside>：侧边栏容器 ------------- aside 标签 （ 宽默认300px ）
// <el-main>：主要区域容器 ------------ main 标签 （ 撑满水平剩余空间 ）-> 1.main标签在整个布局中只有有唯一的一个，不能重复出现  2.<main> 元素不能是以下元素的后代：<article>、<aside>、<footer>、<header> 或 <nav>，即在该框架下main只能是section的后代
// <el-footer>：底栏容器 ------------- footer标签 （ 高默认60px ）

// 3
// 关系
// <el-container> 和 <el-header> <el-aside> <el-main> <el-footer> 之间的关系
// - 以上的组件采用了 flex 弹性布局，所以要考虑浏览器是否支持flex
// - 子元素：<el-container> 的子元素 --> 只能是后四者
// - 父元素：后四者的父元素 ------------> 也只能是 <el-container>

// 4
// <el-container> Container组件的属性
// - direction
//  - 表示：子元素的排列方向	string	horizontal / vertical
//  - 默认值：子元素中有 el-header 或 el-footer 时为 vertical，否则为 horizontal
//  - vertical 竖直的
//  - horizontal 水平的

// 5
// <el-header>Header组件的属性 和 <el-footer>Footer组件的属性
// - height
//  - 表示：高度	string
//  - 默认值：60px
// - 思考
// - 问题：为什么 Header 和 Footer 只有 height 属性，而没有 width 属性呢？
// - 回答：
//  - 因为Header和Footer只能在Container中
//    - 如果没有Aside和Main，必然占据整行
//    - 如果有Aside和Main并且没有其他Container也会上下排列还是占据整行
//    - 如果有Aside和Main并且还有同层级的Container-中，那么Header和Footer在这个同层级的Container-B中也会占据这个container-B的整行
//    - 所以:
//      - 无论上面三种情况的那种，Heder和Footer都会占据Container的一整行，所以不需要width设置
//      - 并且只要有 Header 和 Footer 就是 vertical 垂直排列的，则会占据整行

// 6
// <el-aside> Aside组件的属性
// - width
//  - 表示：侧边栏宽度	string
//  - 默认值：300px

// 7
// 思考
// 问题：为什么只有 Header Footer Aside 有属性，而 Main 没有属性呢？
// 回答：因为 container 采用flex布局，设置了前三个后，最后一个 Main 就自定填充满剩余空间了

export default {
  name: "ElContainer",

  componentName: "ElContainer",

  props: {
    direction: String, // container 只有一个属性, direction，该参数会进行computed计算
  },

  computed: { // vertical 竖直的
    isVertical() { // 用来判断<el-container>的四种子组件的排列方式

      // 1
      // - direction 属性存在
      if (this.direction === "vertical") { // Container组件只有一个属性 direction
        return true;
      } else if (this.direction === "horizontal") {
        return false;
      }

      // 2
      // - 如果 direction 不存在，继续往下执行

      // this.$slots.default
      // - 注意：this.$slots.default 返回的是一个vnode数组 ，如果当 el-container 中有两个同级的元素或组件时，this.$slots.default返回的数组成员将有两个
      // - 当 direction 不存在，并且 el-header 或 el-footer 存在时，返回true，否则返回false
      return this.$slots && this.$slots.default
        ? this.$slots.default.some((vnode) => {
            const tag = vnode.componentOptions && vnode.componentOptions.tag;
            return tag === "el-header" || tag === "el-footer";
            // 这里表示，只要 <el-container> 的子组件 ( 注意是子组件，即第一层中的组件 ) 有 <el-header>或者<el-footer> 时就会垂直排列子组件
            // vnode.componentOptions.tag -> 用来获取组件的名称

            // 扩展
            // 获取 ( 组件名 ) 的方式有哪些？
            // - 1. vnode.componentOptions.Ctor.options.name
            // - 2. vnode.componentOptions.tag
            // - 3. 在组件中，通过 this.$options.name
            // - 区别：
            //  - componentOptions.tag 为模版或者render书写的标签字符串时，根据用户的书写可能不统一
            //  - 所以推荐使用 vnode.componentOptions.Ctor.options.name
          })
        : false;
    },
  },
};
</script>
