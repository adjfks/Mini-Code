const path = require('path')
const { Configuration } = require('webpack')

/**
 * @type {Configuration}
 */
module.exports = {
  mode: 'development', // 开发模式
  entry: {
    main: path.resolve(__dirname, './index.js'), // 入口文件
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './dist'), // 出口文件
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: [[path.resolve(__dirname, '../src/index.js')]],
        },
      },
    ],
  },
}
