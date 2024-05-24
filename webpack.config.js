const path = require('path');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './js/script.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css', // Define o nome do arquivo CSS gerado
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      template: './index.html',  // Caminho para o seu arquivo HTML principal
      filename: 'index.html'     // O nome do arquivo HTML na pasta dist
    }),
    new HtmlWebpackPlugin({
      template: './contato.html',
      filename: 'contato.html'
    }),
    new HtmlWebpackPlugin({
      template: './estudio.html',
      filename: 'estudio.html'
    }),
    new HtmlWebpackPlugin({
      template: './projeto.html',
      filename: 'projeto.html'
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      '...',
      new CssMinimizerPlugin(),
    ],
  },
};
