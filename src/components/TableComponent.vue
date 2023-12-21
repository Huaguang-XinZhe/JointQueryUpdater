<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th v-for="columnName in currentTableHeader" :key="columnName">
            {{ columnName }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(rowObj, rowIndex) in tableData" :key="rowIndex">
          <!-- 编号列 -->
          <td class="number">{{ rowIndex + 1 }}</td>
          <!--      对对象遍历，拿到的是值，索引是属性名-->
          <td
            v-for="(cellValue, columnName) in rowObj"
            :key="columnName"
            @click="handleClick($event, rowIndex, columnName)"
            @blur="handleBlur($event, rowIndex, columnName)"
            @input="handleInput"
            ref="cell"
            v-if="currentTableHeader.includes(columnName)"
          >
            {{ cellValue === null ? "&lt;null&gt;" : cellValue }}
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="showData">显示数据</button>
  </div>
</template>

<script>
// 表名-字段列表
import debounce from "lodash/debounce";

let tables = {
  mytag: ["id", "input_id", "c1", "c2", "c3"],
  myinput: ["id", "content"],
};
export default {
  name: "TableComponent",
  props: {
    tableData: {
      type: Array,
      required: true,
    },
  },
  // 此时组件的数据已经被观察，但 DOM 尚未被挂载
  created() {
    // 非响应式数据放在这里初始化
    // 初始化变更对象
    this.changedObj = {};
    this.changedMap = new Map();
    this.debouncedStyleCell = debounce(this.styleCell, 300);
    this.$bus.$on("table_name_set", (tableNameSet) => {
      // console.log("table_name_set 事件监听到了！", tableNameSet);
      this.tableNameSet = tableNameSet;
    });
    // todo 这里能得到 tables 的键，即表名
  },
  destroyed() {
    // 组件销毁时，取消监听
    this.$bus.$off("table_count");
  },
  computed: {
    // 计算属性来获取当前表头
    currentTableHeader() {
      if (this.tableData.length > 0) {
        const tableNames = Object.keys(tables);
        // console.log("tableNames = ", tableNames);
        // 辅助 id（表名_id）
        const tableIds = tableNames.map((tableName) => {
          return `${tableName}_id`; // 必须 return，否则是 undefined
        });
        // console.log("tableIds = ", tableIds);
        return Object.keys(this.tableData[0]).filter((key) => {
          // 过滤掉 id 和辅助 id
          return !tableIds.includes(key) && !key.includes("id");
        });
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
  methods: {
    handleInput(event) {
      this.debouncedStyleCell(event.target);
    },
    handleClick(event, rowIndex, columnName) {
      if (event.target.hasAttribute("contenteditable")) {
        console.log("已经在编辑了，不要再触发了！");
        return;
      }
      console.log("handleClick 执行！", event.target);
      // 给元素添加 contenteditable 属性，使其可编辑
      event.target.setAttribute("contenteditable", "true");
      event.target.focus(); // 必须要让它获得焦点，否则就得点 2 次才能输入

      // 当前点击的位置（复合键）
      let compoundKey = `${rowIndex}-${columnName}`;
      // 拿着这个键去 map 里边找，如果没找到值，就设置它的 originalValue 属性
      // 如果没找到，说明没有修改过
      if (!this.changedMap.has(compoundKey)) {
        console.log("没找到，设置 originalValue 属性！");
        // 遍历 tables 对象,拿到 tableName
        let tableName = "";
        for (let [key, value] of Object.entries(tables)) {
          // for of 会循环遍历这个数组，得到里边的键值对数组
          if (value.includes(columnName)) {
            tableName = key;
            break;
          }
        }

        // 通过 tableData 拿到 rowId
        let rowObj = this.tableData[rowIndex];
        // todo 这里要根据所查表的张数进行判断，如果只查一张表，那么就直接用 rowObj.id
        let rowId = 0;
        if (this.tableNameSet.size === 1) {
          rowId = rowObj.id;
        } else {
          // 查了多张表
          rowId = rowObj[`${tableName}_id`];
        }

        // 设值（简化写法）
        // 这个设置必须放在前边，否则 originalValue 设置完后会被覆盖
        this.changedObj = {
          originalValue: event.target.textContent.trim(), // 去除两边的空格
          tableName: tableName,
          fieldName: columnName,
          rowId: rowId,
        };
      } else {
        // 如果找到了，就把它的值设值给 changedObj
        this.changedObj = this.changedMap.get(compoundKey);
      }
      // 点击后，changedObj 中可能有 changedValue（至少修改过一次），也可能没有（一次都没改过）
      // console.log("changedObj:", this.changedObj);
    },
    handleBlur(event, rowIndex, columnName) {
      console.log("handleBlur 执行！", event.target);
      // 获取当前内容
      let currentContent = event.target.textContent.trim(); // 去除两边的空格
      // 如果有 changedValue 且和当前内容相同，就直接返回
      if (
        this.changedObj.hasOwnProperty("changedValue") &&
        this.changedObj.changedValue === currentContent
      ) {
        console.log("和上一次改过的内容相比，没有变化！");
        return;
      } else if (currentContent !== this.changedObj.originalValue) {
        // 对比，有更改的话，就设值 changedObject
        console.log(this.changedObj.originalValue, "=>", currentContent);
        event.target.setAttribute("contentChanged", "true");
        this.changedObj.changedValue = currentContent; // 这样设值不是响应式的
        // this.$set(this.changedObj, "changedValue", currentContent); // 这样设值是响应式的
        // 将变更对象添加到 Map 中
        let compoundKey = `${rowIndex}-${columnName}`; // 定义复合键（用对象作 key）
        // 注意：如果复合键（数组）是一样的，它不会覆盖，而是会添加到 Map 中
        // 但如果是字符串就没问题，会覆盖
        this.updateMap(compoundKey, this.changedObj);
      } else {
        console.log("和原始值相等，没有变化！");
        event.target.removeAttribute("contentChanged");
      }

      // 清空变更对象
      this.changedObj = {};
      // 移除 contenteditable 属性，使其不可编辑
      event.target.removeAttribute("contenteditable");
    },
    showData() {
      // console.log("tableData:", this.tableData);
      // console.log("currentTableHeader:", this.currentTableHeader);
      // console.log("changedObj:", this.changedObj);
      console.log("changedMap:", this.changedMap);
    },
    sendMapDataToParent() {
      // 将 Map 转为数组
      let changedList = Array.from(this.changedMap.values());
      // 发送给父组件
      this.$emit("coreToApp", changedList);
    },
    updateMap(key, value) {
      // 更新 Map
      this.changedMap.set(key, value);
      // 触发父组件中 mySize 的更新
      this.$emit("update:map-size", this.changedMap.size);
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
