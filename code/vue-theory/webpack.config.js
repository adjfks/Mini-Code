const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // 默认
  mode: 'production',
  entry: './src/index.ts',
  // tell webpack to extract these source maps and include in our final bundle
  // https://webpack.js.org/configuration/devtool/
  // devtool: 'inline-source-map',
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
  output: {
    path: path.resolve(__dirname, 'dist'),
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
  plugins: [
    // 使用目标模板来生成最终 html
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
}
