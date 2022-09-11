import shell from 'shelljs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { exit } from 'process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// console.log(import.meta.url, __filename, __dirname)

// 获取题号
const no = process.argv[2]
if (no === undefined || no === null || no === NaN) {
  console.log('请输入leetcode题目标号')
  exit(1)
}
const titleNumber = parseInt(no)

// 获取对应文件夹名字
const dirs = fs.readdirSync(path.join(__dirname, './src'))
let target = ''
for (let i = 0, len = dirs.length; i < len; i++) {
  const name = dirs[i]
  if (!isDir('./src/' + name)) continue
  if (new RegExp(`^${titleNumber}`).test(name)) {
    target = name
    break
  }
}
// console.log(dirs)
console.log(`开始运行 ${target} 测试用例...`)
if (!target) {
  console.log('找不到该题号对应文件')
  exit(1)
}

// 获取路径，执行jest命令
const absPath = path
  .resolve(__dirname, `./src/${target}/index.test.js`)
  .replace(/\\/g, '/')
// console.log(absPath)
shell.exec('jest ' + absPath)

function isDir(pathStr, base = __dirname) {
  pathStr = path.resolve(base, pathStr)
  const stat = fs.lstatSync(pathStr)
  return stat.isDirectory()
}

function isFile(path) {
  const stat = fs.lstatSync(path)
  return stat.isFile
}
