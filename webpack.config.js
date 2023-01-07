const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
  const isProduction = env.production;

  return {
    mode: isProduction ? 'production' : 'development',
    entry: path.resolve(__dirname, 'src', 'index.ts'),
    output: {
      path: path.resolve(__dirname, 'build'),
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
              test: /\.(js|jsx|mjs|ts|tsx)$/,
              use: [
                {
                  loader: 'babel-loader',
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
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: path.resolve(__dirname, 'public/index.html'),
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.js', '.ts'],
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
