module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    ENV: true,
  },
  parserOptions: {
    sourceType: 'module',
    parser: 'babel-eslint',
  },
  rules: {
    semi: ['error', 'always'],
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'off',
    'no-useless-escape': 'off',
    'no-cond-assign': 'off',
    'no-useless-catch': 'off',
    'no-unsafe-finally': 'off',
  },
};
