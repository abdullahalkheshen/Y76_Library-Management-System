// .eslintrc.js example
module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "parser": "@eslint-parser",
    "ecmaFeatures": {
        "jsx": true
    }
}