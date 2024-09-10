const webpack = require('webpack');
const path = require('path');

const { override, useBabelRc, addWebpackModuleRule } = require('customize-cra');

function projectOverrides(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    buffer: require.resolve('buffer'),
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);
  config.ignoreWarnings = [/Failed to parse source map/];
  config.module.rules.push({
    test: /\.(js|ts|mjs|jsx|tsx)$/,
    enforce: 'pre',
    loader: require.resolve('source-map-loader'),
    resolve: {
      fullySpecified: false,
    },
  });
  return config;
}

module.exports = override(
  projectOverrides,
  useBabelRc(),
  addWebpackModuleRule({
    test: /\.js$/,
    include: [path.resolve(__dirname, 'node_modules', '@lifi', 'widget')],
  }),
);
