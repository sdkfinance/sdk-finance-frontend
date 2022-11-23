module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:vue/essential',
    'plugin:vue/recommended',
    'plugin:vue/strongly-recommended',
    '@vue/typescript',
    'plugin:storybook/recommended',
    'plugin:storybook/recommended',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    semi: ['error', 'always'],
    'import/extensions': ['error', 'never', {
      vue: 'always',
    }],
    'import/prefer-default-export': 'off',
    'lines-between-class-members': ['error', 'always'],
    'padded-blocks': ['warn', {
      classes: 'always',
    }],
    'vue/html-closing-bracket-spacing': ['warn', {
      startTag: 'never',
      endTag: 'never',
      selfClosingTag: 'never',
    }],
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'never',
    }],
    camelcase: ['error', {
      properties: 'never',
    }],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error', {
      builtinGlobals: false,
      hoist: 'functions',
      allow: ['state', 'getters'],
    }],
    'max-len': ['error', {
      code: 150,
    }],
    'linebreak-style': 0,
    'vue/component-name-in-template-casing': ['error', 'kebab-case', {
      registeredComponentsOnly: true,
    }],
    'no-param-reassign': ['error', {
      ignorePropertyModificationsFor: ['state'],
    }],
    '@typescript-eslint/no-unused-vars': [2, {
      args: 'none',
    }],
    'class-methods-use-this': 'off',
    'key-spacing': ['error', {
      afterColon: true,
    }],
    '@typescript-eslint/type-annotation-spacing': ['error', {
      after: true,
    }],
    'vue/padding-line-between-blocks': ['error', 'always'],
    '@typescript-eslint/member-delimiter-style': ['error'],
    'template-curly-spacing': ['error', 'never'],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'vue/valid-v-slot': ['error', {
      allowModifiers: true,
    }],
    'simple-import-sort/imports': 'error',

  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  plugins: ['vue', 'json-format', 'simple-import-sort'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
        moduleDirectory: ['node_modules', 'src/'],
      },
      alias: {
        map: [['@', './src']],
        extensions: ['.js', '.vue', '.ts', '.js'],
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          paths: ['node_modules/'],
        },
      },
    },
    'json/sort-package-json': 'standard',
    'json/ignore-files': ['**/package-lock.json', '**/package.json'],
  },
};
