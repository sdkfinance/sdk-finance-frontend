/* eslint-env node */

module.exports = {
  extends: '@sdk5/stylelint-config',
  ignoreFiles: [
    './src/assets/styles/ui-framework/**/*.scss',
    './src/assets/icomoon/**/*.css',
    './public/index.html',
    './src/lib/**/*.scss',
    './dist',
    './index.html',
    './.storybook',
    './storybook-static',
  ],
};
