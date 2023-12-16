// 选中所有文本
export function selectAll(element) {
  console.log("全选执行");
  // 创建范围并全选文本
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(element);
  selection.removeAllRanges();
  selection.addRange(range);
}

// 可视化空格
// todo: 学习用法，再可视化换行符
export function visualizeSpaces(str) {
  return str.replace(/ /g, "·").replace(/\t/g, "→");
}
