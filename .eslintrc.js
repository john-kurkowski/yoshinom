module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:ember-suave/recommended',
  ],
  env: {
    browser: true,
  },
  globals: {
    s: true,
  },
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'ember-suave/no-const-outside-module-scope': 'off',
  }
};
