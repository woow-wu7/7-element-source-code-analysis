export default {
  name: 'ElCol',

  // props

  // tag -------> 自定义元素标签 -------> string --------> div
  // span ------> 栅格占据的列数 --------> number --------> 默认值24

  // offset ----> 栅格 ( 左侧 ) 的间隔格数 -----> number --> 0
  // push ------> 栅格向右移动格数 -------> number --------> 0
  // pull ------> 栅格向左移动格数 -------> number --------> 0

  // xs ----> <768px 响应式栅格数或者栅格属性对象 --> number/object
  // sm ----> ≥768px
  // md ----> ≥992px
  // lg ----> ≥1200px
  // xl ----> ≥1920px
  // extraSmall small middle large extraLarge
  // 768 768 992 1200 1920

  props: {
    span: {
      type: Number,
      default: 24
    },
    tag: {
      type: String,
      default: 'div'
    },
    offset: Number,
    pull: Number,
    push: Number,
    xs: [Number, Object],
    sm: [Number, Object],
    md: [Number, Object],
    lg: [Number, Object],
    xl: [Number, Object]
  },

  computed: {
    gutter() {
      let parent = this.$parent; // vm.$parent 获取父组件
      while (parent && parent.$options.componentName !== 'ElRow') {
        // while循环：一直遍历往上找，直到找到了 el-row
        // 如果父组件上不包含componentName，就继续往上找，因为只有el-row组件的配置项上具有componentName属性
        // 浅层目的：这样做的目的是要让相邻最近的 el-col 和 el-row 来一一配对，向上寻找最近的 el-row 和 el-col 来配对
        // 更深的目的：就是为了获取最近父el-row组件上的 gutter 属性
        parent = parent.$parent;
      }
      return parent ? parent.gutter : 0; // 找到 el-row 返回 gutter 属性，没找到返回0表示没找到
    }
  },
  render(h) {
    let classList = [];
    let style = {};
    // style对象中的属性最终会作为el-row的style属性传入
    // - paddingLeft = gutter的一半
    // - paddingRight = gutter的一半

    // 因为
    // - el-col：上的 style 的 marginLeft 和 marginRight 分别是 ( 正的gutter的一半 )
    // - el-row：上的 style 的 marginLeft 和 marginRight 分别是 ( 负的gutter的一半 )
    // 所以
    // - 在el-row的最左边和最右边和el-col相互抵消了，el-row的两边就没有间距，贴合el-row的外层容器

    // this.gutter 是父组件 el-row 传入的 gutter
    if (this.gutter) {
      style.paddingLeft = this.gutter / 2 + 'px';
      style.paddingRight = style.paddingLeft;
    }

    ['span', 'offset', 'pull', 'push'].forEach(prop => {
      if (this[prop] || this[prop] === 0) { // 两个条件满足一个就可以
        classList.push(
          prop !== 'span'
            ? `el-col-${prop}-${this[prop]}` // 非span，比如：.el-col-offset-2
            : `el-col-${this[prop]}` // span
            // 这里需要注意，如果span不传值时，默认值是24，即 el-col-24
        );
      }
    });

    // xs sm md lg xl 几个属性可以 number｜ object
    // 为object时 { span:4, offset:4，... } 这样的格式
    ['xs', 'sm', 'md', 'lg', 'xl'].forEach(size => {
      if (typeof this[size] === 'number') { // number
        // eg  ->  this['xs'] 即为 props中的 xs
        // eg  ->  el-col-xs-9

        // 如果是number，则表示珊格数量
        // 如果是object，是类似这样一个对象  {span: 4, offset: 4}，该对象的key，key只能是 span，offset, push, pull
        classList.push(`el-col-${size}-${this[size]}`);
      } else if (typeof this[size] === 'object') { // object
        let props = this[size];
        Object.keys(props).forEach(prop => { // 遍历该对象的key，key只能是 span，offset, push, pull
          classList.push(
            prop !== 'span'
              ? `el-col-${size}-${prop}-${props[prop]}` // 非span，eg -> el-col-offset-2
              : `el-col-${size}-${props[prop]}` // span，即 遍历响应类型 + 响应类型对应的object中的每个值l，eg -> el-col-span-2
          );
        });
      }
    });

    return h(this.tag, {
      class: ['el-col', classList],
      style
    }, this.$slots.default);
  }
};
