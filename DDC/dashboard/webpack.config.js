var webpack = require('webpack')
var path = require('path');
module.exports = {
    entry: {
        token: './dist/token.js'
    },
    output: {
        path: path.resolve(__dirname, './lib'),
        filename: '[name].min.js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
    ]
}