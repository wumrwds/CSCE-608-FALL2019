const webpack = require('webpack')
const merge = require('webpack-merge')
const uglifyJSPlugin = require('uglifyjs-webpack-plugin')
const common = require('./webpack.common')

module.exports = merge(common, {
    devtool: 'source-map',
    plugins: [
        new uglifyJSPlugin({
            sourceMap: true
        }),
        new webpack.NormalModuleReplacementPlugin(
            /element-ui[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]zh-CN/,
            'element-ui/lib/locale/lang/en'
        )
    ]
})
