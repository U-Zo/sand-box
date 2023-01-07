const fs = require('fs');
const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

module.exports = (env) => {
  const mode = env.production ? 'production' : 'development';
  const isProduction = mode === 'production';
  const isDevelopment = mode === 'development';

  return {
    mode,
    entry: path.resolve(__dirname, 'src/index.tsx'),
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: isProduction
        ? 'static/js/[name].[contenthash:8].js'
        : 'static/js/[name].js',
      chunkFilename: isProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : 'static/js/[name].chunk.js',
      assetModuleFilename: isProduction
        ? 'static/media/[name].[hash][ext]'
        : 'static/js/[name][ext]',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.(bmp|gif|jpe?g|png)$/,
              type: 'asset',
              parser: {
                dataUrlCondition: {
                  maxSize: 10000,
                },
              },
            },
            {
              test: /\.svg$/,
              use: [
                {
                  loader: '@svgr/webpack',
                  options: {
                    prettier: false,
                    svgo: false,
                    svgoConfig: {
                      plugins: [{ removeViewBox: false }],
                    },
                    titleProp: true,
                    ref: true,
                  },
                },
                {
                  loader: 'file-loader',
                  options: {
                    name: isProduction
                      ? 'static/media/[name].[hash].[ext]'
                      : 'static/media/[name].[ext]',
                  },
                },
              ],
              issuer: {
                and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
              },
            },
            {
              test: /\.(js|jsx|mjs|ts|tsx)$/,
              use: [
                {
                  loader: 'esbuild-loader',
                  options: {
                    loader: 'tsx',
                    target: 'es2015',
                  },
                },
              ],
              include: path.resolve(__dirname, 'src'),
            },
            {
              exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              type: 'asset/resource',
            },
          ],
        },
      ],
    },
    resolve: {
      alias: {
        '@/esbuild': path.resolve('src'),
      },
      extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx'],
    },
    plugins: [
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ko/),
      !isProduction &&
        new HtmlWebpackPlugin({
          inject: true,
          template: path.resolve(__dirname, 'public/index.html'),
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          },
        }),
      new WebpackManifestPlugin({
        fileName: 'asset-manifest.json',
      }),
      isDevelopment && new ReactRefreshWebpackPlugin(),
      isDevelopment && new webpack.HotModuleReplacementPlugin(),
    ].filter(Boolean),
    cache: {
      type: 'filesystem',
      cacheDirectory: path.resolve(__dirname, 'node_modules/.cache'),
      store: 'pack',
      buildDependencies: {
        defaultWebpack: ['webpack/lib/'],
        config: [__filename],
        tsconfig: [path.resolve(__dirname, 'tsconfig.json')].filter((f) =>
          fs.existsSync(f)
        ),
      },
    },
    optimization: {
      minimizer: [
        new ESBuildMinifyPlugin({
          target: 'es2015',
          css: true,
        }),
      ],
    },
    devServer: {
      compress: true,
      client: {
        logging: 'none',
      },
      historyApiFallback: true,
      port: 3000,
      open: true,
    },
  };
};
