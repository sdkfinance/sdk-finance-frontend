module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-scss',
    'stylelint-config-recommended-vue/scss',
    'stylelint-prettier/recommended',
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
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['extend', 'mixin', 'include', 'if', 'else', 'tailwind', 'apply', 'variants', 'responsive', 'screen'],
      },
    ],
    'no-descending-specificity': null,
    'selector-class-pattern': null,
    'declaration-block-no-redundant-longhand-properties': null,
  },
  ignoreFiles: ['dist/**/*', 'source_code/**/*', 'packages/vue-toast/**/*', 'apps/core/src/assets/icomoon/**/*.css'],
};
