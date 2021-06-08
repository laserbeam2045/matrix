module.exports = {
  root: true,

  env: { node: true },

  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/typescript',
    '@vue/prettier',
    // 'airbnb',
  ],

  parserOptions: {
    parser     : '@typescript-eslint/parser',
    sourceType : 'module',
    ecmaVersion: 2020,
  },

  overrides: [
    {
      files: ['*.vue', '*.d.ts'],
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error'
      }
    },
  ],

  // settings: {
  //   'import/resolver': {
  //     'node': {
  //       'extensions': [
  //         '.js',
  //         '.jsx',
  //         '.json',
  //         '.ts',
  //         '.tsx'
  //       ]
  //     }
  //   }
  // },

  rules: {
    'no-console' : process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    // 'import/no-unresolved': [
    //   2,
    //   {
    //     'ignore': [
    //       '^@components',
    //       '^@types'
    //     ]
    //   }
    // ],

    /**
     * plugin:vue/vue3-recommended
     * https://eslint.vuejs.org/rules/
     */

    // 属性をケバブケースにするかどうか
    'vue/attribute-hyphenation': ['error', 'never', {
      'ignore': ['custom-prop'],
    }],

    // コンポーネント定義時の名前を、(PascalCase or kebab-case)にする
    'vue/component-definition-name-casing': ['error', 'PascalCase'],

    // 開始タグの末尾( > )を改行させるかどうか
    'vue/html-closing-bracket-newline': ['error', {
      'singleline': 'never',
      'multiline' : 'always',
    }],

    // タグの末尾( > )の前にスペースを入れるかどうか
    'vue/html-closing-bracket-spacing': ['error', {
      'startTag'      : 'never',
      'endTag'        : 'never',
      'selfClosingTag': 'always',
    }],

    // HTMLのインデントの設定
    'vue/html-indent': ['error', 2, {
      'attribute'                : 1,
      'baseIndent'               : 1,
      'closeBracket'             : 0,
      'alignAttributesVertically': true,
      'ignores'                  : [],
    }],

    // 属性指定時のクオートを(single or double)にする
    'vue/html-quotes': ['error',
      'double',
      { 'avoidEscape': false }],

    // 中身を持たない要素の終了タグを省略するどうか
    'vue/html-self-closing': ['error', {
      'html': {
        'void'     : 'never',
        'normal'   : 'always',
        'component': 'always',
      },
      'svg' : 'always',
      'math': 'always',
    }],

    // タグ構文の一行あたりに許容される属性の数
    'vue/max-attributes-per-line': ['error', {
      'singleline': 3,
      'multiline' : {
        'max'           : 1,
        'allowFirstLine': false,
      },
    }],

    // 複数行要素の内容の前後に改行を強制するかどうか
    'vue/multiline-html-element-content-newline': ['error', {
      'allowEmptyLines': true,
      'ignoreWhenEmpty': true,
      'ignores'        : ['pre', 'textarea'],
    }],

    // {{}} 構文の内側の両端にスペースを必要とするかどうか
    'vue/mustache-interpolation-spacing': ['error', 'always'],

    // タグの記述において複数のスペースを許容するかどうか
    'vue/no-multi-spaces': ['error', {
      'ignoreProperties': false,
    }],

    // HTML属性の、= の左右のスペースを許容するかどうか
    'vue/no-spaces-around-equal-signs-in-attribute': ['error'],

    // プロパティ名を(camelCase or snake_case)にする
    'vue/prop-name-casing': ['error', 'camelCase'],

    // プロパティのデフォルト値を必須とする
    'vue/require-default-prop': ['error'],

    // プロパティのタイプ指定を必須とする
    'vue/require-prop-types': ['error'],

    // タグの中身を改行させるかどうか
    'vue/singleline-html-element-content-newline': ['error', {
      'ignoreWhenNoAttributes': true,
      'ignoreWhenEmpty'       : true,
      'ignores'               : ['pre', 'textarea', 'span'],
    }],

    // v-bind構文を省略記法にするかどうか(shorthand or longform)
    'vue/v-bind-style': ['error', 'shorthand'],

    // v-on構文を省略記法にするかどうか(shorthand or longform)
    'vue/v-on-style': ['error', 'shorthand'],

    // v-slot構文を省略記法にするかどうか
    'vue/v-slot-style': ['error', {
      'atComponent': 'shorthand',   // | "longform" | "v-slot"
      'default'    : 'shorthand',   // | "longform" | "v-slot"
      'named'      : 'shorthand',   // | "longform"
    }],

    /**
     * eslint:recommended
     * https://eslint.org/docs/rules/
     */

    /* Best Practices */

    // 等式演算子===および!==を使用する
    'eqeqeq': ['error', 'always'],

    /* Stylistic Issues */

    // 配列の先頭と末尾を改行するかは自由。ただし同一配列内では統一する。
    'array-bracket-newline': ['error', 'consistent'],

    // 配列の先頭と末尾にはスペースをあけない。
    'array-bracket-spacing': ['error', 'never'],

    // 配列の中の要素を改行するかは自由。ただし同一配列内では統一する。
    'array-element-newline': ['error', 'consistent'],

    // ブロック(={})の先頭と末尾にはスペースをあける
    'block-spacing': 'error',

    // 変数名は全てcamelCase
    'camelcase': 'error',

    // プロパティが複数行にまたがる場合、基本的には最終行にもカンマをつける
    'comma-dangle': ['error', {
      'arrays'   : 'always-multiline',
      'objects'  : 'always-multiline',
      'imports'  : 'always-multiline',
      'exports'  : 'always-multiline',
      'functions': 'only-multiline',
    }],

    // カンマの前にはスペースをあけず、カンマの後にはスペースをあける。
    'comma-spacing': ['error', {
      'before': false,
      'after' : true,
    }],

    // 空ではないファイルの最終行は空白にする。
    'eol-last': ['error', 'always'],

    // インデントは常にスペース2つ。
    'indent': ['error', 2],

    // オブジェクトのコロンの前後にスペースをあけるかどうか。
    'key-spacing': ['warn', {
      'multiLine': {            // 複数行のvalueの場合
        'beforeColon': false,   // コロンの前はスペースなし
        'afterColon' : true,    // コロンの後はスペースあり
      },
      'align': {                // 一行のvalueが、複数行続く場合
        'beforeColon': false,   // コロンの前はスペースなし(例外あり)
        'afterColon' : true,    // コロンの後はスペースあり
        'on'         : 'colon', // コロンを最長の位置に合わせる
      },
    }],

    // ifやtryステートメントの前後にスペースが必要かどうか
    'keyword-spacing': ['error', {
      'before': true,
      'after' : true,
    }],

    // 三項演算子の改行を統一する
    'multiline-ternary': ['error', 'always-multiline'],

    // スペースとタブを混同させない
    'no-mixed-spaces-and-tabs': 'error',

    // 連続する空白行は許容しない
    'no-multiple-empty-lines': ['error', {
      'max'   : 1,
      'maxEOF': 0,
    }],

    // 無駄なスペースを取り除く
    'no-trailing-spaces': 'error',

    // ◯シングルクオートｘダブルクオート
    'quotes': ['error', 'single'],

    // セミコロンは基本的に使用しない
    'semi': ['warn', 'never'],

    // セミコロンを省略することで不具合が生じる場合は警告する
    'no-unexpected-multiline': ['error'],

    /* prettier */

    // prettierはOFF
    'prettier/prettier': 'off',
  },
}
