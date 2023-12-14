<script>
export default {
  name: "TableComponent2",
  data() {
    return {
      // 从数据库中获取的原始数据
      tableData: [
        { id: 1, name: "Alice", age: 30 },
        { id: 2, name: "Bob", age: 25 },
      ],
      // 用于 UI 显示的数据
      // displayData: [],
    };
  },
  methods: {
    // focusCell(rowIndex, cellIndex) {
    //   const refName = this.getCellRef(rowIndex, cellIndex);
    //   console.log(refName);
    //   const cells = this.$refs[refName]; // cells 是个数组，尽管在这个实例下只有一个元素
    // },
    clickCell(cell) {
      cell.editing = true;
      // this.$nextTick(() => { // 为什么这样还是获取不到焦点？
      //   this.$refs.cellInput.focus();
      // });

      console.log(cell);
    },
  },
  mounted() {
    // 扩展源数据中的每个字段为一个对象（单元格对象）
    // todo 为什么新追加的字段已经是响应式的了？
    this.tableData = this.tableData.map((row) => {
      const newRow = {};
      for (const key in row) {
        // 跳过 id 字段
        if (key === "id") {
          newRow[key] = {
            value: row[key],
          };
          continue;
        }
        newRow[key] = {
          // 每个 key 就是一个字段。这里是为每一个字段创建一个对象，然后加入到 newRow 中
          value: row[key],
          editing: false,
          modified: false,
        };
      }
      return newRow;
    });
    // console.log(this.tableData);
    // 给原数据追加一些字段
    // for (let i = 0; i < this.tableData.length; i++) {
    //   const row = this.tableData[i];
    //   this.$set(row, "$id", i + 1); // 用于在 UI 中显示的 id
    //   this.$set(row, "_editing", false); // 用于标记是否正在编辑
    //   this.$set(row, "_modified", false); // 用于标记是否被修改过
    // }
    // 隐藏 id、_editing、_modified 列的显示
    // this.displayData = this.tableData.map((row) => {
    //   const { id, _editing, _modified, ...rest } = row;
    //   return rest;
    // });
    // console.log(this.displayData);
  },
};
</script>

<template>
  <table>
    <tr v-for="row in tableData" :key="row.id">
      <td v-for="cell in row" tabindex="0" @click="clickCell(cell)">
        <span v-if="!cell.editing">{{ cell.value }}</span>
        <input v-else type="text" :value="cell.value" ref="cellInput" />
      </td>
    </tr>
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
  background-color: yellow;
  outline: none;
}
input {
  padding: 0;
  border: 0;
  width: 100%;
  height: 100%;
}
</style>
