
const path = require('path');
const fs = require('fs');

let entries = {
    index: './src/index.ts'
}
for (let exercise of [
    "checkerboard",
    "circle",
    "gammacorrection",
    "cmyk",
    "quantise",
    "dda",
    "bresenham",
    "raytracing",
    "phong",
    "matrix",
    "scenegraph",
    "rasterisation",
    "shading",
    "perspective",
    "animation",
]) {
    if (fs.existsSync(path.resolve(__dirname, `src/${exercise}-boilerplate.ts`))) {
        entries[exercise] = `./src/${exercise}-boilerplate.ts`;
    }
}

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: entries,
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.glsl$/i,
                use: 'raw-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
};