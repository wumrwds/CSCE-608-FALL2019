const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common')
const path = require('path')

module.exports = merge(common, {
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        historyApiFallback: true,
        host: '0.0.0.0',
        port: 8011,
        open: true,
        compress: true,
        proxy: {
            '/idsp-predict': {
                target: 'http://127.0.0.1:8888',
                pathRewrite: { '^/idsp-predict': '/idsp-predict' }
            }
        }
    },
    plugins: [
        new webpack.NormalModuleReplacementPlugin(/element-ui[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]zh-CN/, 'element-ui/lib/locale/lang/en')
    ]
})
