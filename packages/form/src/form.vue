<template>
  <form class="el-form" :class="[
    labelPosition ? 'el-form--label-' + labelPosition : '',
    { 'el-form--inline': inline }
  ]">
    <slot></slot>
  </form>
</template>
<script>
  // 英语
  // - asterisk 星号
  // - suffix 后缀
  // - prefix 前缀

  // Form
  // - 由 Input Select Radio Checkbox 等控件组成，用来 ( 收集，校验，提交 ) 数据
  // - Input
  // - Select
  // - Radio
  // - Checkbox
  // - Switch
  // - DatePicker
  // - TimePicker


  // Form Attributes
  // 属性
  // - 1 model --------------------- 表单数据对象 object，主要用来做响应式时的提前声明
  // - 2 rules --------------------- 表单验证规则 object
  // - 3 inline -------------------- 行内表单模式 boolean ----- 表单水平排列，表单项比较少时使用
  // - 4 label-position ------------ 设置表单域(标签的位置) left/right/top ---- 如果设置为left｜right时，则需要设置 label-width
  // - 5 label-width --------------- 设置表单域(标签的宽度) ---- <form-item>组件会继承该值
  // - 6 label-suffix -------------- 表单域(标签的后缀)
  // - 7 hide-required-asterisk ---- 是否隐藏必填字端的标签傍边的红色星号
  // - 8 show-message -------------- 是否显示校验错误信息
  // - 9 line-message -------------- 是否以行内形式展现校验信息
  // - 10 status-icon -------------- 是否在输入框中显示校验结果 ( 反馈图标 )
  // - 11 validate-on-rule-change -- 是否在rules属性改变后立即触发一次验证
  // - 12 size --------------------- 用于控制该表单内组件的尺寸 medium/small/mini
  // - 13 disabled ----------------- 是否禁用 ( 表单内的所有组件 )，如果为true，则表单组件内的组件上的 disabled 属性不再生效


  // Form Methods
  // - (1) validate
  //  - 对整个表单进行校验的方法，参数是一个回调函数，该回调函数会在校验结束后被调用，并传入两个参数(1.是否校验成功 2.未通过校验的字端)，若不传入回调函数，则会返回一个promise
  //  - Function(callback: Function(boolean, object))
  // - (2) validateField
  //  - 对部分表单字段进行校验的方法
  //  - Function(props: array | string, callback: Function(errorMessage: string))
  // - (3) resetFields
  //  - 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
  // - (4) clearValidate
  //  - 移除表单项的校验结果。传入待移除的表单项的 prop 属性或者 prop 组成的数组，如不传则移除整个表单的校验结果

  import objectAssign from 'element-ui/src/utils/merge';

  export default {
    name: 'ElForm',

    componentName: 'ElForm',

    provide() {
      return {
        elForm: this
      };
    },

    props: {
      model: Object,
      rules: Object,
      labelPosition: String,
      labelWidth: String,
      labelSuffix: {
        type: String,
        default: ''
      },
      inline: Boolean,
      inlineMessage: Boolean,
      statusIcon: Boolean,
      showMessage: {
        type: Boolean,
        default: true
      },
      size: String,
      disabled: Boolean,
      validateOnRuleChange: {
        type: Boolean,
        default: true
      },
      hideRequiredAsterisk: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      rules() {
        // remove then add event listeners on form-item after form rules change
        this.fields.forEach(field => {
          field.removeValidateEvents();
          field.addValidateEvents();
        });

        if (this.validateOnRuleChange) {
          this.validate(() => {});
        }
      }
    },
    computed: {
      autoLabelWidth() {
        if (!this.potentialLabelWidthArr.length) return 0;
        const max = Math.max(...this.potentialLabelWidthArr);
        return max ? `${max}px` : '';
      }
    },
    data() {
      return {
        fields: [],
        potentialLabelWidthArr: [] // use this array to calculate auto width
      };
    },
    created() {
      this.$on('el.form.addField', (field) => {
        if (field) {
          this.fields.push(field);
        }
      });
      /* istanbul ignore next */
      this.$on('el.form.removeField', (field) => {
        if (field.prop) {
          this.fields.splice(this.fields.indexOf(field), 1);
        }
      });
    },
    methods: {
      resetFields() {
        if (!this.model) {
          console.warn('[Element Warn][Form]model is required for resetFields to work.');
          return;
        }
        this.fields.forEach(field => {
          field.resetField();
        });
      },
      clearValidate(props = []) {
        const fields = props.length
          ? (typeof props === 'string'
            ? this.fields.filter(field => props === field.prop)
            : this.fields.filter(field => props.indexOf(field.prop) > -1)
          ) : this.fields;
        fields.forEach(field => {
          field.clearValidate();
        });
      },
      validate(callback) {
        if (!this.model) {
          console.warn('[Element Warn][Form]model is required for validate to work!');
          return;
        }

        let promise;
        // if no callback, return promise
        if (typeof callback !== 'function' && window.Promise) {
          promise = new window.Promise((resolve, reject) => {
            callback = function(valid, invalidFields) {
              valid ? resolve(valid) : reject(invalidFields);
            };
          });
        }

        let valid = true;
        let count = 0;
        // 如果需要验证的fields为空，调用验证时立刻返回callback
        if (this.fields.length === 0 && callback) {
          callback(true);
        }
        let invalidFields = {};
        this.fields.forEach(field => {
          field.validate('', (message, field) => {
            if (message) {
              valid = false;
            }
            invalidFields = objectAssign({}, invalidFields, field);
            if (typeof callback === 'function' && ++count === this.fields.length) {
              callback(valid, invalidFields);
            }
          });
        });

        if (promise) {
          return promise;
        }
      },
      validateField(props, cb) {
        props = [].concat(props);
        const fields = this.fields.filter(field => props.indexOf(field.prop) !== -1);
        if (!fields.length) {
          console.warn('[Element Warn]please pass correct props!');
          return;
        }

        fields.forEach(field => {
          field.validate('', cb);
        });
      },
      getLabelWidthIndex(width) {
        const index = this.potentialLabelWidthArr.indexOf(width);
        // it's impossible
        if (index === -1) {
          throw new Error('[ElementForm]unpected width ', width);
        }
        return index;
      },
      registerLabelWidth(val, oldVal) {
        if (val && oldVal) {
          const index = this.getLabelWidthIndex(oldVal);
          this.potentialLabelWidthArr.splice(index, 1, val);
        } else if (val) {
          this.potentialLabelWidthArr.push(val);
        }
      },
      deregisterLabelWidth(val) {
        const index = this.getLabelWidthIndex(val);
        this.potentialLabelWidthArr.splice(index, 1);
      }
    }
  };
</script>
