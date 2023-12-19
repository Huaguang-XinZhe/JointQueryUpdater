// let complexKey = JSON.stringify([1, 2]);
// console.log(complexKey);
// let obj = {};
// obj[complexKey] = "value";

// console.log(obj[complexKey]); // 输出 'value'

let map = new Map();
let key = [1, 2]; // 这个数组是复合键
map.set(key, "value");

console.log(map.get(key)); // 输出 'value'
