var path = require('path');


var rules = [
  { test: /\.css$/, use: ['style-loader', 'css-loader'] },
  // required to load font-awesome
  {
    test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
    use:
      'url-loader?limit=10000&mimetype=application/font-woff&publicPath=/voila/static/'
  },
  {
    test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
    use:
      'url-loader?limit=10000&mimetype=application/font-woff&publicPath=/voila/static/'
  },
  {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    use:
      'url-loader?limit=10000&mimetype=application/octet-stream&publicPath=/voila/static/'
  },
  {
    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    use: 'file-loader&publicPath=/voila/static/'
  },
  {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    use:
      'url-loader?limit=10000&mimetype=image/svg+xml&publicPath=/voila/static/'
  }
];

var distRoot = path.resolve(
  __dirname,
  '..',
  '..',
  'solara',
  'server',
  'static',
  'dist',
);

module.exports = [
  {
    entry: ['./lib/index.js'],
    output: {
      filename: 'solara.js',
      libraryTarget: 'umd',
      devtoolModuleFilenameTemplate: `webpack://@widgetti/solara-widget-manager`
    },
    module: { rules: rules },
    devtool: 'source-map'
  }
];
