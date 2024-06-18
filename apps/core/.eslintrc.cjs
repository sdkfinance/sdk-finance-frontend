require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: ['@sdk5/eslint-config'],
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
  },
};
