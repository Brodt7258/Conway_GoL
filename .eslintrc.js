module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": ["airbnb"],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "react-hooks"
    ],
    "rules": {
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "comma-dangle": ["error", "never"],
        "max-len": ["error", { "code": 140, "ignoreTrailingComments": true }],
        "no-console": ["error", { allow: ["warn", "error", "log"] }],
        "arrow-body-style": "off",
        "no-use-before-define": "off",
        "import/prefer-default-export": "off",
        "react/jsx-props-no-spreading": "off",
        "object-curly-newline": "off",
        "no-param-reassign": "off"
    }
};