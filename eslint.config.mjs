module.exports = {
  extends: [
    'next/core-web-apps',
    'next/core-web-apps/react',
    'next/core-web-apps/import',
    'next/core-web-apps/stylelint',
    'next/core-web-apps/eslint-comments',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['import'],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  "env": {
    "node": true
  },
};