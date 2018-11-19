const path = require('path');
const webpack = require('webpack');


module.exports = [{
    entry: ['babel-polyfill', './src/root.jsx'],
    output: {
        filename: 'home.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: "https://localhost/"
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: false,
            debug: false
        })
    ],
    module : {
    rules: [
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: ['babel-loader']
        },
        {
            test: /\.scss$/,
            use: [
                {
                    loader: 'style-loader',
                },
                {
                    loader: 'css-loader'
                },
                {
                    loader: 'sass-loader'
                }
            ]
        },
        {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
                loader: 'file-loader',
            }]
        }
    ]},
    resolve: {
    extensions: ['*', '.js', '.jsx']
    }
}];

