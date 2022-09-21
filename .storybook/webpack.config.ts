const path = require('path');

module.exports = ({ config }) => {

  config.module.rules = [
    ...config.module.rules,
    {
      test: /\.vue$/,
      loader: 'vue-docgen-loader',
      enforce: 'post',
    },
    {
      test: /\.scss$/,
      use: [
       'style-loader',
       'css-loader',
       'postcss-loader',
        {
          loader: 'sass-loader',
          options: {
            additionalData: `@import "~@/assets/styles/tools/index.scss";`,
            sassOptions: {
              quietDeps: true
            }
          }
        },
      ],
    },
    {
      test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      loaders: ['file-loader'],
      include: path.resolve(__dirname, '../src/assets/fonts')
    }
  ];

  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.join(__dirname, '../src'),
    '~@': path.join(__dirname, '../src'),
  };

  return config;
};
