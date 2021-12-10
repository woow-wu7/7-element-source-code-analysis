import Row from './src/row';

/* istanbul ignore next */
// 这里单独对Row进行了注册，在全局导出所有组件时也进行了Vue.component注册
// 全局注册的文件路径：src/index.js
Row.install = function(Vue) {
  Vue.component(Row.name, Row);
};

export default Row;

