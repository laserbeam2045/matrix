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
}