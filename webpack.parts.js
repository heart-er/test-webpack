const path = require('path');
const glob = require('glob');
const { MiniHtmlWebpackPlugin } = require('mini-html-webpack-plugin');
const { WebpackPluginServe } = require('webpack-plugin-serve');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
const { ALL } = require('dns');

const ALL_FILES = glob.sync(path.join(__dirname, 'src/*.js'));

const APP_SOURCE = path.join(__dirname, 'src');


exports.devServer = () => ({
    watch: true,
    plugins: [
        new WebpackPluginServe({
            port: process.env.PORT || 8080,
            static: './dist',
            liveReload: true,
            waitForBuild: true,
        }),
    ]
});

exports.page = ({ title }) => ({
    plugins: [
        new MiniHtmlWebpackPlugin({ context: { title: title } }),
    ]
});

exports.extractCSS = ({ options = {}, loaders = [] } = {}) => ({
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader, options,
                    },
                    'css-loader'
                ].concat(loaders),
                sideEffects: true,
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),

    ]
});

exports.tailwind = () => ({
    loader: "postcss-loader",
    options: {
        postcssOptions: { plugins: [require("tailwindcss")()] },
    },
});

exports.eliminateUnusedCSS = () => ({
    plugins: [
        new PurgeCSSPlugin({
            paths: ALL_FILES,
            extractors: [
                {
                    extractor: (content) => content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
                    extensions: ['html'],
                }
            ],
        }),
    ],
});

exports.autoprefix = () => ({
    loader: 'postcss-loader',
    options: {
        postcssOptions: {
            plugins: [
                require('autoprefixer')(),
            ]
        }
    }
});

exports.loadImages = ({ limit } = {}) => ({
    module: {
        rules: [
            {
                test: /\.(png|jpg)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: limit,
                    }
                }
            }
        ]
    }
});

exports.loadFonts = ({ limit } = {}) => ({
    module: {
        rules: [
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: limit,
                    }
                }
            }
        ]
    }
});

exports.loadJavaScript = () => ({
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                include: APP_SOURCE,
                use: 'babel-loader',
            }
        ]
    }
});

exports.generateSourceMaps = ({ type }) => ({ devtool: type });

































































































