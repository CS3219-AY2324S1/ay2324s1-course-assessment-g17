module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "settings": {
      "react": {
        "version": 'detect'
      },
    },
    "extends": [
        "standard-with-typescript",
        "plugin:react/recommended"
    ],
    "overrides": [
        {
          "extends": [
            'plugin:@typescript-eslint/recommended-requiring-type-checking',
          ],
          "files": ['**/*.tsx']
        }
    ],
    "parser": '@typescript-eslint/parser',
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
    },
    "ignorePatterns": ['.eslintrc.js']
}
