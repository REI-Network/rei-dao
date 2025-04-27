var path = require('path');
process.env.VUE_APP_VERSION = require('./package.json').version;
module.exports = {
  transpileDependencies: ['vuetify','@walletconnect'],
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },
  productionSourceMap: false,
  configureWebpack: {
    node: {
      module: 'empty'
    },
    optimization: {
      minimize: true
    },
    resolve: {
      alias: {
        'webworkify-webpack': path.resolve(__dirname, 'src/polyfills/webworkify')
        // module: 'module-deps'
      }
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          include: /node_modules\/@walletconnect/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-numeric-separator']
            }
          }
        }
      ]
    }
  }
};
