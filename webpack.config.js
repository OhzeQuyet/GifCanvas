var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry: './test/main.js',
    output: {
        filename: 'bundle.js'
    },
    devServer: {
        stats: {
            chunks: false,
            hash: false,
            color: true
        }
    },
    module: {
        loaders: [
            {
                loader: 'file-loader?name=[path][name].[ext]',
                test: /\.gif$/,
                include: [
                    path.resolve(__dirname, 'gif')
                ]
            }
            //, {
            //     test: /\.js$/,
            //     use: ["source-map-loader"],
            //     enforce: "pre"
            // },
            // { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    },
    plugins: [new HtmlWebpackPlugin()]
    , devtool: 'source-map'
}