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
  },
  configureWebpack: {
    plugins: [
      new StyleLintPlugin({
        files: ['**/*.{vue,html,scss,sass}'],
        fix: true,
      }),
    ],
  },
};
