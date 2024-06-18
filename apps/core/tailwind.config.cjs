/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */

module.exports = {
  content: ['./index.html', './src/**/*.vue', '../../packages/**/*.vue', '../../core-modules/**/*.vue'],
  presets: [require('@sdk5/tailwind-config')],
};
