module.exports = {
  env: {
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:vue/recommended',
    '@vue/typescript',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'plugin:storybook/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'off',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'import/extensions': [
      'error',
      'never',
      {
        vue: 'always',
      },
    ],
    'import/prefer-default-export': 'off',
    'lines-between-class-members': ['error', 'always'],
    'padded-blocks': 'off',
    'vue/html-closing-bracket-spacing': 'off',
    camelcase: 'off',
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'default',
        format: ['UPPER_CASE', 'camelCase', 'snake_case', 'PascalCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: [
          'classProperty',
          'objectLiteralProperty',
          'typeProperty',
          'classMethod',
          'objectLiteralMethod',
          'typeMethod',
          'accessor',
          'enumMember',
        ],
        format: null,
        modifiers: ['requiresQuotes'],
      },
      {
        selector: 'variable',
        modifiers: ['destructured'],
        format: null,
      },
    ],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': [
      'error',
      {
        builtinGlobals: false,
        hoist: 'functions',
        allow: ['state', 'getters'],
      },
    ],
    'max-len': [
      'error',
      {
        code: 150,
      },
    ],
    'linebreak-style': 0,
    'vue/component-name-in-template-casing': [
      'error',
      'kebab-case',
      {
        registeredComponentsOnly: true,
      },
    ],
    'no-param-reassign': [
      'error',
      {
        ignorePropertyModificationsFor: ['state'],
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      2,
      {
        args: 'none',
        ignoreRestSiblings: true,
      },
    ],
    'class-methods-use-this': 'off',
    'vue/padding-line-between-blocks': ['error', 'always'],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'vue/valid-v-slot': [
      'error',
      {
        allowModifiers: true,
      },
    ],
    'simple-import-sort/imports': 'error',
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: 'if',
      },
      {
        blankLine: 'always',
        prev: 'if',
        next: '*',
      },
    ],
    curly: ['warn', 'all'],
    'no-useless-concat': 'warn',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
    '@typescript-eslint/no-empty-interface': 'warn',
    '@typescript-eslint/adjacent-overload-signatures': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'no-unsafe-optional-chaining': 'off',
    'default-param-last': 'off',
    'no-restricted-exports': 'off',
    'no-promise-executor-return': 'off',
    'import/named': 'off',
    'import/no-unresolved': ['error', { ignore: ['^@sdk5/+'] }],
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false }],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['vue'],
            importNames: ['defineProps', 'defineEmits', 'withDefaults'],
            message: "'defineProps', 'defineEmits' and 'withDefaults' can be used within <script setup> without importing.",
          },
        ],
      },
    ],
    'vue/multi-word-component-names': 'off',
    'import/first': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.vue'],
      rules: {
        'no-dupe-class-members': 'off',
      },
    },
    {
      files: ['*.config.cjs', '*.config.js'],
      env: {
        node: true,
      },
    },
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 'latest',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  plugins: ['vue', '@typescript-eslint', 'prettier', 'json-format', 'simple-import-sort'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
    'json/sort-package-json': 'standard',
    'json/ignore-files': ['**/package-lock.json', '**/package.json'],
  },
  ignorePatterns: ['node_modules/', 'dist/', '.eslintrc.cjs'],
};
