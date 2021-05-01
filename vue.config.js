// const path = require('path')

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // 具体的なCSSを出力しない、変数やmixinなどをグローバル化する
        // NOTE: property名がsass-loaderのversionに伴いrenameされている
        // data(<=7.x.x) prependData(8.x.x) additionalData(>=9.x.x)
        prependData: `
          @import '@/assets/sass/app.scss';
        `,
      },
    },
  },
  // // webpack4はlordersではなくなりました
  // module: {
  //   rules: [
  //     {
  //       // 拡張子 .ts の場合【②TyeScript用のルールを追加】
  //       test: /\.ts$/,
  //       // TypeScript をコンパイルする
  //       use: 'ts-loader'
  //     },
  //     // 拡張子.vueのファイルに対する設定
  //     {
  //       test: /\.vue$/,
  //       use: [
  //         {
  //           loader: 'vue-loader'
  //         }
  //       ]
  //     },
  //     // 拡張子.jsのファイルに対する設定
  //     {
  //       test: /\.js$/,
  //       exclude: /node_modules/,
  //       use: [
  //         {
  //           loader: 'babel-loader',
  //         },
  //       ]
  //     },
  //     {
  //       test: /\.css$/,
  //       use: [
  //         {
  //           loader: 'style-loader',
  //         },
  //         {
  //           loader: 'css-loader',
  //         },
  //       ]
  //     },
  //     {
  //       test: /\.scss$/,
  //       use: [
  //         {
  //           loader: 'style-loader',
  //         },
  //         {
  //           loader: 'css-loader',
  //         },
  //         {
  //           loader: 'sass-loader',
  //         },
  //       ]
  //     }
  //   ]
  // },
  // // デフォルトの設定値だけでは足りないことについて解決します
  // resolve: {
  //   // モジュールを読み込むときに検索するディレクトリの設定
  //   modules: [path.join(__dirname, 'resources'), 'node_modules'],
  //   // importするときに省略できる拡張子の設定 【③TyeScriptの拡張子(ts)を追加】
  //   extensions: ['.js', '.ts', '.vue', 'css'],
  //   alias: {
  //     // 例えばmain.js内で `import Vue from 'vue';` と記述したときの`from vue`が表すファイルパスを指定
  //     'vue$': 'vue/dist/vue.esm.js'
  //   },
  // },
}
