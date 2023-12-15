<script>
export default {
  name: "TableComponent3",
  data() {
    return {
      tableData: [
        // 假设数据
        ["单元格1", "单元格2"],
        ["单元格3", "单元格4"],
      ],
      editingCell: null, // 当前正在编辑的单元格，一旦被设置，就会触发重新渲染
      isKeydownEventProcessing: false, // 标记键盘事件是否正在处理中
    };
  },
  methods: {
    enableEditing(rowIndex, cellIndex) {
      this.editingCell = { rowIndex, cellIndex };
      console.log("当前编辑单元格", this.editingCell);
      // 使用 $nextTick 确保 DOM 更新
      this.$nextTick(() => {
        // 用上这个后它会先渲染模板，更新 isEditing，然后再执行下面的代码
        // 这里非用 $nextTick 不可，否则就得点击两次才能实现预期的效果
        const cell = this.$el.querySelector(
          `[data-row="${rowIndex}"][data-cell="${cellIndex}"]`
        );
        if (cell) {
          console.log(cell);
          console.log("获取焦点");
          cell.focus();
          this.selectAll(cell);
        }
      });
    },
    disableEditing() {
      if (this.isKeydownEventProcessing) {
        // console.log("离焦受阻");
        return; // 如果键盘事件正在处理中，就不做任何事
      }
      // console.log("离焦，设为 null");
      this.editingCell = null;
    },
    isEditing(rowIndex, cellIndex) {
      // 这个方法是关键！！！传入的两个索引是每个单元格的坐标，而 editingCell 中的索引是当前正在编辑的坐标。
      console.log("isEditing 执行！当前的 editingCell 是", this.editingCell);
      return (
        this.editingCell &&
        this.editingCell.rowIndex === rowIndex &&
        this.editingCell.cellIndex === cellIndex
      );
    },
    updateData(event, rowIndex, cellIndex) {
      this.tableData[rowIndex][cellIndex] = event.target.innerText; // 最新的值
    },
    handleKeydown(event) {
      // console.log(event);
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
      console.log("handleKeydown 执行！", key);
      if (!navigationKeys.includes(key)) return;
      console.log(key + "键被按下");

      // 设置标志
      this.isKeydownEventProcessing = true;

      // 阻止默认行为
      if (key === "Tab" || key === "Enter") {
        console.log("阻止默认行为");
        event.preventDefault();
      }

      if (!this.editingCell) return; // 如果为 null 就返回
      let { rowIndex, cellIndex } = this.editingCell;

      // 检测是否同时按下了 Shift 和 Enter
      // if (key === "Enter" && event.shiftKey) {
      //   // 默认的 Enter 行为是换行
      //   console.log("执行换行操作");
      //   this.tableData[rowIndex][celIndex] = event.target.innerText + "\n";
      //   return; // 阻止后续逻辑
      // }

      // 根据按下的键更新坐标
      switch (key) {
        case "Tab":
          cellIndex += 1;
          break;
        case "Enter":
          rowIndex += 1;
          break;
        case "ArrowRight":
          cellIndex += 1;
          break;
        case "ArrowLeft":
          cellIndex -= 1;
          break;
        case "ArrowUp":
          rowIndex -= 1;
          break;
        case "ArrowDown":
          rowIndex += 1;
          break;
      }

      // 清除标志
      this.$nextTick(() => {
        this.isKeydownEventProcessing = false;
      });

      // 如果新坐标在表格范围内，则启用编辑
      if (
        rowIndex >= 0 &&
        rowIndex < this.tableData.length &&
        cellIndex >= 0 &&
        cellIndex < this.tableData[rowIndex].length
      ) {
        console.log("启用编辑（来自handleKeyDown）");
        this.enableEditing(rowIndex, cellIndex);
      }
    },
    selectAll(element) {
      console.log("全选执行");
      // 创建范围并全选文本
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(element);
      selection.removeAllRanges();
      selection.addRange(range);
    },
  },
};
</script>

<template>
  <table>
    <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
      <td v-for="(cell, cellIndex) in row" :key="cellIndex">
        <span
          :data-row="rowIndex"
          :data-cell="cellIndex"
          :contenteditable="isEditing(rowIndex, cellIndex)"
          @click="enableEditing(rowIndex, cellIndex)"
          @blur="disableEditing(rowIndex, cellIndex)"
          @input="updateData($event, rowIndex, cellIndex)"
          @keydown="handleKeydown($event)"
        >
          {{ cell }}
        </span>
      </td>
    </tr>
  </table>
</template>

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
