// let complexKey = JSON.stringify([1, 2]);
// console.log(complexKey);
// let obj = {};
// obj[complexKey] = "value";

// console.log(obj[complexKey]); // 输出 'value'

// let map = new Map();
// let key = [1, 2]; // 这个数组是复合键
// map.set(key, "value");
//
// console.log(map.get(key)); // 输出 'value'

function getTablesInQuery(sqlQuery) {
  // 正则表达式匹配 FROM 和 JOIN 后面的表名（i 是大小写不敏感的）
  // (?:FROM|JOIN) 匹配 FROM 或 JOIN，但不捕获匹配项，即非捕获组
  let tableRegex = /(?:FROM|JOIN)\s+([^\s,;]+)/gi;

  // 用于存储找到的表名
  let tables = new Set();

  // 一直匹配直到找不到更多
  let match;
  while ((match = tableRegex.exec(sqlQuery)) !== null) {
    // console.log(match[0]); // 匹配到的整个表达式
    // 将找到的表名添加到集合中
    tables.add(match[1]);
  }

  return tables;
}

// 使用示例
let sqlQuery =
  "SELECT * FROM users INNER JOIN orders ON users.id = orders.user_id";
console.log(getTablesInQuery(sqlQuery));
