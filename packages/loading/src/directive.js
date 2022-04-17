import Vue from 'vue';
import Loading from './loading.vue';
import { addClass, removeClass, getStyle } from 'element-ui/src/utils/dom';
import { PopupManager } from 'element-ui/src/utils/popup';
import afterLeave from 'element-ui/src/utils/after-leave';
const Mask = Vue.extend(Loading);

// 指令

// 1
// vue内置指令
// - v-if v-show
// - v-text v-html
// - v-for v-bind v-on
// - v-model v-slot v-once
// - v-pre v-cloak
// -------------------

// 2
// 自定义指令
// 注册
//  - 全局注册：Vue.directive('directive-name', options)
//  - 局部注册：组件选项对象 directives: { directive-name: options }
// 钩子函数
//  - bind unbind
//  - update componentUpdate
//  - inserted
//  - 官网说明 https://cn.vuejs.org/v2/guide/custom-directive.html
// 钩子函数的参数
//  - el binding vnode oldVnode
//  - binding
//    - 参数binding对象中具有：name + value + expression指令的值 + arg指令参数 + modifiers修饰符
//    - binding.arg：指令参数，可以是动态的值
//    - binding.value：可以是字符串，也可以是对象
// 应用
// - 获取焦点 v-focus
// - 防抖
// - 图片懒加载
// - 一键copy
// - 点击外部触发事件 v-click-out
// - 源码地址：https://github.com/woow-wu7/vue2-research/blob/master/src/views/Directive.vue
// - 6个常用自定义指令：https://juejin.cn/post/6953879183600648229#heading-3

// Loading 源码分析资料
// - https://juejin.cn/post/6844903798549250055

const loadingDirective = {}; // vue插件是一个对象，该对象一定要具有 install 方法，install的第一个参数大Vue
loadingDirective.install = Vue => {
  if (Vue.prototype.$isServer) return; // $isServer 标志位，表示是否正在调用 = Loading.service(options);
  const toggleLoading = (el, binding) => {
    if (binding.value) { // v-loading="xxx" 的值，即 xxx
      Vue.nextTick(() => {
        if (binding.modifiers.fullscreen) {
          // bind.modifiers
          // - 包含修饰符的对象
          //  - v-my-directive.foo.bar
          //  - { foo: true, bar: true }
          el.originalPosition = getStyle(document.body, 'position'); // 获取 style position 的值
          el.originalOverflow = getStyle(document.body, 'overflow'); // 获取 style overflow 的值
          el.maskStyle.zIndex = PopupManager.nextZIndex();

          addClass(el.mask, 'is-fullscreen');
          insertDom(document.body, el, binding);
        } else {
          removeClass(el.mask, 'is-fullscreen');

          if (binding.modifiers.body) {
            el.originalPosition = getStyle(document.body, 'position');

            ['top', 'left'].forEach(property => {
              const scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
              el.maskStyle[property] = el.getBoundingClientRect()[property] +
                document.body[scroll] +
                document.documentElement[scroll] -
                parseInt(getStyle(document.body, `margin-${ property }`), 10) +
                'px';
            });
            ['height', 'width'].forEach(property => {
              el.maskStyle[property] = el.getBoundingClientRect()[property] + 'px';
            });

            insertDom(document.body, el, binding);
          } else {
            el.originalPosition = getStyle(el, 'position');
            insertDom(el, el, binding);
          }
        }
      });
    } else {
      afterLeave(el.instance, _ => {
        if (!el.instance.hiding) return;
        el.domVisible = false;
        const target = binding.modifiers.fullscreen || binding.modifiers.body
          ? document.body
          : el;
        removeClass(target, 'el-loading-parent--relative');
        removeClass(target, 'el-loading-parent--hidden');
        el.instance.hiding = false;
      }, 300, true);
      el.instance.visible = false; // visible=false
      el.instance.hiding = true;
    }
  };
  const insertDom = (parent, el, binding) => {
    if (!el.domVisible && getStyle(el, 'display') !== 'none' && getStyle(el, 'visibility') !== 'hidden') {
      Object.keys(el.maskStyle).forEach(property => {
        el.mask.style[property] = el.maskStyle[property];
      });

      if (el.originalPosition !== 'absolute' && el.originalPosition !== 'fixed') {
        addClass(parent, 'el-loading-parent--relative');
      }
      if (binding.modifiers.fullscreen && binding.modifiers.lock) {
        addClass(parent, 'el-loading-parent--hidden');
      }
      el.domVisible = true;

      parent.appendChild(el.mask);
      Vue.nextTick(() => {
        if (el.instance.hiding) {
          el.instance.$emit('after-leave');
        } else {
          el.instance.visible = true; // visible=true
        }
      });
      el.domInserted = true;
    } else if (el.domVisible && el.instance.hiding === true) {
      el.instance.visible = true;
      el.instance.hiding = false;
    }
  };

  // 指令
  // - bind
  // - update
  // - unbind
  Vue.directive('loading', {
    bind: function(el, binding, vnode) {
      const textExr = el.getAttribute('element-loading-text');
      const spinnerExr = el.getAttribute('element-loading-spinner');
      const backgroundExr = el.getAttribute('element-loading-background');
      const customClassExr = el.getAttribute('element-loading-custom-class');
      const vm = vnode.context;
      // new Mask
      // - const Mask = Vue.extend(Loading);
      //  - Vue.extend( options )
      //    - 1. 参数：是 vue ( 组件选项对象 )
      //    - 2. 作用：
      //      - 使用 Vue 创建一个 子类，子类可以继续new创建vm实例
      //      - 这样就可以通过 ( 子类的组件选项对象 ) 去覆盖 ( 原组件的组件参数对象 )
      const mask = new Mask({
        el: document.createElement('div'), // 注意 loading 是新创建的 div
        data: {
          text: vm && vm[textExr] || textExr,
          spinner: vm && vm[spinnerExr] || spinnerExr,
          background: vm && vm[backgroundExr] || backgroundExr,
          customClass: vm && vm[customClassExr] || customClassExr,
          fullscreen: !!binding.modifiers.fullscreen
        }
      });

      // 在指令被绑的DOM上添加 mask 相关属性
      el.instance = mask;
      el.mask = mask.$el;
      el.maskStyle = {};
      binding.value && toggleLoading(el, binding); // 切换
    },

    update: function(el, binding) {
      el.instance.setText(el.getAttribute('element-loading-text'));
      if (binding.oldValue !== binding.value) {
        toggleLoading(el, binding); // 切换
      }
    },

    unbind: function(el, binding) {
      if (el.domInserted) {
        el.mask &&
        el.mask.parentNode &&
        el.mask.parentNode.removeChild(el.mask); // 删除
        toggleLoading(el, { value: false, modifiers: binding.modifiers }); // 隐藏
      }
      el.instance && el.instance.$destroy(); // 销毁
    }
  });
};

export default loadingDirective;
