<template>
  <div id="app">
    <!--    <TableComponent />-->
    <!--    <TableComponent2 />-->
    <!--    <TableComponent3 />-->
    <!--        <TestShiftEnter />-->
    <!--    <TableComponent4 :tableData="tableData" />-->
    <!--    <TestStyle />-->
    <div v-show="topHalfShow">
      <TableComponent
        ref="tableComponent"
        @coreToApp="commitAllChanges"
        :tableData="tableData"
        :map-size.sync="mapSize"
      />
      <br />
      <el-button v-show="commitButtonShow" @click="triggerCoreMethod"
        >提交所有更改</el-button
      >
      <hr />
    </div>
    <InputComponent
      ref="inputComponent"
      @successfulResponse="handleSuccess"
      :topHalfShow.sync="topHalfShow"
    />
  </div>
</template>

<script>
import TableComponent from "@/components/TableComponent.vue";
import InputComponent from "@/components/InputComponent.vue";
import TableComponent2 from "@/test/TableComponent2.vue";
import TableComponent3 from "@/test/TableComponent3.vue";
import TableComponent4 from "@/test/TableComponent4.vue";
import TestShiftEnter from "@/test/TestChanges.vue";
import TestStyle from "@/test/TestStyle.vue";
import axios from "axios";

export default {
  name: "App",
  components: {
    InputComponent,
    TableComponent,
    TableComponent2,
    TableComponent3,
    TableComponent4,
    TestShiftEnter,
    TestStyle,
  },
  data() {
    return {
      tableData: [],
      commitButtonShow: false,
      mapSize: 0,
      topHalfShow: false,
    };
  },
  watch: {
    mapSize() {
      console.log("mapSize 变化了");
      this.commitButtonShow = this.mapSize > 0;
    },
  },
  mounted() {
    console.log("App mounted");
    // 从 localStorage 读取数据
    const sql = localStorage.getItem("sql");

    if (sql) {
      // 有数据就发请求
      let inputComponent = this.$refs.inputComponent; // 组件的引用只有一个，所以可以这样获取
      inputComponent.textInput = sql;
      inputComponent.executeSql(true);
    }
  },
  methods: {
    // 成功响应
    handleSuccess(data) {
      // 直接冻结整个数据对象（变成非响应式的）
      this.tableData = Object.freeze(data);
    },
    // 提交所有更改
    commitAllChanges(changedList) {
      // console.log("提交所有更改", changedList);
      let tableEl = this.$refs.tableComponent.$el;
      let loadingObj = this.$loading({
        // lock: true,
        target: tableEl,
        text: "正在提交更改...",
        // spinner: "el-icon-loading",
        // background: "rgba(0, 0, 0, 0.7)",
      });
      // 把数据异步发给后端
      axios
        .post("http://localhost:8080/api/changes/update", changedList, {
          headers: {
            "Content-Type": "application/json", // 以 JSON 发送
          },
        })
        .then(() => {
          loadingObj.close();
          this.$message.success("全部修改成功！");
          tableEl.querySelectorAll("[contentChanged]").forEach((el) => {
            el.removeAttribute("contentChanged");
          });
          this.commitButtonShow = false;
        })
        .catch((error) => {
          loadingObj.close();
          this.$message.error("修改失败！");
          console.log(error.message);
        });
    },
    triggerCoreMethod() {
      // todo 这里持有组件的引用也就只为了触发一个方法，似乎不太妥当
      this.$refs.tableComponent.sendMapDataToParent();
    },
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
