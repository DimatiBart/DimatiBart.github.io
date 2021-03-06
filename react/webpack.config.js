module.exports = {
    entry: './main.jsx',
    output: { path: __dirname, filename: 'bundle.js' },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            },
            { test: /\.less$/, exclude: /node_modules/, loader: 'style!css!less'},
            { test: /\.css$/, exclude: /node_modules/, loader: 'style-loader!css-loader' }
        ]
    }
};