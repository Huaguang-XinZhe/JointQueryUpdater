<template>
  <div>
    <!--    v-model 不能绑定在 contenteditable 元素上-->
    <!--    <div contenteditable="true" v-model="editableContent">-->
    <!--      {{ editableContent }}-->
    <!--    </div>-->
    <!--    <span-->
    <!--      @blur="handleBlur"-->
    <!--      @click="handleClick"-->
    <!--      @keydown.enter.prevent="handleEnter"-->
    <!--    >-->
    <!--      初始内容 </span-->
    <!--    ><br />-->
    <span @blur="handleBlur" @click="handleClick"> 初始内容 </span><br />
    <span @blur="handleBlur" @click="handleClick">初始内容 </span><br />
    <span @blur="handleBlur" @click="handleClick"> 初始内容 </span><br />
    <!--    <div contenteditable="true">-->
    <!--      {{ editableContent }}-->
    <!--    </div>-->
    <br />
    <br />
    <button @click="commitAllChanges">提交全部更改</button>
    <!--    <input type="text" v-model="editableContent" />-->
  </div>
</template>

<script>
import { selectAll, visualizeSpaces } from "@/utils";

export default {
  name: "TestShiftEnter",
  data() {
    return {
      // editableContent: "初始内容",
      // 存储变更的对象
      // changedObj: {
      //   // 变更之前的值
      //   changeBefore: "初始内容",
      //   // 变更之后的值
      //   changeAfter: ""
      // },
      // 把上面的对象改为一个列表
      changedList: [],
    };
  },
  methods: {
    // updateContent(event) {
    //   console.log("updateContent 执行！", event.target.textContent);
    //   // this.editableContent = event.target.innerHTML;
    //   this.editableContent = event.target.textContent;
    // },
    // handleEnter(event) {
    //   console.log("按下回车键！");
    //   // 在文末插入一个 br
    //   // 好奇怪呀，我在文末执行插入一个 br 的命令，为什么不能真正实现换行呢？
    //   // 它会插入一个 br，然后再按就不会插入了，光标一直在文末
    //   document.execCommand("insertHTML", false, "<br>");
    // },
    handleBlur(event) {
      console.log("离焦！", event.target);
      // 移除 contenteditable 属性，使其不可编辑
      event.target.removeAttribute("contenteditable");

      // 去除 span 元素内，最后一个 br 标签
      event.target.innerHTML = event.target.innerHTML.replace(/(<br>)+$/, "");

      // let currentContent = event.target.textContent; // 点击后离开，不修改，竟然会在源文本两边加上空格！！！
      let currentContent = event.target.innerText; // 得用它，它会保留文本中换行符，而 textContent 会忽略换行符
      // 去除文末可能带有的 br 标签
      // let currentContent = innerText.replace(/\n$/, ""); // 加了这行代码(直接用 trim 去除也可以)，换行后改回原值就校验成功了，但仍会保留 br 标签
      // 也不能用 textContent。如果在文本之间回车的话，它会忽视这个回车。
      // let currentContent = event.target.textContent.trim(); // 去掉两边的空格
      // todo: 还是有问题，在换行文本上更改后，即使和原始数据一致，也会在下边多一换行符
      // 原因：第一次回车的时候会在当前文本的后边加上两个 br，之后的输入就放入这两个 br 之间，然后再回车的话，就只加一个 br，这样就会导致最后总是多出一个 br。
      // 不是第一次回车就会导致这个问题，而是在文末第一次回车才会，如果在文中间回车，就不会。
      // console.log("currentContent:", currentContent);
      console.log("currentContent：", visualizeSpaces(currentContent));
      if (currentContent === "初始内容") {
        console.log("内容未变更！");
        event.target.removeAttribute("contentChanged");
      } else {
        // 给元素设置 changed 类，以便在 CSS 中设置样式
        event.target.setAttribute("contentChanged", "true");

        // // 将变更对象加入列表
        // this.changedList.add({ // 数组不能用 add 方法，得用 push
        //   changeBefore: "初始内容",
        //   changeAfter: currentContent,
        // });
        // 下面这段逻辑要放提交全部更改按钮里
        // this.changedList.push({
        //   changeBefore: "初始内容",
        //   changeAfter: currentContent,
        // });
      }
    },
    handleClick(event) {
      if (event.target.hasAttribute("contenteditable")) {
        console.log("已经在编辑了，不要再触发了！");
        return;
      }
      console.log("点击！", event.target);
      // 给元素添加 contenteditable 属性，使其可编辑
      event.target.setAttribute("contenteditable", "true");
      // 聚焦
      event.target.focus();
      // 全选
      selectAll(event.target);
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
  mounted() {
    // console.log(visualizeSpaces("这是    一个测试。"));
  },
};
</script>

<style scoped>
span:focus {
  outline: none;
}
span[contentChanged="true"] {
  background-color: skyblue;
}
</style>
