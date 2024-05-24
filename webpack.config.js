// const path = require('path');
// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

// module.exports = {
//   entry: './js/script.js',
//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     filename: 'main.js',
//   },
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: ['@babel/preset-env'],
//             plugins: ['@babel/plugin-transform-runtime'],
//           },
//         },
//       },
//       {
//         test: /\.css$/,
//         use: [
//           MiniCssExtractPlugin.loader,
//           'css-loader',
//         ],
//       },
//       // Regra para processar imagens
//       {
//         test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
//         use: [
//           {
//             loader: 'file-loader',
//             options: {
//               name: '[path][name].[ext]',  // Preserva a estrutura de pastas
//               context: path.resolve(__dirname, 'img'),  // Define a pasta raiz para os arquivos
//               outputPath: 'img/',  // Pasta onde as imagens serão colocadas dentro de dist/
//               publicPath: 'img/',  // Caminho usado para referenciar as imagens no site
//             },
//           },
//         ],
//       }
//     ],
//   },
//   plugins: [
//     new MiniCssExtractPlugin({
//       filename: 'style.css', // Define o nome do arquivo CSS gerado
//       chunkFilename: '[id].css',
//     }),
//     new HtmlWebpackPlugin({
//       template: './index.html',  // Caminho para o seu arquivo HTML principal
//       filename: 'index.html'     // O nome do arquivo HTML na pasta dist
//     }),
//     new HtmlWebpackPlugin({
//       template: './contato.html',
//       filename: 'contato.html'
//     }),
//     new HtmlWebpackPlugin({
//       template: './estudio.html',
//       filename: 'estudio.html'
//     }),
//     new HtmlWebpackPlugin({
//       template: './projeto.html',
//       filename: 'projeto.html'
//     }),
//     new CopyWebpackPlugin({
//       patterns: [
//         { from: 'img', to: 'img' },  // Copia a estrutura de diretórios de 'img' para 'dist/img'
//         { from: 'projetos.json', to: 'projetos.json' }  // Copia o arquivo projetos.json para a raiz de 'dist'
//       ]
//     })
//   ],
//   optimization: {
//     minimize: true,
//     minimizer: [
//       '...',
//       new CssMinimizerPlugin(),
//     ],
//   },
// };
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
      filename: 'style.css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      '...',
      new CssMinimizerPlugin(),
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    watchFiles: ['src/**/*', 'index.html'],
  },
};
