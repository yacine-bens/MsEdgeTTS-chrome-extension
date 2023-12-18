'use strict';
const webpack = require('webpack');

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = (env, argv) =>
  merge(common, {
    entry: {
      sidepanel: PATHS.src + '/sidepanel.ts',
      background: PATHS.src + '/background.ts',
    },
    devtool: argv.mode === 'production' ? false : 'source-map',
    resolve: {
      fallback: {
        "stream": require.resolve('stream-browserify'),
        "buffer": require.resolve('buffer'),
        "crypto": require.resolve('crypto-browserify'),
        "fs": false
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser'
      })
    ]
  });

module.exports = config;