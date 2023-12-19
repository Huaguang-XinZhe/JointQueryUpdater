<template>
  <div>
    <table>
      <thead>
        <tr>
          <th v-for="columnName in currentTableHeader" :key="columnName">
            {{ columnName }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(rowObj, rowIndex) in tableData" :key="rowIndex">
          <!--      对对象遍历，拿到的是值，索引是属性名-->
          <td
            v-for="(cellValue, columnName) in rowObj"
            :key="columnName"
            @click="handleClick($event, rowIndex, columnName)"
            @blur="handleBlur($event, rowIndex, columnName)"
          >
            {{ cellValue }}
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="showData">显示数据</button>
  </div>
</template>

<script>
// 表名-字段列表
let tables = {
  mytag: ["id", "input_id", "c1", "c2", "c3"],
  myinput: ["id", "content"],
};
export default {
  name: "TestCore",
  data() {
    return {
      tableData: Object.freeze([
        {
          myinput_id: "1",
          mytag_id: "1",
          c1: "待办",
          c2: "整理、架构",
          c3: "",
          content: "pinbox 收藏整理、思考、架构（输出）。",
        },
        {
          myinput_id: "3",
          mytag_id: "3",
          c1: "待办",
          c2: "深入思考 “内外统一”",
          c3: "",
          content:
            "我的对外形象问题。内在追求和外在表现有没有必要统一？什么时候统一？",
        },
      ]),
      // 当前表头（不要在这里使用上面的属性，可能还没有定义，可以转为计算属性）
      // currentTableHeader: Object.freeze(Object.keys(this.tableData[0])),
    };
  },
  computed: {
    // 计算属性来获取当前表头
    currentTableHeader() {
      return this.tableData.length > 0
        ? Object.freeze(Object.keys(this.tableData[0]))
        : [];
    },
  },
  // 此时组件的数据已经被观察，但 DOM 尚未被挂载
  created() {
    // 非响应式数据放在这里初始化
    // 初始化变更对象
    this.changedObj = {};
    // 初始化变更 Map
    this.changedMap = new Map();
  },
  methods: {
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
        // for (let _tableName in tables) { // 不能用 for in 遍历，因为会遍历到原型链上的属性
        //   // 如果当前列名在当前表的字段列表中
        //   if (tables[_tableName].includes(columnName)) {
        //     // 将表名和字段名设值
        //     tableName = _tableName;
        //     break;
        //   }
        // }
        // entries 会返回对象的键值对数组
        // Object.entries(tables).forEach(([key, value]) => {
        //   // forEach 对每一项都会遍历，不能 break
        //   if (value.includes(columnName)) {
        //     tableName = key; // 设值表名
        //     // break;
        //   }
        // });
        for (let [key, value] of Object.entries(tables)) {
          // for of 会循环遍历这个数组，得到里边的键值对数组
          if (value.includes(columnName)) {
            tableName = key;
            break;
          }
        }

        // 通过 tableData 拿到 rowId
        let rowObj = this.tableData[rowIndex];
        let rowId = rowObj[`${tableName}_id`];

        // 设值（简化写法）
        // 这个设置必须放在前边，否则 originalValue 设置完后会被覆盖
        this.changedObj = {
          originalValue: event.target.textContent.trim(), // 去除两边的空格
          updateInfo: {
            tableName: tableName,
            fieldName: columnName,
            rowId: rowId,
          },
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
        this.changedObj.changedValue = currentContent; // 这样设值不是响应式的
        // this.$set(this.changedObj, "changedValue", currentContent); // 这样设值是响应式的
        // 将变更对象添加到 Map 中
        let compoundKey = `${rowIndex}-${columnName}`; // 定义复合键（用对象作 key）
        // 注意：如果复合键（数组）是一样的，它不会覆盖，而是会添加到 Map 中
        // 但如果是字符串就没问题，会覆盖
        this.changedMap.set(compoundKey, this.changedObj);
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
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
}
th,
td {
  border: 1px solid rgb(0, 0, 0, 0.1);
  padding: 10px;
}
</style>
