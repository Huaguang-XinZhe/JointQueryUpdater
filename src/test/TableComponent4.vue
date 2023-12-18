<template>
  <div class="table-container">
    <table>
      <!-- 表头 -->
      <thead>
        <tr>
          <th>#</th>
          <!-- 编号列的表头 -->
          <!-- 使用 Object.keys 方法获取列名，并排除包含 'id' 的列 -->
          <th v-for="columnName in columnNames" :key="columnName">
            {{ columnName }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
          <!-- 编号列 -->
          <td class="number">{{ rowIndex + 1 }}</td>
          <!-- 循环每个单元格，排除列名包含 'id' -->
          <td
            v-for="(cell, columnName) in row"
            :key="columnName"
            v-if="!columnName.includes('id')"
            @blur="handleBlur"
            @click="handleClick"
            @input="handleInput"
            ref="cell"
          >
            <!--          三元运算符不能返回 html 标签，要用字符实体-->
            {{ cell === null ? "&lt;null&gt;" : cell }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { selectAll, scrollToBottom, setCursorAtEnd } from "@/utils";
import debounce from "lodash/debounce";
import once from "lodash/once";

export default {
  name: "TableComponent4",
  data() {
    return {
      changedList: [],
    };
  },
  props: {
    tableData: {
      type: Array,
      required: true,
    },
  },
  computed: {
    // 计算属性来获取需要渲染的列名
    columnNames() {
      if (this.tableData.length > 0) {
        return Object.keys(this.tableData[0]).filter(
          (key) => !key.includes("id")
        );
      }
      return [];
    },
  },
  watch: {
    tableData() {
      console.log("tableData 变更了！初始化样式！");
      // 重新渲染表格后，需要重新设置样式（必须加这个，否则 cell 是 undefined）
      this.$nextTick(() => {
        let cells = this.$refs.cell;
        cells.forEach((cell) => {
          this.styleCell(cell); // 初始化样式
        });
      });
    },
  },
  created() {
    this.debouncedStyleCell = debounce(this.styleCell, 300);
  },
  methods: {
    handleInput(event) {
      this.debouncedStyleCell(event.target);
    },
    styleCell(cell) {
      const value = cell.textContent.trim(); // textContent 包括文本两边的空格，还有换行符等等

      if (value === "<null>") {
        // 这里必须得用 <null>，用字符实体返回的是 false
        cell.classList.add("null-value");
        cell.classList.remove("empty-value");
      } else if (value === "") {
        cell.classList.add("empty-value");
        cell.classList.remove("null-value");
      } else {
        cell.classList.remove("null-value", "empty-value");
      }
    },
    handleBlur(event) {
      console.log("离焦！", event.target);

      event.target.removeAttribute("contenteditable");
      event.target.innerHTML = event.target.innerHTML.replace(/(<br>)+$/, "");

      let currentContent = event.target.innerText;

      if (currentContent === "初始内容") {
        console.log("内容未变更！");
        event.target.removeAttribute("contentChanged");
      } else {
        event.target.setAttribute("contentChanged", "true");
      }
    },
    handleClick(event) {
      // 使用 currentTarget 以确保始终引用 td 元素，而不是实际点击的子元素
      const tdElement = event.currentTarget;

      if (tdElement.hasAttribute("contenteditable")) {
        console.log("已经在编辑了，不要再触发了！");
        return;
      }
      console.log("点击！", tdElement);

      // 给 td 元素添加 contenteditable 属性，使其可编辑
      tdElement.setAttribute("contenteditable", "true");
      // 聚焦 td 元素
      tdElement.focus();
      // 全选 td 元素中的内容
      selectAll(tdElement);
    },
    commitAllChanges() {
      // 找出所有变更过的元素
      let changedElements = this.$el.querySelectorAll(
        '[contentChanged="true"]'
      );
      // 加入列表
      changedElements.forEach((element) => {
        this.changedList.push({
          changeBefore: "初始内容",
          changeAfter: element.textContent,
        });
      });
      console.log("提交全部更改！", this.changedList);
      // 发给服务器
      // ...
      // 清空列表
      this.changedList = [];
    },
  },
};
</script>

<style scoped>
/* overflow 在 table 上不起作用，必须放在它的父元素上 */
.table-container {
  max-width: 1200px;
  max-height: 400px;
  overflow: auto; /* 在这个容器上设置滚动条 */
}
table {
  width: 100%; /* 让表格填满容器宽度 */
  border-collapse: collapse; /* 使单元格的边框连在一起 */
}
thead > tr {
  background-color: rgb(30, 31, 34);
  color: white;
}
th,
td {
  border: 1px solid rgb(0, 0, 0, 0.1);
  padding: 10px;
}
th {
  border-color: whitesmoke;
}
td {
  max-width: 250px;
  /*max-lines: 3;*/ /* td 里没有这个属性 */
  /*max-height: 100px;*/ /* 为什么这个属性也没用呢？ */
}
/*不要加空格，加了空格就变成后代选择器了，不加就是 “与” 选择*/
td.number {
  color: rgb(68, 67, 67);
  font-style: italic;
}
td[contentChanged="true"] {
  background-color: skyblue;
}
td > i {
  color: darkgray;
}
.null-value {
  font-style: italic;
  color: grey;
}
.empty-value {
  background-color: bisque;
}
</style>
