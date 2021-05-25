module.exports = {
    'env': {
        'browser': true,
        'es6': true,
        'node': true
    },
    'extends': 'eslint:recommended',
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly',
        'ENV': true,
        'EDITH_VERSION': 'readonly',
        'IS_DEV': 'readonly',
        'FORMAT': 'readonly',
    },
    "parser": "babel-eslint",
    'parserOptions': {
        'ecmaVersion': 2018,
        'sourceType': 'module',
        "codeFrame": false
    },
    "plugins": [],
    'rules': {
        'no-constant-condition': 0,
        'no-global-assign': 0,
        'quotes': 0,
        'no-unused-vars': 0,
        // 'semi': [
        //   'error',
        //   'always'
        // ]
    }
};
