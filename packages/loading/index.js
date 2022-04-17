import directive from './src/directive';
import service from './src/index';

// 插件 - 对象的方式必须有 install 方法

// Loading 组件
// - 有两种调用方法 ( 指令方式 ) 和 ( 服务方式 )

// 1
// 指令方式
// - v-loading.fullscreen.lock.body="fullscreenLoading">
// - 当使用指令方式时，只需要绑定Boolean即可
// - 修饰符
//   - fullscreen：全屏遮罩需要添加 fullscreen修饰符（遮罩会插入至 body 上）
//   - lock：此时若需要锁定屏幕的滚动，可以使用lock修饰符；
//   - body：
//      - 通过添加body修饰符，可以使遮罩插入至 DOM 中的 body 上
//      - 默认状况下，Loading 遮罩会插入到绑定元素的子节点
// 2
// 原型连方式
// - this.$loading(options)

// 3
// 服务方式
// - Loading.service(options);
// - 当使用服务方式时，遮罩默认即为全屏，无需额外设置。
// - 使用
// import { Loading } from 'element-ui';
// let loadingInstance = Loading.service(options);
// this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
//   loadingInstance.close();
// });

// 4
// 资料
// 官网说明：https://element.eleme.cn/#/zh-CN/component/loading
// 使用案例：https://github.com/woow-wu7/vue2-research/blob/master/src/views/Loading.vue

export default {
  install(Vue) {
    Vue.use(directive);
    Vue.prototype.$loading = service; // 原型上挂 $loading
  },
  directive,
  service
};
