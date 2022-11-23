const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  lintOnSave: true,

  transpileDependencies: [
    'vuex-module-decorators',
  ],

  devServer: {
    proxy: {
      '/api/v1': {
        target: process.env.BACKEND_HOST,
        secure: false,
        changeOrigin: true,
        onProxyReq(request) {
          request.setHeader('origin', process.env.BACKEND_HOST);
        },
      },
    },

    host: 'local.sdk.finance',
  },

  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "~@/assets/styles/tools/index.scss";',
        sassOptions: {
          quietDeps: true,
        },
      },
    },
    extract: process.env.NODE_ENV === 'production' ? { ignoreOrder: true } : false,
  },
  configureWebpack: {
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles', // remove this line if you want get separated files
            type: 'css/mini-extract',
            priority: 10,
            chunks: 'async',
            minChunks: 1,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
    },
    plugins: [
      new StyleLintPlugin({
        files: ['**/*.{vue,scss,sass}'],
        fix: true,
      }),
    ],
  },
};
