const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    entry: {
        index: './src/js/index.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist/js'),
        publicPath: '/dist/js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: '/node-modules/'
        },
        {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
              use: ["css-loader", "postcss-loader"]
            })
          }
        ]
    },
    plugins: [
        new ExtractTextPlugin("../css/main.css"),
      ]
}