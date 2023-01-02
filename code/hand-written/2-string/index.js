// toWordCase方法用于将传入的字符串规范化
// 1. 将除字母和数字外的字符替换成一个空格
// 2. 使用正则的先行断言 x(?=xxx)匹配 后面紧跟小写字母的大写字母 或 后面紧跟词边界的大写字母，并将大写字母小写化后前面加上空格
// 3. 将一个或多个空格替换成一个空格
// 4. 去除首尾空格
// \b 匹配边界，长度为0
function toWordCase(word) {
  return word
    .replace(/\W|_/g, ' ')
    .replace(/[A-Z](?=([a-z]|\b))/g, w => ` ${w.toLocaleLowerCase()}`)
    .replace(/\s+/g, ' ')
    .trim()
}

// 驼峰命名
// 1. 使用toWordCase将字符串规范化
// 2. 使用正则匹配 空格和其后第一个字符，将其大写化
// . 匹配任何除换行符外的单个字符
function toCamelCase(word) {
  return toWordCase(word).replace(/\s./g, s => s[1].toUpperCase())
}

// 字符串转短横线形式

function toKebabCase(word) {
  return toWordCase(word).replace(/\s+/g, '-')
}

module.exports = {
  toWordCase,
  toCamelCase,
  toKebabCase
}

