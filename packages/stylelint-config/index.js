module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-scss',
    'stylelint-config-recommended-vue',
    'stylelint-prettier/recommended',
    'stylelint-config-prettier',
  ],
  rules: {
    'media-feature-range-notation': ['prefix'],
    'import-notation': ['string'],
    'media-query-no-invalid': null,
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep'],
      },
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['extend', 'mixin', 'include', 'if', 'else', 'tailwind', 'apply', 'variants', 'responsive', 'screen'],
      },
    ],
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['extend', 'mixin', 'include', 'if', 'else', 'tailwind', 'apply', 'variants', 'responsive', 'screen'],
      },
    ],
    'declaration-block-trailing-semicolon': null,
    'no-descending-specificity': null,
    'selector-class-pattern': null,
    'max-line-length': 200,
    'declaration-block-no-redundant-longhand-properties': null,
  },
};
