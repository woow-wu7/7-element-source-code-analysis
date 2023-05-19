import Vue from "vue";
import Main from "./main.vue";
import { PopupManager } from "element-ui/src/utils/popup";
import { isVNode } from "element-ui/src/utils/vdom";
import { isObject } from "element-ui/src/utils/types";

// Vue.extend
// - 作用: 使用基础 Vue 构造器，创建一个“子类”
// - 参数: 参数是一个包含组件选项的对象
// - VUE.extends({template, data, computed, methods})
let MessageConstructor = Vue.extend(Main);

let instance;
let instances = [];
let seed = 1;

const Message = function (options) {
  // 服务端环境直接返回
  if (Vue.prototype.$isServer) return;

  options = options || {};

  // 1. this.$message('这是一条消息提示');
  // 2. this.$message({ message: h("p", null, [h("span", null, "内容可以是 ")]) });
  if (typeof options === "string") {
    options = {
      message: options,
    };
  }

  let userOnClose = options.onClose; // -------- AA. 利用 userOnClose 暂存 用户传入的 onclose 方法
  let id = "message_" + seed++; // 为每个 Message 分配一个唯一id

  // ------------------------------------------- AA. 暂存后，重写 onclose
  options.onClose = function () {
    Message.close(id, userOnClose); // --------- BB. 调用 Message 上声明好的 close 方法，详见下面的 BB
  };

  // 执行 Vue 子类
  // Message组件中的 data 将会被这里的 options 覆盖
  instance = new MessageConstructor({
    data: options,
  });

  instance.id = id;

  // message 是 VNode 的情况
  // - 即 this.$message({ message: h("p", null, [h("span", null, "内容可以是 ")]) });
  // - 如果message是VNode，通过 slot 插入
  if (isVNode(instance.message)) {
    instance.$slots.default = [instance.message];
    instance.message = null;
  }

  // vm 挂载
  // vm.$mount( [elementOrSelector] )
  // - 1.注意:
  //  - 这里没有传参数，一般情况下是像下面这样传参调用的
  //  - new Vue().$mount('#app')
  // - 2.$mount() 未传参数
  //  - 如果 Vue 实例在实例化时没有收到 el 选项，则它处于“未挂载”状态，没有关联的 DOM 元素。可以使用 vm.$mount() 手动地挂载一个未挂载的实例
  //  - 如果没有提供 elementOrSelector 参数，模板将被渲染为 ( 文档之外 ) 的的元素，并且你必须使用 ( 原生 DOM API ) 把它 ( 插入 ) 文档中
  //  - https://v2.cn.vuejs.org/v2/api/#vm-mount

  instance.$mount(); // 挂载
  document.body.appendChild(instance.$el); // 插入，插入到 body 上，不在vue项目中

  let verticalOffset = options.offset || 20;
  instances.forEach((item) => {
    verticalOffset += item.$el.offsetHeight + 16;
  });
  instance.verticalOffset = verticalOffset;
  instance.visible = true;
  instance.$el.style.zIndex = PopupManager.nextZIndex();
  instances.push(instance); // 每次调用都会生成一个实例，向队列中添加

  // 返回 vm 实例
  return instance;
};

// 这里表示通过这样的方式调用
// - this.$message.error('错了哦，这是一条错误消息');
["success", "warning", "info", "error"].forEach((type) => {
  Message[type] = (options) => {
    if (isObject(options) && !isVNode(options)) {
      // object VNode
      return Message({
        ...options,
        type,
      });
    }

    // options
    return Message({
      type,
      message: options,
    });
  };
});

// BB
// Message.close
// - 调用 Message 或 this.$message 会返回当前 Message 的实例。如果需要手动关闭实例，可以调用它的 close 方法。
// - 参数
//  - userOnClose: 是用户调用 message 时传入的 onclose 方法，传入的onclose是关系时的回调函数
Message.close = function (id, userOnClose) {
  let len = instances.length;
  let index = -1;
  let removedHeight;
  for (let i = 0; i < len; i++) {
    if (id === instances[i].id) {
      removedHeight = instances[i].$el.offsetHeight;
      index = i;
      if (typeof userOnClose === "function") {
        userOnClose(instances[i]); // 用户传入的onclose在这里执行，并可以获取 该message的实例
      }
      instances.splice(i, 1);
      break;
    }
  }
  if (len <= 1 || index === -1 || index > instances.length - 1) return;
  for (let i = index; i < len - 1; i++) {
    let dom = instances[i].$el;
    dom.style["top"] =
      parseInt(dom.style["top"], 10) - removedHeight - 16 + "px"; // 删除时 上移 位置
  }
};

Message.closeAll = function () {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].close();
  }
};

export default Message;
