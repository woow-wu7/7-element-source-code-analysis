import ElCol from './src/col';

// Row的时候为什么不叫 ElRow ？

/* istanbul ignore next */
ElCol.install = function(Vue) {
  Vue.component(ElCol.name, ElCol);
};

export default ElCol;

