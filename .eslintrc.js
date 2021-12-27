module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  env: {
    es6: true,
    browser: true,
    jest: true,
    commonjs: true,
    node: true,
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  globals: {
    wx: true,
    App: true,
    Page: true,
    Component: true,
    Behavior: true,
  },
  rules: {
    'no-console': 0,
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    indent: ['error', 2, { SwitchCase: 1 }],
    'comma-spacing': 'error',
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'object-curly-spacing': ['error', 'always'],
    '@typescript-eslint/ban-ts-comment': 'off',
    "@typescript-eslint/interface-name-prefix": 'off'
  },
}
