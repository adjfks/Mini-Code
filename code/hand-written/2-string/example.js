const {
  toWordCase,
  toCamelCase,
  toKebabCase
} = require('./index')

const str1 = '     -TransformObjectToJson  '
const str2 = '-)transform-jsonToObject--++'

const word_case_str1 = toWordCase(str1)
console.log('word_case_str1: ', word_case_str1);
const word_case_str2 = toWordCase(str2)
console.log('word_case_str2: ', word_case_str2);

const camel_case_str1 = toCamelCase(str1)
console.log('camel_case_str1: ', camel_case_str1);
const camel_case_str2 = toCamelCase(str2)
console.log('camel_case_str2: ', camel_case_str2);

const kebab_case_str1 = toKebabCase(str1)
console.log('kebab_case_str1: ', kebab_case_str1);
const kebab_case_str2 = toKebabCase(str2)
console.log('kebab_case_str2: ', kebab_case_str2);
