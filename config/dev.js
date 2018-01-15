'use strict'
const path = require("path");
const webpack = require('webpack');

const merge = require('webpack-merge');
const baseConfig = require("./base");
const htmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

//加入热更新
Object.keys(baseConfig.entry).forEach(function (name) {
  baseConfig.entry[name] = ['./config/dev-client'].concat(baseConfig.entry[name])
})

module.exports = merge(baseConfig,{
	devtool: '#cheap-module-eval-source-map',
	plugins:[
		new webpack.DefinePlugin({
			'process.env': {
		        NODE_ENV: '"development"'
		    }
	    }),
	    new webpack.HotModuleReplacementPlugin(),
	    new webpack.NoEmitOnErrorsPlugin(),
		new htmlWebpackPlugin({
			filename:'index.html',
			template:'index.html',
      chunks: ['common', 'app'],
      chunksSortMode: function (chunk1, chunk2) {
          var order = ['common', 'app'];
          var order1 = order.indexOf(chunk1.names[0]);
          var order2 = order.indexOf(chunk2.names[0]);
          return order1 - order2;
      }
		}),
		new FriendlyErrorsPlugin()
	]
});
