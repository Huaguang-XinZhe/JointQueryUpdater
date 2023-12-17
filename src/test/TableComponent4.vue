<template>
  <table>
    <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
      <td v-for="(cell, columnName) in row" :key="columnName">
        <span :data-row="rowIndex" :data-cell="columnName">
          {{ cell }}
        </span>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "TableComponent4",
  data() {
    return {};
  },
  props: {
    tableData: {
      type: Array, // 如果不这样写会怎样？
      required: true,
    },
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse; /* 使单元格的边框连在一起 */
}
th,
td {
  border: 1px solid rgb(0, 0, 0, 0.1);
}
</style>
