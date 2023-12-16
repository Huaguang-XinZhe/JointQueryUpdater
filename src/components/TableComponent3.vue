<template>
  <table>
    <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
      <td v-for="(cell, columnName) in row" :key="columnName">
        <span
          :data-row="rowIndex"
          :data-cell="columnName"
          @click="focusCell(rowIndex, columnName)"
          @blur="cancelFocus"
          @keydown="handleKeydown"
        >
          {{ cell }}
        </span>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "TableComponent3",
  data() {
    return {
      tableData: [
        // 假设数据
        { id: 1, name: "Alice", age: 30 },
        { id: 2, name: "Bob", age: 25 },
        { id: 3, name: "Bob2", age: 29 },
        { id: 4, name: "Bob3", age: 23 },
        { id: 5, name: "Bob4", age: 21 },
      ],
      // editingCell: null, // 当前正在编辑的单元格，一旦被设置，就会触发重新渲染
      isKeydownEventProcessing: false, // 标记键盘事件是否正在处理中
      currentRowIndex: -1,
      currentColumnName: "",
    };
  },
  computed: {
    currentCellIndex() {
      // 根据当前正在编辑的单元格的列名，获取它的索引
      return this.getDataObjKeys().indexOf(this.currentColumnName);
    },
  },
  methods: {
    focusCell(rowIndex, columnName) {
      if (
        rowIndex === this.currentRowIndex &&
        columnName === this.currentColumnName
      ) {
        console.log("聚焦受阻");
        return;
      }
      console.log("focusCell 执行！", rowIndex, columnName);
      // 更新当前正在编辑的单元格
      this.currentRowIndex = rowIndex;
      this.currentColumnName = columnName;

      // 使用 $nextTick 确保 DOM 更新
      this.$nextTick(() => {
        // 用上这个后它会先渲染模板，更新 isEditing，然后再执行下面的代码
        // 这里非用 $nextTick 不可，否则就得点击两次才能实现预期的效果
        const cell = this.$el.querySelector(
          `[data-row="${rowIndex}"][data-cell="${columnName}"]`
        );
        if (cell) {
          // 三步标准动作，可编辑、聚焦、全选
          // cell.contenteditable = true;
          // 给 cell 元素添加 contenteditable 属性，使其可编辑（上面的添加方法不行）
          cell.setAttribute("contenteditable", "true");
          cell.focus();
          this.selectAll(cell);
          console.log(cell);
        }
      });
    },
    cancelFocus() {
      if (this.isKeydownEventProcessing) {
        // console.log("离焦受阻");
        return; // 如果键盘事件正在处理中，就不做任何事
      }
      console.log("离焦执行");
      this.currentRowIndex = -1; // 恢复初始值
      this.currentColumnName = "";
    },
    // updateData(event, append) { // 不加 @input 事件就能实现功能，离焦时还能保留数据！！！
    //   console.log("updateData 执行！", event.target, append);
    //   // 更改 tableData 里的数据
    //   let rowObj = this.tableData[this.currentRowIndex];
    //   // 设值
    //   rowObj[this.currentColumnName] = event.target.innerText + append;
    // },
    handleKeydown(event) {
      console.log("handleKeydown 执行！", event.target);
      // 检测按键是否是导航键
      const navigationKeys = [
        "Tab",
        "Enter",
        "ArrowRight",
        "ArrowLeft",
        "ArrowUp",
        "ArrowDown",
      ];
      const key = event.key;
      if (!navigationKeys.includes(key)) return;
      console.log(key + "键被按下");

      // 设置标志
      this.isKeydownEventProcessing = true;

      // 阻止默认行为
      if (key === "Tab" || key === "Enter") {
        console.log("阻止默认行为");
        event.preventDefault();
      }

      // 检测是否同时按下了 Shift 和 Enter
      if (key === "Enter" && event.shiftKey) {
        // 默认的 Enter 行为是换行
        console.log("执行换行操作");
        // 插入换行
        document.execCommand("insertHTML", false, "<br><br>");
        return; // 阻止后续逻辑
      }

      // 获取当前单元格的坐标
      let rowIndex = this.currentRowIndex;
      let cellIndex = this.currentCellIndex;
      console.log("当前单元格坐标：", rowIndex, cellIndex);

      // 根据按下的键更新坐标
      switch (key) {
        case "Tab":
          cellIndex += 1;
          break;
        case "Enter":
          rowIndex += 1;
          break;
        // case "ArrowRight":
        //   cellIndex += 1;
        //   break;
        // case "ArrowLeft":
        //   cellIndex -= 1;
        //   break;
        case "ArrowUp":
          rowIndex -= 1;
          break;
        case "ArrowDown":
          rowIndex += 1;
          break;
      }
      console.log("新单元格坐标：", rowIndex, cellIndex);

      let columnName = this.getDataObjKeys()[cellIndex];
      this.focusCell(rowIndex, columnName);

      // 清除标志
      this.$nextTick(() => {
        this.isKeydownEventProcessing = false;
      });
    },
    getDataObjKeys() {
      return Object.keys(this.tableData[0]);
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
td > span {
  display: inline-block; /* 内联元素不能设置上下 margin */
  padding: 10px;
}
/* padding 虽然会应用于内联元素，但不会把它撑开，而是会扩散 */
/*td > span {
  padding: 10px;
}*/
/* 只有在可编辑的状态下，获取焦点才有用 */
td > span:focus {
  //outline-color: rgba(64, 158, 255, 0.2);
  outline: none;
}
td:focus-within {
  background-color: rgba(64, 158, 255, 0.2);
  /* 使用 box-shadow 模拟内部边框 */
  box-shadow: inset 0 0 0 3px rgb(64, 158, 255); /* 这个颜色是 Element UI 组件的默认主题色 */
}
</style>
