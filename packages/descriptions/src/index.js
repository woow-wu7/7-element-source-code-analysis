import DescriptionsRow from './descriptions-row';
import { isFunction } from 'element-ui/src/utils/types';

export default {
  name: 'ElDescriptions',
  components: {
    [DescriptionsRow.name]: DescriptionsRow
  },

  // ElDescriptions
  // - props
  // 1 border ------------ 是否带边框
  // 2 column ------------ 一行 Descriptions Item 的数量
  // 3 direction --------- 排列
  // 4 size -------------- 列表的尺寸
  // 5 title ------------- 标题文本，显示在左上方
  // 6 extra ------------- 操作区文本，显示在右上方
  // 7 colon ------------- 是否显示冒号
  // 8 labelClassName ---- 自定义标签类名
  // 9 contentClassName -- 自定义内容类名
  // 10 labelStyle ------- 	自定义标签样式
  // 11 contentStyle ----- 自定义内容样式7

  // ElDescriptionsItem
  // - props
  //    - label span
  // 1 label ------------- 标签文本
  // 2 span -------------- 列的数量，表示的是在 ElDescriptions设置的column基础上占的列，比如column=4，span=2，就占据4列的2列
  // 3 labelClassName ---- 自定义标签类名
  // 4 contentClassName
  // 5 labelStyle
  // 6 contentStyle

  props: {
    border: {
      type: Boolean,
      default: false
    },
    column: {
      type: Number,
      default: 3 // 默认是三列
    },
    direction: {
      type: String,
      default: 'horizontal'
    },
    size: {
      type: String
      // validator: isValidComponentSize,
    },
    title: {
      type: String,
      default: ''
    },
    extra: {
      type: String,
      default: ''
    },
    labelStyle: {
      type: Object
    },
    contentStyle: {
      type: Object
    },
    labelClassName: {
      type: String,
      default: ''
    },
    contentClassName: {
      type: String,
      default: ''
    },
    colon: {
      type: Boolean,
      default: true // 默认带分号
    }
  },
  computed: {
    descriptionsSize() {
      return this.size || (this.$ELEMENT || {}).size;
    }
  },
  // provide
  // - provide 和 inject 配对使用
  // - provide向后代组件传递数据，是一个object类型，或者一个函数，该函数返回一个object
  provide() {
    return {
      elDescriptions: this // 向后代组件传递 this 组件实例
    };
  },
  methods: {
    getOptionProps(vnode) { // 获取子组件的 options 中的 props
      if (vnode.componentOptions) {
        const componentOptions = vnode.componentOptions;
        const { propsData = {}, Ctor = {} } = componentOptions; // 获取 props 和 constructor ----- 1. componentOptions.propsData 的每个属性是具体的值
        const props = (Ctor.options || {}).props || {}; // 获取组件options中的props属性 ------------ 2. componentOptions.tor.options.props 的每个属性是一个对象

        const res = {};
        // res
        // key ---> 是props中的key
        // value -> 是props中设置的默认值
        // 比如
        // props: {
        //   age: { type: Number, default: 10 },
        //   age2: { type: Number, default: () => 10 }
        // }

        for (const k in props) {
          const v = props[k];
          const defaultValue = v.default;
          if (defaultValue !== undefined) {
            res[k] = isFunction(defaultValue) ? defaultValue.call(vnode) : defaultValue;
          }
        }
        return { ...res, ...propsData };
      }
      return {};
    },
    getSlots(vnode) { // 获取子组件的 slots
      let componentOptions = vnode.componentOptions || {};
      const children = vnode.children || componentOptions.children || []; // 获取子组件的子组件
      const slots = {};
      children.forEach(child => {
        if (!this.isEmptyElement(child)) {
          const name = (child.data && child.data.slot) || 'default';
          slots[name] = slots[name] || [];
          if (child.tag === 'template') {
            slots[name].push(child.children);
          } else {
            slots[name].push(child);
          }
        }
      });
      return { ...slots };
    },
    isEmptyElement(c) {
      return !(c.tag || (c.text && c.text.trim() !== ''));
    },
    filledNode(node, span, count, isLast = false) {
      if (!node.props) {
        node.props = {};
      }
      if (span > count) {
        node.props.span = count; // 最多 span 和 count 相等，如果大于设置为相等；比如一行设置column是4列，span=5，ElDescriptionsItem还是只能占4列
      }
      if (isLast) {
        // set the max span, cause of the last td
        node.props.span = count; // 最后一个item的span必然和剩下的count相等
      }
      return node;
    },
    getRows() {
      // children
      // - 获取 slot 中的 ElDescriptionsItem
      // - vnode.tag -------------------------- 获取组件的名称 -----------> 1.是 ( vue-component-编号number-组件名 ) 的形式
      // - vnode.componentOptions ------------- 组件的 options 选项
      // - vnode.componentOptions.Ctor -------- 构造函数
      // - vnode.componentOptions.tag --------- 获取组件的名称 -----------> 2.直接就是 组件名，注意对比 1.
      // - vnode.componentOptions.propsData --- 获取组件的props
      const children = ((this.$slots.default || []).filter(vnode => vnode.tag &&
            vnode.componentOptions && vnode.componentOptions.Ctor.options.name === 'ElDescriptionsItem'));

      const nodes = children.map(vnode => {
        return {
          props: this.getOptionProps(vnode),
          slots: this.getSlots(vnode),
          vnode
        };
      });

      const rows = [];
      let temp = [];
      let count = this.column; // column ------------ 一行 Descriptions Item 的数量

      nodes.forEach((node, index) => {
        const span = node.props.span || 1; // ElDescriptionsItem 组件的 span 属性

        if (index === children.length - 1) { // ================= 最后一个元素
          temp.push(this.filledNode(node, span, count, true)); // 每一行
          rows.push(temp); // 所有行
          return;
        }

        // count ---> 一行 Descriptions Item 的数量
        // span ----> 列的数量
        if (span < count) { // ================================== 非最后一个元素，如果 span < column
          count -= span; // 剩余的 span 数量，比如 column=4一行4列，即4个个item；span=2占据了2列，剩两列
          temp.push(node); // 表示 每一行：如果span有剩余的话，就直接push每一个ElDescriptionsItem到temp中
        } else { // ============================================= 非最后一个元素，span >= count 的情况
          // span >= count 的情况
          // 1. 初始时就大于等于
          // 2. 通过if计算后大于等于
          temp.push(this.filledNode(node, span, count));
          rows.push(temp);
          count = this.column; // 不管是大于还是相等，最终都会处理成相等，本轮循环完成后，下一行 count 重置
          temp = []; // 不管是大于还是相等，最终都会处理成相等，本轮循环完成后，下一行 temp 重置
        }
      });

      return rows;
    }
  },
  render() {
    const { title, extra, border, descriptionsSize, $slots } = this;
    const rows = this.getRows();
    // row
    // - 所有行的数据，是一个二维数组
    // - [ [第一行第一例, 第一行第二列], [第二行第一例, 第二行第二列]]

    // 渲染header的条件 -> title || extra || $slots.title || $slots.extra
    // header 是 div 来渲染
    // ElDescriptionsItem 是 table 来渲染
    return (
      <div class="el-descriptions">

        {/* header */}
        {
          (title || extra || $slots.title || $slots.extra)
            ? <div class="el-descriptions__header">
              {/* title */}
              <div class="el-descriptions__title">
                { $slots.title ? $slots.title : title}
              </div>
              {/* extra */}
              <div class="el-descriptions__extra">
                { $slots.extra ? $slots.extra : extra }
              </div>
            </div>
            : null
        }

        {/* ElDescriptionsItem */}
        <div class="el-descriptions__body">
          <table class={['el-descriptions__table', {'is-bordered': border}, descriptionsSize ? `el-descriptions--${descriptionsSize}` : '']}>
            {rows.map(row => (
              <DescriptionsRow row={row}></DescriptionsRow>
            ))}
          </table>
        </div>
      </div>
    );
  }
};
