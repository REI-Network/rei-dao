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
          include: [
            /node_modules\/@walletconnect/,
            /node_modules\/@msgpack/,
            /node_modules\/graphql/
          ],
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    browsers: ['> 1%', 'last 2 versions', 'not dead']
                  }
                }]
              ],
              plugins: [
                '@babel/plugin-transform-numeric-separator',
                '@babel/plugin-transform-optional-chaining',
                '@babel/plugin-transform-nullish-coalescing-operator'
              ]
            }
          }
        }
      ]
    }
  }
};
