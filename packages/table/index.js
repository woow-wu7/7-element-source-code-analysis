import ElTable from "./src/table";

/* istanbul ignore next */
ElTable.install = function (Vue) {
  Vue.component(ElTable.name, ElTable);
};

export default ElTable;

// table
// - thead tbody tfoot tr
// - colgroup
// - 属性
//    - border 边框
//    - cellPadding 单元格的padding
//    - cellSpacing 单元格时间的距离

// 1
// colgroup
// - 定义
//    - <colgroup> 标签用于对表格中的列进行组合，以便对其进行格式化
//    - 通过使用 <colgroup> 标签，可以向整个列应用样式，而不需要重复为每个单元格或每一行设置样式
// - 属性
//    - span 规定列组应该横跨的列数
//    - span=2 表示前两列应用的样式
// - 注意
//    - 只能在 <table> 元素之内，在任何一个 <caption> 元素之后，在任何一个 <thead>、<tbody>、<tfoot>、<tr> 元素之前使用 <colgroup> 标签
//    - 如果想对 <colgroup> 中的某列定义不同的属性，请在 <colgroup> 标签内使用 <col> 标签

// - 例子
/*
<table border="1" cellSpacing={10} cellPadding={10}>
  <thead>
    <tr>
      <th>Season</th>
      <th>Goals</th>
      <th>Assists</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>2009-2010</th>
      <td>25</td>
      <td>43</td>
    </tr>
    <tr>
      <th>2011-2012</th>
      <td>40</td>
      <td>20</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td>599</td>
      <td>599</td>
      <td>599</td>
    </tr>
  </tfoot>
</table>;
*/
