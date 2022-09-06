# Mini-Code
本仓库存放个人代码，采用monorepo的形式进行管理，代码放在code目录中。

# Usage
进入code文件夹下的任意文件夹，安装依赖
```shell
npm install
```
运行example文件夹下的例子
```shell
npm run ex
```

# jest单元测试
要使jest支持es module有两种方法：
1. 使用babel
安装依赖包
```shell
npm i -D --dev babel-jest @babel/core @babel/preset-env
```
babel.config.js
```js
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
}
```


2. 使用es6 moudle的实验性支持功能
需要node18.8.0以上版本
```shell
jest --experimental-vm-modules
```

