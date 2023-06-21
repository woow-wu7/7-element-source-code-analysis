<template>
  <div class="el-collapse" role="tablist" aria-multiselectable="true">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "ElCollapse",

  componentName: "ElCollapse",

  // props
  // - accordion ----------> 是否手风琴模式 boolean
  // - value/v-model ------> 当前激活的面板(如果是手风琴模式，绑定值类型需要为string，否则为array)
  props: {
    accordion: Boolean, // 是否 手风琴 模式
    value: {
      // value/v-model 当前激活的面板(如果是手风琴模式，绑定值类型需要为string，否则为array)
      type: [Array, String, Number],
      default() {
        return [];
      },
    },
  },

  data() {
    return {
      activeNames: [].concat(this.value),
    };
  },

  // provide 和 inject 配对使用，透传属性
  // 注意：不具有相应式，想要具有响应式需要使用 组合式api 来实现
  provide() {
    return {
      collapse: this, // 将父组件 el-collapse 实例传递给子组件 el-collapse-item
    };
  },

  watch: {
    value(value) {
      this.activeNames = [].concat(value); // watch value update activeNames
    },
  },

  methods: {
    setActiveNames(activeNames) {
      activeNames = [].concat(activeNames);
      let value = this.accordion ? activeNames[0] : activeNames;
      this.activeNames = activeNames;
      this.$emit("input", value);
      this.$emit("change", value); // 兼容 v-model
    },
    // handleItemClick
    // - 参数: item 表示 collapse-item 组件实例
    handleItemClick(item) {
      if (this.accordion) {
        //----------------- 手风琴
        this.setActiveNames(
          (this.activeNames[0] || this.activeNames[0] === 0) &&
            this.activeNames[0] === item.name
            ? ""
            : item.name
        );
      } else {
        // ----------------------------- 非手风琴
        let activeNames = this.activeNames.slice(0); // 浅拷贝
        let index = activeNames.indexOf(item.name); // 点击哪个item

        // 在数组则已经是展开状态，则删除，使起收缩
        // 不在数组中，添加
        if (index > -1) {
          activeNames.splice(index, 1); // 删除
        } else {
          activeNames.push(item.name); // 添加
        }
        this.setActiveNames(activeNames);
      }
    },
  },

  created() {
    this.$on("item-click", this.handleItemClick);
  },
};
</script>
