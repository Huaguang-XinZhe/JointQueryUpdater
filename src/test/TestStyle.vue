<template>
  <table>
    <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
      <td
        v-for="(cell, cellIndex) in row"
        :key="cellIndex"
        contenteditable="true"
        :class="getCellClass(cell.value)"
        @input="handleInput(rowIndex, cellIndex, $event)"
      >
        {{ cell.value }}
      </td>
    </tr>
  </table>
</template>

<script>
import debounce from "lodash/debounce";

export default {
  name: "TestStyle",
  data() {
    return {
      // 如果使用响应式数据，部分单元格的修改仍有问题，光标会跳到最前面
      tableData: Object.freeze([
        [
          { value: "1" },
          { value: "2" },
          { value: "3" },
          { value: "4" },
          { value: "5" },
        ],
        [
          { value: "6" },
          { value: "7" },
          { value: "8" },
          { value: "9" },
          { value: "10" },
        ],
        [
          { value: "11" },
          { value: "12" },
          { value: "13" },
          { value: "14" },
          { value: "15" },
        ],
      ]),
    };
  },
  created() {
    this.debouncedUpdate = debounce(this.updateCell, 300);
  },
  methods: {
    getCellClass(value) {
      if (value === "null") {
        return "null-value";
      } else if (value.trim() === "") {
        return "empty-value";
      }
      return "";
    },
    updateCell(rowIndex, cellIndex, newValue) {
      this.tableData[rowIndex][cellIndex].value = newValue;
      // 触发模板渲染
      this.$forceUpdate();
      // console.log(this.tableData);
    },
    handleInput(rowIndex, cellIndex, event) {
      // 在中文输入法下，输入一个字符可能就要执行两次，输入一个我总共要执行 6 次，所以，即时是不渲染模板，也最好用上防抖，减少不必要的执行次数
      // 在 input 监听下始终应用防抖是必要的！
      this.debouncedUpdate(rowIndex, cellIndex, event.target.textContent);
      // this.updateCell(rowIndex, cellIndex, event.target.textContent);
    },
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  margin: 0 auto;
}
td {
  border: 1px solid black;
  padding: 10px;
}
.null-value {
  font-style: italic;
  color: grey;
}
.empty-value {
  /* 为空时的样式，例如背景色改变等 */
  background-color: bisque;
}
</style>
