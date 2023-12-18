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

// 可视化
export function visualize(str) {
  // 匹配空格、制表符、换行符
  return str.replace(/ /g, "·").replace(/\t/g, "→").replace(/\n/g, "↵\n");
}

// 滚动到底部
export function scrollToBottom(scrollableElement) {
  scrollableElement.scrollTop = scrollableElement.scrollHeight;
}

// 定位到文本末尾
export function setCursorAtEnd(element) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(element);
  range.collapse(false); // false 代表移动到最后
  sel.removeAllRanges();
  sel.addRange(range);
}
