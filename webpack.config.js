const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const mode = process.env.NODE_ENV || 'development';
const isPublish = process.env.IS_PUB || false;

function resolve(dir) {
  return path.join(__dirname, dir);
}

const webpackConfig = {
  mode,

  devServer: {
    port: 8088
  },

  entry: './demo/index.js',

  output: {
    filename: '[name].js',
    path: resolve('demo-dist')
  },

  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      components: resolve('src/components')
    }
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images/',
            limit: 8192
          }
        }
      },
      {
        test: /\.(woff2?|ttf|eot|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',
            limit: 8192
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },

  plugins: [new CleanWebpackPlugin(), new VueLoaderPlugin()]
};

// 不是发布打包
if (!isPublish) {
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      template: 'index.html'
    })
  );
}

module.exports = webpackConfig;
