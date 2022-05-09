module.exports = {
  env: {
    browser: false,
    node: true,
    commonjs: true,
    es6: true
  },
  extends: [
    'airbnb'
  ],
  globals: {
  },
  // parser: 'babel-eslint',
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module'
  },
  plugins: [],
  settings: {
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'windows'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'no-underscore-dangle': 0,
    'no-plusplus': 0,
    'no-param-reassign': 0,
    'no-console': 0,
    'no-alert': 0,
    'no-prompt': 0,
    '@typescript-eslint/no-undef': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'no-use-before-define': 'error',
    // '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/no-empty-function': 0,
    'no-unused-vars': 1,
    'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 0, maxEOF: 0 }],
    'import/no-named-as-default': 0
  }
};
