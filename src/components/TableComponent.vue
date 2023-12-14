<script>
import axios from "axios";

export default {
  name: "TableComponent",
  data() {
    return {
      modifications: [],
      rows: [
        { id: 1, name: "Alice", age: 30 },
        { id: 2, name: "Bob", age: 25 },
        // 更多行...
      ],
      columns: ["id", "name", "age"],
    };
  },
  methods: {
    submitModifications() {
      axios
        .post("/api/update", this.modifications)
        .then((response) => {
          // 处理响应...
        })
        .catch((error) => {
          // 处理错误...
        });
    },
    editCell(row, column) {
      this.currentEdit = { row: row, column: column };
      // 其他编辑逻辑...
    },
  },
};
</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="column in columns" :key="column">
          {{ column }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.id">
        <td v-for="column in columns" :key="column" tabindex="0">
          <!-- 加上 tabindex，默认点击就能获取焦点了 -->
          {{ row[column] }}
          <!--          <input type="text" value="">-->
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table {
  width: 800px;
  //border: 1px solid black; /* 外层 table 的边框会被内部单元格的覆盖 */
  border-collapse: collapse; /* 使单元格的边框连在一起 */
}
th,
td {
  border: 1px solid black;
  padding: 10px;
}
td {
  text-align: center; /* 使单元格内文本居中显示 */
}
td:focus {
  background-color: deepskyblue; /* 当单元格获得焦点时，背景变为黄色 */
  outline: none; /* 取消默认的焦点轮廓 */
}
</style>
