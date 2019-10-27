
const path = require('path')
const extractTextPlugin = require('extract-text-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const copyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    entry: './src/index.js',

    output: {
        filename: 'compiled/js/bundle-[hash:8].js',
        chunkFilename: 'compiled/js/[name]-[chunkhash:8].js',
        path: path.resolve(__dirname, 'dist')
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: extractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /^((?!bmap).)*\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [path.resolve(__dirname, 'src')],
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.(sass|scss)$/,
                use: extractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    extractCSS: true
                }
            },
            {
                test: /\.js$/,
                use: [
                    'babel-loader'
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|bmp|woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader?outputPath=compiled/img/'
                ]
            },
            {
                test: /\.(csv|tsv)$/,
                use: [
                    'csv-loader'
                ]
            }
        ]
    },
    resolve: {  
        //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名  
        extensions: ['.js', '.jsx'],  
        alias: {  
            '@': path.resolve(__dirname, 'src'),
            '~': path.resolve(__dirname, 'src/components') 
        }  
    },

    plugins: [
        new CleanWebpackPlugin(['dist']),
        new extractTextPlugin('[name]-[hash:8].css'),
        new htmlWebpackPlugin({
            template: './src/view/index.html',
            hash: true
        }),
        new copyWebpackPlugin([
			{ from: 'src/asserts'}
        ])
    ]
}
