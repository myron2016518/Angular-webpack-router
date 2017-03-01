'use strict';
//引入所需模块

const webpack = require('webpack');
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const NgAnnotatePlugin = require('ng-annotate-webpack-plugin'); //NG自动注入注解插件
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 删除插件
const autoprefixer = require('autoprefixer');
const fs = require('fs');
const glob = require('glob');
const uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const commonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

// 目录路径
const srcDir = path.resolve(process.cwd(), 'modules');
const distDir = path.resolve(process.cwd(), 'dist');

// 入口文件对象
let entries = (() => {
    let jsDir = path.resolve(srcDir, 'js');
    let entryFiles = glob.sync(jsDir + '/*.{js,jsx}');
    let map = {};

    entryFiles.forEach((filePath) => {
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        map[filename] = filePath;
    })

    return map;
})()

// 自动生成入口html文件，入口js名必须和入口文件名相同
let generateHtmlplugins = (() => {
    // 获得所有src下的页面
    let entryHtml = glob.sync(srcDir + '/**/*.html').concat(glob.sync(path.resolve(process.cwd(), 'component') + '/**/*.html'));
    let generateHtml = [];

    entryHtml.forEach((filePath) => {
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        let conf = {
            template: filePath,
            filename: filename + '.html'
        };

        //打包对应js
        if (filename in entries) {
            conf.inject = 'body';
            conf.chunks = ['vendor', filename];
        } else {
            conf.inject = 'body';
            conf.chunks = [];
        }

        generateHtml.push(new htmlWebpackPlugin(conf));
    });
    // 入口index页面不在同个目录下，独立处理
    generateHtml.push(new htmlWebpackPlugin({
        template: __dirname + '/index.html',
        filename: 'index.html',
        inject: 'body',
        chunks: ['vendor', 'index']
    }));
    return generateHtml;
})();

module.exports = {
    // 生成Source Maps,生产环境要去除
    devtool: 'source-map',
    // 文件入口,vendor为公共类库
    entry: Object.assign({}, {
        index: __dirname + '/main.js',
        vendor: ["angular", 'angular-ui-router']
    }),
    // 文件出口
    output: {
        path: distDir,
        // publicPath: 'houtai.siruijk.com', //资源服务器路径
        filename: 'js/[name]-[chunkhash:8].js',
        chunkFilename: 'js/[name]-[chunkhash:8].js'
    },
    //本地服务器配置

        devServer: {
            historyApiFallback: true,
            hot: false,
            inline: true,
            grogress: true
        },

    // loaders
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['es2015']
            }
        }, { //外链
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader!postcss-loader")
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader') //css文件单独生成到dist/css目录下
        }, {
            test: /\.html$/,
            loader: 'html-loader'
        }, {
            test: /\.(png|jpg|jpeg|gif)$/,
            loader: 'url-loader?limit=8192&name=/img/[name].[ext]' //图片拷贝到dist/img目录下
        }, { //字体加载器
            test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&mimetype=application/font-woff'
        }, {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&mimetype=application/octet-stream'
        }, {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file'
        }, {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            loader: "url?limit=10000&mimetype=image/svg+xml"
        }, ]
    },
    postcss: function() {
        return [autoprefixer()];
    },
    // 插件
    plugins: [
        // 独立CSS
        new ExtractTextPlugin('css/[name]-[chunkhash:8].css', {
            allChunks: true
        }),
        // 独立类库js
        new commonsChunkPlugin('vendor', '' + 'js/[name]-[hash].js', Infinity),
        new NgAnnotatePlugin({
            add: true
        })
    ].concat(generateHtmlplugins),
    // 配置babel
    babel: {
        "presets": ["es2015", 'stage-0'],
    },
    // 别名，扩展名
    resolve: {
        alias: {},
        extensions: ['', '.js', '.css', '.png', 'jpg']
    },
    // 外部类库,不在重复打包
    externals: {
        jquery: 'window.JQuery',
        $: 'window.JQuery',
        _: 'window._'
    }
}
