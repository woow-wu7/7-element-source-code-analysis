// el-row

// 1
// name
// - 当element-ul在导出整个项目时是这样注册的 Vue.component(component.name, component);
// - Vue.component(id, [definition] )
//  - 参数
//    - {string} id 表示组件的唯一名字
//    - {Function | Object} [definition] 表示组件
//  - Vue.component('my-component', Vue.extend({ /* ... */ })) --> 注册组件，传入一个扩展过的构造器 --------> function
//  - Vue.component('my-component', { /* ... */ }) --> 注册组件，传入一个选项对象 (自动调用 Vue.extend) ----> object

export default {
  name: 'ElRow',

  componentName: 'ElRow',

  props: {
    // tag ------ 自定义元素标签 string
    // gutter --- 栅格间隔 number 0
    // type ----- 布局模式，可选 flex，现代浏览器下有效 string
    // justify --	flex 布局下的水平排列方式	string
    // align	--- flex 布局下的垂直排列方式	top/middle/bottom string
    tag: {
      type: String,
      default: 'div'
    },
    gutter: Number,
    type: String, // 当值是 'flex' 字符串时，表示flex布局方式
    justify: {
      type: String,
      default: 'start'
    },
    align: String
  },

  computed: {
    style() {
      const ret = {};

      if (this.gutter) {
        ret.marginLeft = `-${this.gutter / 2}px`; // gutter 变化时从新计算 style
        ret.marginRight = ret.marginLeft; // marginLeft 和 marginRight 值相等
      }

      return ret;
    }
  },

  // 1
  // render()
  // - render函数签名：(createElement: () => VNode) => VNode

  // 2
  // createElement()
  // 1. 返回值
  //  - createElement() 返回一个VNode
  // 2. 参数
  //    - 第一个参数：
  //      - {String | Object | Function}
  //      - HTML标签名、组件选项对象(其实就是一个组件)，或者 resolve 了上述任何一种的一个 async 函数。必填项。
  //    - 第二个参数
  //      - {Object}
  //      - 一个与模板中 attribute 对应的数据对象。可选。
  //      - 第二个参数其实就是数据对象，官网链接  https://cn.vuejs.org/v2/guide/render-function.html#createElement-%E5%8F%82%E6%95%B0
  //      - 从官网中我们需要学习到
  //        - 1. render和template相比的好处
  //        - 2. 第二个参数-即数据对象的属性有哪些，比如 class，style，attrs，props，domProps，on，nativeOn，directives，scopedSlots，slot，key，ref，refInFor
  //        - 3. render()方法中的一些约束
  //    - 第三个参数
  //      - {String | Array}
  //      - 子级虚拟节点 (VNodes)，由 `crateElement()` 构建而成，也可以使用字符串来生成“文本虚拟节点”。可选
  // - 参数注意点
  //  - 第二个和点三个参数是可选的
  //  - 当只有两个参数时，第二个参数会被当作第三个参数来处理

  // 3
  // row 相关的sass文件在 packages/theme-chalk/src/row.scss 文件中
  // - chalk 是粉笔的意思

  // 4
  // 问题：这里为什么要用render，而不用template？
  // 回答：因为 el-row 可以自定义标签的名称，如果使用template要很多if...else很冗余和麻烦

  // 5
  // el-row 中一共加了下面几个class
  // - .el-row
  // - .is-justify-
  // - .is-align-
  // - .el-row-flex 在type=== 'flex' 时存在

  render(h) {
    return h(this.tag, { // 第一个参数：this.tag 是传入组件的tag属性，表示自定义该组件的元素标签
      class: [ // 第二个参数：组件的attribute属性，就是传入组件的所有属性
        'el-row',
        this.justify !== 'start' ? `is-justify-${this.justify}` : '',
        this.align ? `is-align-${this.align}` : '',
        { 'el-row--flex': this.type === 'flex' }
      ],
      style: this.style
    }, this.$slots.default); // 第三个参数：表示通过 createElement创建的子节点，单个时string，多个时array
  }
};
