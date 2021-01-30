module.exports = {
  root: true,
  env: { node: true },
  extends: [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "@vue/prettier",
  ],
  parserOptions: {
    "parser": "babel-eslint",
    "sourceType": "module",
    "ecmaVersion": 2020,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",

    // https://eslint.vuejs.org/rules/attribute-hyphenation.html
    // 属性をケバブケースにするかどうか
    "vue/attribute-hyphenation": ["error", "never", {
      "ignore": ["custom-prop"],
    }],
    // コンポーネント定義時の名前を、(パスカルorケバブ)ケースにする
    "vue/component-definition-name-casing": ["error",
      "PascalCase"  // | "kebab-case"
    ],
    // 開始タグの末尾( > )を改行させるかどうか
    "vue/html-closing-bracket-newline": ["error", {
      "singleline": "never",
      "multiline": "always",
    }],
    // タグの末尾( > )の前にスペースを入れるかどうか
    "vue/html-closing-bracket-spacing": ["error", {
      "startTag": "never",
      "endTag": "never",
      "selfClosingTag": "always",
    }],
    // HTMLのインデントの設定
    "vue/html-indent": ["error", 2, {
      "attribute": 1,
      "baseIndent": 1,
      "closeBracket": 0,
      "alignAttributesVertically": true,
      "ignores": [],
    }],
    // 属性指定時のクオートを(シングルorダブル)にする
    "vue/html-quotes": ["error",
      "double", // | "single",
      { "avoidEscape": false }
    ],
    // 中身を持たない要素の終了タグを省略するどうか
    "vue/html-self-closing": ["error", {
      "html": {
        "void": "never",
        "normal": "always",
        "component": "always"
      },
      "svg": "always",
      "math": "always"
    }],
    // タグ構文の一行あたりに許容される属性の数
    "vue/max-attributes-per-line": ["error", {
      "singleline": 3,
      "multiline": {
        "max": 1,
        "allowFirstLine": false
      }
    }],
    // 複数行要素の内容の前後に改行を強制するかどうか
    "vue/multiline-html-element-content-newline": ["error", {
      "ignoreWhenEmpty": true,
      "ignores": ["pre", "textarea", /* ...INLINE_ELEMENTS */],
      "allowEmptyLines": true
    }],
    // {{}} 構文の内側の両端にスペースを必要とするかどうか
    "vue/mustache-interpolation-spacing": ["error",
      "always"  // | "never"
    ],
    // タグの記述において複数のスペースを許容するかどうか
    "vue/no-multi-spaces": ["error", {
      "ignoreProperties": true
    }],
    // = の左右のスペースを許容するかどうか
    "vue/no-spaces-around-equal-signs-in-attribute": ["error"],
    // プロパティ名を(キャメルorスネーク)ケースにする
    "vue/prop-name-casing": ["error",
      "camelCase" // | "snake_case"
    ],
    // プロパティのデフォルト値を必須とする
    "vue/require-default-prop": ["error"],
    // プロパティのタイプ指定を必須とする
    "vue/require-prop-types": ["error"],
    // タグの中身を改行させるかどうか
    "vue/singleline-html-element-content-newline": ["error", {
      "ignoreWhenNoAttributes": true,
      "ignoreWhenEmpty": true,
      "ignores": ["pre", "textarea", "span" /* ...INLINE_ELEMENTS */]
    }],
    // v-bind構文を省略記法にするかどうか
    "vue/v-bind-style": ["error",
      "shorthand"  // | "longform"
    ],
    // v-on構文を省略記法にするかどうか
    "vue/v-on-style": ["error",
      "shorthand"  // | "longform"
    ],
    // v-slot構文を省略記法にするかどうか
    "vue/v-slot-style": ["error", {
      "atComponent": "shorthand", // | "longform" | "v-slot"
      "default": "shorthand",     // | "longform" | "v-slot"
      "named": "shorthand",       // | "longform"
    }],

    "semi": ["warn", "never"],
    "quotes": ["warn", "single"],
    "comma-dangle": ["warn", "only-multiline"],
    "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }],
    "prettier/prettier": "off",
  }
}
