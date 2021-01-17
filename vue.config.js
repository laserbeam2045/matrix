module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // MEMO: プロパティ名がsass-loaderのバージョンに伴いリネームされている
        // (data(~7.3.1) -> prependData(8.0.0) -> additionalData(^9))
        prependData: `@import "@/assets/scss/app.scss";`,
      },
    },
  },
}