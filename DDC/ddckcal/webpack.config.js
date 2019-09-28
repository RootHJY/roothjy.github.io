var webpack = require('webpack')
var path = require('path');
module.exports = {
    entry: {
        js: './js/js.js',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
    ]
}