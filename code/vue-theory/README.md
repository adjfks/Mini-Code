# theory of vue
学习手写vue相关原理的核心代码

## build develop environment
由于代码涉及DOM操作，因此利用webpack-dev-server搭建开发环境
安装webpack
```shell
npm i webpack webpack-cli webpack-dev-server -D
```
配置webpack
```js
// webpack.config.js
const path = require('path')

module.exports = {
  // 默认
  mode: 'production',
  entry: './src/index.js',
  output: {
    // path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist',
    // 打包出来的文件名
    filename: 'bundle.js',
  },
  devServer: {
    port: 8080,
    // 静态资源文件夹
    static: {
      directory: path.join(__dirname, 'public'),
    },
  },
}

```
配置typescript环境
1. 安装
```shell
npm install --save-dev typescript ts-loader
```
2. 开启source map
会导致构建速度变慢，且使得生成的bundle.js体积过大，导致webpack warning
tsconfig.json
```json
"sourceMap": true
```
webpack.config.js
```js
entry: './src/index.ts',
// tell webpack to extract these source maps and include in our final bundle
// https://webpack.js.org/configuration/devtool/
devtool: 'inline-source-map',
module: {
  rules: [
    {
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    },
  ],
},
resolve: {
  extensions: ['.tsx', '.ts', '.js'],
},
```
3. 使用html-webpack-plugin在html中自动引入js
webpack.config.js
```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

// ...
plugins: [
    // 使用目标模板来生成最终 html
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
],
```

## virtual dom and diff
1. vNode
返回一个描述真实dom的对象
2. h
递归调用vNode，并进行了函数重载

