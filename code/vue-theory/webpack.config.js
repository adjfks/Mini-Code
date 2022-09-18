const path = require('path')

module.exports = {
  // 默认
  mode: 'production',
  entry: './src/index.js',
  output: {
    // path: path.resolve(__dirname, 'dist'),
    // 虚拟打包结果存放路径，不会真正生成文件夹，而是存放在内存中供dev-server使用
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
