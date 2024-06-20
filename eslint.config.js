import path from 'node:path';

import js from '@eslint/js';
import tsEslintParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import jsonFormatPlugin from 'eslint-plugin-json-format';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import vuePlugin from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import vueEslintParser from 'vue-eslint-parser';

export default tseslint.config(
  js.configs.recommended,
  ...vuePlugin.configs['flat/vue2-recommended'],
  ...tseslint.configs.recommended,
  prettierRecommended,
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
  },
  {
    languageOptions: {
      parser: vueEslintParser,
      parserOptions: {
        parser: tsEslintParser,
        sourceType: 'module',
        ecmaVersion: 'latest',
        ecmaFeatures: {
          legacyDecorators: true,
        },
      },
    },
  },
  {
    ignores: [
      '.husky',
      'source_code',
      'dist',
      'patches',
      'packages/vue-toast',
      'packages/tailwind-config',
      'packages/eslint-config',
      'packages/stylelint-config',
      '**/.storybook',
      '**/*.cjs',
      '!stylelint.config.cjs',
    ],
  },
  {
    plugins: {
      'json-format': jsonFormatPlugin,
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
    },
  },
  {
    files: ['{apps,core-modules,packages}/**/*.{ts,vue,js}'],
    rules: {
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
      '@typescript-eslint/no-shadow': [
        'error',
        {
          builtinGlobals: false,
          hoist: 'functions',
          allow: ['state', 'getters'],
        },
      ],
      '@typescript-eslint/no-use-before-define': ['error'],
      '@typescript-eslint/no-unused-vars': [
        2,
        {
          args: 'none',
          ignoreRestSiblings: true,
        },
      ],
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
      '@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false }],
    },
  },
  {
    files: ['{apps,core-modules,packages}/**/*.vue'],
    rules: {
      'vue/valid-v-slot': [
        'error',
        {
          allowModifiers: true,
        },
      ],
      'vue/padding-line-between-blocks': ['error', 'always'],
      'vue/component-name-in-template-casing': [
        'error',
        'kebab-case',
        {
          registeredComponentsOnly: true,
        },
      ],
      'vue/html-closing-bracket-spacing': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': 'off',
      'vue/html-closing-bracket-newline': 'off',
    },
  },
  {
    rules: {
      'prettier/prettier': 'off',
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
      'no-console': 'warn',
      'no-debugger': 'warn',
      'lines-between-class-members': ['error', 'always'],
      'padded-blocks': 'off',
      camelcase: 'off',
      'no-shadow': 'off',
      'max-len': [
        'error',
        {
          code: 150,
        },
      ],
      'linebreak-style': 0,
      'no-param-reassign': [
        'error',
        {
          ignorePropertyModificationsFor: ['state'],
        },
      ],
      'class-methods-use-this': 'off',
      'no-use-before-define': 'off',
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
      'no-unsafe-optional-chaining': 'off',
      'default-param-last': 'off',
      'no-restricted-exports': 'off',
      'no-promise-executor-return': 'off',
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
      'import/first': 'off',
      'import/named': 'off',
      'import/namespace': 'off',
      'import/default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/extensions': [
        'error',
        'never',
        {
          vue: 'always',
          scss: 'always',
        },
      ],
      'import/prefer-default-export': 'off',
      'simple-import-sort/imports': 'error',
    },
  },
  {
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
          moduleDirectory: ['node_modules'],
        },
      },
      'json/sort-package-json': 'standard',
      'json/ignore-files': ['**/package-lock.json', '**/package.json'],
    },
  },
  {
    files: ['apps/core/**/*.vue', 'core-modules/back-office/src/**/*.vue'],
    rules: {
      'vue/no-v-html': 'off',
    },
  },
  {
    files: ['apps/core/**/*.{js,vue,ts}'],
    settings: {
      'import/resolver': {
        alias: {
          map: [['@', path.resolve('./apps/core/src')]],
          extensions: ['.js', '.vue', '.ts', '.scss'],
        },
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
  {
    files: ['stylelint.config.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
  {
    files: ['scripts/**/*.js', '**/*.config.{js,ts}'],
    rules: {
      'no-useless-catch': 'off',
      'no-console': 'off',
      'import/no-unresolved': 'off',
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.{js,cjs,mjs}'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['vuex.d.ts'],
    rules: {
      'import/extensions': 'off',
    },
  },
  {
    files: ['shims-vue.d.ts'],
    rules: {
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
);
