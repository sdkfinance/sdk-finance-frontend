module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-scss',
    'stylelint-config-recommended-vue',
  ],
  ignoreFiles: [
    './src/assets/styles/ui-framework/**/*.scss',
    './src/assets/icomoon/**/*.css',
    './public/index.html',
  ],
  rules: {
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep'],
      },
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'extend',
          'mixin',
          'include',
          'if',
          'else',
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
        ],
      },
    ],
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'extend',
          'mixin',
          'include',
          'if',
          'else',
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
        ],
      },
    ],
    'declaration-block-trailing-semicolon': null,
    'no-descending-specificity': null,
    'selector-class-pattern': null,
    'max-line-length': 200,
    'string-quotes': 'double',
    'declaration-block-no-redundant-longhand-properties': null,
  },
};
