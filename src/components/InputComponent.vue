<script>
import autosize from "autosize/dist/autosize";
import axios from "axios"; /* 实现 textarea 高度的自适应 */
// import _ from "lodash";

export default {
  name: "InputComponent",
  data() {
    return {
      confirmButtonShow: false,
      textInput: '',
      expanded: false,  // 新增属性，用于跟踪文本区域是否已扩展
      textareaStyle: { width: 'auto' }, // 用于绑定到 textarea 的样式
    }
  },
  methods: {
    // checkInput: _.debounce(function() {
    //   console.log('@', 'input 事件触发') // 一个字符会触发多次 input 事件！！！不论哪个浏览器，不论是否启用插件。
    //   this.confirmButtonShow = this.textInput.length > 0;
    //   if (this.confirmButtonShow && !this.expanded) {
    //     this.expandTextarea(); // 当有输入且尚未扩展时调用扩展函数
    //   }
    // }, 100),
    // expandTextarea: _.once(function() { // 使用 lodash 的 once 确保只执行一次
    //   console.log('扩展触发')
    //   let textarea = this.$el.querySelector('textarea');
    //   textarea.style.width = "300px"; // 设置文本区域的最大宽度
    //   this.expanded = true;
    // }),
    updateTextareaStyle(expanded) {
      // 通过 Vue 的方式修改样式，不直接操作 DOM
      this.textareaStyle = expanded ? { width: '300px' } : { width: 'auto' };
    },
    sqlQuery() {
      this.textInput = '' // 清空文本
      axios.post('http://localhost:8081/sqlQuery', this.textInput) // 不刷新页面发起请求
          .then(response => {

          })
          .catch(error => {

          })
    }
  },
  watch: {
    textInput(newValue) { // 可以传一个或两个参数
      // console.log('输入监视触发') // 每次追加输入只会执行一次
      if (newValue.length > 10) {
        this.expanded = true
        this.confirmButtonShow = true
      } else if (newValue.length > 0) {
        this.expanded = false
        this.confirmButtonShow = true
      } else { // 没有输入时重新隐藏
        this.expanded = false
        this.confirmButtonShow = false
      }
    },
    expanded(newValue, oldValue) {
      if (newValue === oldValue) return
      this.updateTextareaStyle(newValue)
    }
  },
  mounted() {
    // 初始化 autosize
    this.$nextTick(() => {
      autosize(this.$refs.textarea);
    });
  },
  beforeDestroy() {
    // 销毁 autosize
    autosize.destroy(this.$refs.textarea);
  }
}
</script>

<template>
  <form @submit.prevent="sqlQuery" @keydown.ctrl.enter="sqlQuery"> <!-- 阻止默认的提交事件，并绑定 sqlQuery 方法 -->
    <textarea
        ref="textarea"
        v-model="textInput"
        :style="textareaStyle"
        placeholder="在这里输入联查 SQL，按下 Ctrl + Enter 或按钮确认"
        name="query">
    </textarea>
    <br>
    <input v-show="confirmButtonShow" type="submit" value="确认">
  </form>
</template>

<style scoped>
  form {
    display: flex;
    flex-direction: column;
    align-items: center; /* 交叉轴居中 */
  }
  textarea {
    min-width: 150px;
    max-width: 400px; /* 设置最大宽度 */
    max-height: 400px; /* 设置最大高度，超过最大高度再输入文字就会出现滚动条 */
    overflow-x: hidden !important; /* 确保隐藏水平滚动条的样式不被覆盖 */
    padding: 10px;
  }
</style>
