<script>
import axios from "axios";

export default {
  name: "TableComponent",
  data() {
    return {
      modifications: [],
      rows: [
        { id: 1, name: 'Alice', age: 30 },
        { id: 2, name: 'Bob', age: 25 },
        // 更多行...
      ],
      columns: ['id', 'name', 'age'],

    }
  },
  methods: {
    submitModifications() {
      axios.post('/api/update', this.modifications)
          .then(response => {
            // 处理响应...
          })
          .catch(error => {
            // 处理错误...
          })
    },
    editCell(row, column) {
      this.currentEdit = { row: row, column: column };
      // 其他编辑逻辑...
    },

  }
}
</script>

<template>
  <table>
    <tr>
      <th v-for="column in columns" :key="column">
        {{column}}
      </th>
    </tr>
    <tr v-for="row in rows" :key="row.id">
      <td v-for="column in columns" :key="column">
        {{ row[column] }}
      </td>
    </tr>
  </table>

</template>

<style scoped>

</style>