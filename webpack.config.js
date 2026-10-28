const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { appshellRemote } = require('@appshell/webpack-plugin');
const ReactRefreshSingleton = require('single-react-refresh-plugin');
const { merge } = require('webpack-merge');
const { dependencies, devDependencies } = require('./package.json');

/*
 * appshellRemote() is what every appshell micro-frontend needs: the federation setup the
 * application's shell expects, a dev server an overlay can load from, and the plugin that writes
 * the manifest. @appshell/webpack-plugin's README has each setting and why. What's below it is
 * this starter's own: Babel for TypeScript and React, React Fast Refresh while developing, and
 * plain CSS.
 */
module.exports = (_env, { mode }) => {
  const isDevelopment = mode === 'development';

  return merge(
    appshellRemote({
      name: 'HelloModule',
      exposes: { './Hello': './src/Hello' },
      port: Number(process.env.PORT) || 7400,
      mode,
      react: true,
      dependencies,
      uniqueName: 'hello',
      // One Fast Refresh runtime for the page, as there's one React.
      shared: isDevelopment
        ? { 'react-refresh': { singleton: true, requiredVersion: devDependencies['react-refresh'] } }
        : {},
    }),
    {
      devServer: { hot: true },
      resolve: { extensions: ['.js', '.ts', '.tsx'] },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-react', { runtime: 'automatic' }],
                  '@babel/preset-typescript',
                ],
                plugins: isDevelopment ? ['react-refresh/babel'] : [],
              },
            },
          },
          { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
        ],
      },
      plugins: isDevelopment
        ? [new ReactRefreshPlugin({ overlay: false }), new ReactRefreshSingleton()]
        : [],
    },
  );
};
