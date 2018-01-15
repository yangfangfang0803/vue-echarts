'use strict'

const path = require("path");
const extractTextPlugin = require('extract-text-webpack-plugin');
const vueLoaderConfig = require('./vue.loader.config');
const postcssImport = require('postcss-import');
const autoprefixer = require('autoprefixer');
const utils = require('./utils')

function resolve (dir) {
  return path.join(__dirname, '..', dir);
}

function cssLoaders (type) {
	var postcssLoader = {
					loader:'postcss-loader',
					options:{
						plugins:[postcssImport,autoprefixer],
						browser:['last 5 versions']
					}
				};

	if(process.env.NODE_ENV === 'development'){
		var loaders = ['style-loader','css-loader',postcssLoader];
		if(type && type == 'sass'){
			loaders.push("sass-loader");
		}
		return loaders;
	}
	else{
		var loaders = {
	          	fallback: 'style-loader',
	          	use: ['css-loader',postcssLoader, 'sass-loader']
	        };

	  if(type && type == 'sass'){
			loaders.use.push("sass-loader");
		}
		return extractTextPlugin.extract(loaders);
	}
}
module.exports = {
	entry: {
    common:['./client/common/common.js','./client/common/date-utils.js','./client/common/dates.js'],
		app:'./client/index.js',
	},
	output: {
		path: resolve('./dist'),
		filename:utils.assetsPath('js/[name]-[hash].js'),
		publicPath:''
	},
	resolve: {
	    extensions: ['.js', '.vue', '.json'],
	    alias: {
	      'vue$': 'vue/dist/vue.esm.js',
	      '@': resolve('client'),
	    }
	},
	module:{
		rules:[
			{
        test: /\.vue$/,
        loader: 'vue-loader',
        options:vueLoaderConfig
		  },
			{
				test:/\.js$/,
				loader:['babel-loader'],
				exclude:resolve('node_modules/')
			},
			{
				test:/\.html$/,
				loader:'html-loader'
			},
      {
				test:/\.json$/,
				loader:'json-loader'
			},
			{
				test:/\.css$/,
				use: cssLoaders()
			},
			{
				test:/\.scss$/,
				use: cssLoaders('sass')
			},
			{
				test:/\.(jpg|png|jpeg|gif)$/,
				loaders:[
				{
					loader:'url-loader',
					options:{
            outputPath: 'assets/',
						limit:2000,
						name:utils.assetsPath('[name]-[hash:5].[ext]'),
            useRelativePath:true
					}
				},
				'image-webpack-loader'
				]
			},
			{
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
            outputPath: 'fonts/',
          	limit: 10000,
          	name: utils.assetsPath('[name].[hash:7].[ext]')
        }
		  }
		]
	}
}
