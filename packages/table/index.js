import ElTable from "./src/table";

/* istanbul ignore next */
ElTable.install = function (Vue) {
  Vue.component(ElTable.name, ElTable);
};

export default ElTable;

// table
// - thead tbody tfoot tr th td
// - caption
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

// 2
// caption
// - 定义表格标题，必须紧随 table 标签之后。只能对每个表格定义一个标题，默认居中与表格之上
// - caption 是标题的意思

// 3
// th td
// - 属性
//    - colspan 站的列数

// 4
// table的css相关
// - border-collapse: collapse; // table的边框设置成单一的边框，不然有空隙
// - table-layout: fixed; // 列宽由表格宽度和列宽度设定

// 5
// - 例子
/*
<table border="1"  cellSpacing="0" cellPadding="0">
  <caption>表格标题</caption>
  <colGroup width="100" span="2" style="background: yellow;"></colGroup>
  <colGroup width="100" style="background: red;"></colGroup>
  <thead>
    <tr>
      <th colspan="2">姓名</th>
      <th>年龄</th>
      <th>城市</th>
      <th>职业</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>woow_wu7</th>
      <td>20</td>
      <td>重庆</td>
      <td>engineer</td>
    </tr>
  </tbody>
  <tfoot></tfoot>
</table>
*/
