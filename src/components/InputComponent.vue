<template>
  <el-form>
    <el-form-item>
      <!--
        如果不绑 v-model，输入不会被记录；
        keydown 事件一定要加 native 修饰符，否则不会触发；
       -->
      <el-input
        type="textarea"
        v-model="textInput"
        :autosize="{ minRows: 3, maxRows: 10 }"
        placeholder="在这里输入联查 SQL，按下 Ctrl + Enter 或按钮确认"
        :autofocus="true"
        resize="none"
        @keydown.native.ctrl.enter="executeSql"
        ref="el-input"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" v-show="confirmButtonShow" @click="executeSql"
        >确认
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from "axios";
import { getTablesInSql } from "@/utils";

export default {
  name: "InputComponent",
  data() {
    return {
      confirmButtonShow: false,
      textInput: "",
    };
  },
  methods: {
    executeSql() {
      console.log("executeSql 执行了");
      axios
        .post("http://localhost:8080/api/sql/execute", this.textInput, {
          headers: {
            "Content-Type": "text/plain", // 以纯文本发送
          },
        }) // 不刷新页面发起请求
        .then((response) => {
          this.$message.success("sql 执行成功！");
          this.$emit("update:topHalfShow", true); // 显示上半部分
          this.$emit("successfulResponse", response.data.data);
          this.$bus.$emit("table_name_set", getTablesInSql(this.textInput)); // 成功后再触发
          // 在浏览器本地存储请求成功的 sql 语句
          localStorage.setItem("sql", this.textInput);
          this.textInput = ""; // 清空文本
        })
        .catch((error) => {
          this.$message.error("出错了！去控制台看看原因吧。");
          console.log(error.message);
        });
    },
  },
  watch: {
    textInput(newValue) {
      // 可以传一个或两个参数
      // console.log('输入监视触发') // 每次追加输入只会执行一次
      if (newValue.length > 10) {
        this.confirmButtonShow = true;
      } else {
        this.confirmButtonShow = newValue.length > 0;
      }
    },
  },
};
</script>

<style scoped>
/* 可以直接影响 Element UI 的样式，不需要深度选择器 */
/*.el-form-item {
  !*display: flex;
  flex-direction: column;
  align-items: center; !* 水平居中 *!
  justify-content: center; !* 垂直居中 *!*!
}*/
.el-form {
  width: 600px;
  /* 使内部元素水平居中，简单方法 */
  text-align: center;
}
/* 没有这个类，应该是 el-textarea */
/*.el-input {
  width: 400px;
}*/
/* 该组件内没有出现 el-textarea 标签，但是也能直接操作它的样式，不需要深度选择器 */
/*.el-textarea {
  width: 400px;
}*/
</style>
