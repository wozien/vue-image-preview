'use strict';

process.env.NODE_ENV = 'production';
process.env.IS_PUB = true;

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackConfig = require('./webpack.config');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const publishConfig = merge(webpackConfig, {
  // 类库的入口
  entry: './src/index.js',

  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'VueImagePreview',
    libraryTarget: 'umd' // 打包的格式
  },

  // 不打包vue,但使用该类库需要外部引入
  externals: {
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue'
    }
  },

  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'package.json',
        to: path.resolve(__dirname, 'dist')
      },
      {
        from: 'README.md',
        to: path.resolve(__dirname, 'dist')
      }
    ])
  ]
});

// 打包发布包的资源
webpack(publishConfig, (err, stats) => {
  if (err) throw err;

  console.log('build complete.\n');
});
