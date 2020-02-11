var path = require('path');
var webpack = require('webpack');


module.exports = {
  entry: ['./src/index.js'],
  mode: "development",
  performance: {hints:false},
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
            test:/\.scss/,
            loader: [ 'style-loader', 'css-loader', 'sass-loader'],
        },
        {
            test: /\.css/,
            loader: ['style-loader', 'css-loader']
        }
    ]
  },
  devServer: {
    contentBase: './dist',
    publicPath: "/",
    hot: true,
    historyApiFallback: {
      disableDotRule:true
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}