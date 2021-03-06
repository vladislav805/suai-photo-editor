const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const mode = isProduction ? 'production' : 'development';

const progressLineSymbols = ['▏','▎','▍','▌','▋','▊','▉', '█'];
const getProgressLine = length => !isProduction ? () => {} : percent => {
    if (percent === 1) {
        process.stdout.clearLine && process.stdout.clearLine(0);
        process.stdout.write('\rSuccessfully completed')
        return;
    }

    const full = ~~(percent * length);
    const chapter = ~~(1 / length * progressLineSymbols.length);

    let str = '█'.repeat(full) + progressLineSymbols[chapter] + ' '.repeat(Math.max(length - full - 1, 0));
    process.stdout.write(`\r[${str}] ${~~(percent * 100)}%`);
};

module.exports = {
    mode,

    target: 'web',

    entry: {
        main: path.resolve('src', 'index.tsx'),
    },

    output: {
        path: path.resolve('dist'),
        filename: '[name].js',
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: require.resolve('awesome-typescript-loader'),
                        options: {
                            useBabel: true,
                            silent: isProduction,
                        },
                    },
                ],
                exclude: /node_modules/,

            },
            {
                test: /\.s?css$/i,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                exclude: /(node_modules)/,
                use: ['file-loader'],
            },
        ],
    },

    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },

    optimization: {
        minimize: isProduction,
        minimizer: [new TerserPlugin()],
    },

    externals: {
        'react': 'React',
        'react-dom' : 'ReactDOM',
    },

    plugins: [
        new webpack.ProgressPlugin(getProgressLine(50)),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.EnvironmentPlugin({
            VERSION: process.env.npm_package_version,
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new HtmlWebpackPlugin({
            title: 'Photo editor',
            template: path.resolve('public', 'index.html'),
            chunks: ['main'],
            minify: true,
            filename: 'index.html',
        }),
    ],

    devtool: '#sourcemap',
    devServer: {
        contentBase: path.resolve('public'),
        host: '0.0.0.0',
        port: 8080,
    },

    stats: 'minimal',
};
