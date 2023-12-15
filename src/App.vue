<template>
  <div id="app">
    <!--    <TableComponent />-->
    <!--    <TableComponent2 />-->
    <TableComponent3 />
    <br />
    <el-button>提交所有更改</el-button>
    <hr />
    <InputComponent />
  </div>
</template>

<script>
import TableComponent from "@/components/TableComponent.vue";
import InputComponent from "@/components/InputComponent.vue";
import TableComponent2 from "@/components/TableComponent2.vue";
import TableComponent3 from "@/components/TableComponent3.vue";

export default {
  name: "App",
  components: {
    InputComponent,
    TableComponent,
    TableComponent2,
    TableComponent3,
  },
};
</script>

<style>
@import "./assets/reset.css"; /* 在 App 组件中引入重置样式 */

#app {
  height: 100vh;
  display: flex; /* 只写这一行就能让原本竖向排列的子元素横向排列，也就是浮动的效果（但要好一些） */
  //justify-content: center; /* 再加上这一行能让所有内容居中显示（水平） */
  //align-items: center; /* 加上这一行，能让所有子元素在竖直方向上居中显示 */
  flex-direction: column; /* 让元素竖向排列，但会撑满全宽（如果子元素没有设置宽度的话） */
  justify-content: center;
  align-items: center; /* 在让元素竖直排列的情况下，这一项就变成了调整至水平居中 */
}
hr {
  width: 1000px;
  height: 1px;
  background-color: black;
  margin: 30px 0;
}
</style>
