const path = require('path');

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
          postcssOptions: {
            plugins: [require("tailwindcss")('./tailwind.config.js'), require("autoprefixer")],
          }
        },
      },
    },
  ],
  "staticDirs": ['../public/'],
  "framework": "@storybook/vue",
  "core": {
    "builder": "@storybook/builder-webpack5"
  },
  webpackFinal: async (config) => {
      config.module.rules.push({
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
      });

      config.module.rules.push({
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: ['file-loader'],
        include: path.resolve(__dirname, '../src/assets/fonts')
      });

      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.join(__dirname, '../src'),
        '~@': path.join(__dirname, '../src'),
      };


      return config;
  },
}
