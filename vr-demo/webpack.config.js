module.exports = {
    entry: './index.js',
    output: { path: __dirname + "/dest/", filename: 'bundle.js' },
    module: {
        rules: [
            { test: /\.less$/, exclude: /node_modules/, use: [ 'style-loader', 'css-loader', 'less-loader' ]},
            { test: /\.css$/, exclude: /node_modules/, use: [ 'style-loader', 'css-loader'] }
        ]
    }
};