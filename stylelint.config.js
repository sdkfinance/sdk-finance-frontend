module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-recommended-scss'],
  ignoreFiles: [
    './src/assets/styles/ui-framework/**/*.scss',
    './src/assets/icomoon/**/*.css',
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
  },
};
