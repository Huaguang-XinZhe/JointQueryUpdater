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

// 从 sql 语句中获取表名
export function getTablesInSql(sql) {
  // 正则表达式匹配 FROM 和 JOIN 后面的表名（i 是大小写不敏感的）
  // (?:FROM|JOIN) 匹配 FROM 或 JOIN，但不捕获匹配项，即非捕获组
  let tableRegex = /(?:FROM|JOIN)\s+([^\s,;]+)/gi;

  // 用于存储找到的表名
  let tables = new Set();

  // 一直匹配直到找不到更多
  let match;
  while ((match = tableRegex.exec(sql)) !== null) {
    // console.log(match[0]); // 匹配到的整个表达式
    // 将找到的表名添加到集合中
    tables.add(match[1]);
  }

  return tables;
}
