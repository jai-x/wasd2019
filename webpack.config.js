const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const screens = [
  // Graphics
  {
    name: 'Start',
    entry: 'src/graphics/start/index.js',
    outputFolder: 'graphics/start',
  },
  {
    name: 'Break',
    entry: 'src/graphics/break/index.js',
    outputFolder: 'graphics/break',
  },
  {
    name: 'fourThree',
    entry: 'src/graphics/fourThree/index.js',
    outputFolder: 'graphics/fourThree',
  },
  {
    name: 'sixteenNine',
    entry: 'src/graphics/sixteenNine/index.js',
    outputFolder: 'graphics/sixteenNine',
  },
  // Dashboards
  {
    name: 'Countdown',
    entry: 'src/dashboard/countdown/index.js',
    outputFolder: 'dashboard/countdown',
  },
  {
    name: 'Timer',
    entry: 'src/dashboard/timer/index.js',
    outputFolder: 'dashboard/timer',
  },
  {
    name: 'Schedule',
    entry: 'src/dashboard/schedule/index.js',
    outputFolder: 'dashboard/schedule',
  },
];

// Generates a new webpack config module for each screen
module.exports = screens.map(screen => ({
  entry: path.join(__dirname, screen.entry),

  output: {
    path: path.join(__dirname, screen.outputFolder),
    filename: 'bundle.js',
  },

  devtool: 'source-map',

  stats: 'minimal',

  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({ title: `WASD 2019 - ${screen.name}` }),
  ],

  module: {
    rules: [
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader?modules'] },
      { test: /\.svg$/, loader: 'url-loader' },
      { test: /\.js$/, exclude: /node_modules/, loader: 'eslint-loader' },
      { test: /\.(otf|png)$/, loader: 'file-loader' },
    ],
  },
}));
