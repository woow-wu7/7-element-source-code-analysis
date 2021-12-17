import Row from './src/row';

/* istanbul ignore next */
// 1
// 这里单独对Row进行了 ( 全局vue组件 ) 注册，在全局导出所有组件时也进行了Vue.component注册
// 全局注册的文件路径：src/index.js

// 2
// Vue的插件必须要有install方法，或者本身是一个函数作为install方法

// 3
// Vue.component({string} id, {Function | Object} [definition])
// a.注册组件
//  - Vue.component('my-component', Vue.extend({ /* ... */ })) 注册组件，传入一个扩展过的构造器
//  - Vue.component('my-component', { /* ... */ }) 注册组件，传入一个选项对象 (自动调用 Vue.extend)
// b.获取组件
//  - var MyComponent = Vue.component('my-component') 获取注册的组件 (始终返回构造器)

Row.install = function(Vue) {
  Vue.component(Row.name, Row);
};

export default Row;

