let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'dist'), //输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
    filename: 'bundle.js', // webpack-dev-server 的时候是内存
  },
  module: {
    rules: [],
  },
  plugins: [
    //创建一个在内存中生成html页面的插件
    new HtmlWebpackPlugin({
      title: 'test',
      template: path.join(__dirname, './index.html'), //指定模板页面
      filename: './index.html', //输出html文件，打包时插入js,不用自己手动引入
      inject: 'body', //js插入的位置，true/'head'/'body'/false
      hash: true,
    }),
  ],
  //使用webpack-dev-server
  devServer: {
    contentBase: './',
    host: 'localhost',
    port: 9090, //默认9090
    inline: true, //可以监控js变化
    hot: true, //热启动
  },
};
