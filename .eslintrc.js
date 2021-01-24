module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "@vue/prettier",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    "parser": "babel-eslint",
    "ecmaVersion": 2020,
    "sourceType": "module",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/html-closing-bracket-newline": ["error", {
      "singleline": "never",
      "multiline": "always",
    }],
    "vue/html-closing-bracket-spacing": ["error", {
      "startTag": "never",
      "endTag": "never",
      "selfClosingTag": "always",
    }],
    "vue/html-indent": ["error", 2, {
      "attribute": 1,
      "baseIndent": 1,
      "closeBracket": 0,
      "alignAttributesVertically": true,
      "ignores": [],
    }],
    "vue/max-attributes-per-line": ["error", {
      "singleline": 1,
      "multiline": {
        "max": 1,
        "allowFirstLine": false,
      },
    }],
    // "vue/block-tag-newline": "error",
    "semi": ["error", "never"],
    "quotes": ["error", "single"],
    "comma-dangle": ["error", "only-multiline"],
    // "linebreak-style": ["error", "unix"],
    "prettier/prettier": [
      "off",
      {
        "htmlWhitespaceSensitivity": 'ignore',
        "semi": false,
        "singleQuote": true,
        "trailingComma": "all",
      },
    ],
  },
};
