const fs = require("fs");

module.exports = {
  devServer: {
    port: 7070
  },
  // chainWebpack: config => {
  //   // remove the old loader
  //   config.module.rules.delete("svg");
  //   config.module.rules.delete("gif");
  //   config.module.rules.delete("png");
  // },
  // configureWebpack: {
  //   module: {
  //     rules: [
  //       {
  //         test: /\.(svg|gif|png)(\?.*)?$/,
  //         use: [
  //           {
  //             loader: "url-loader",
  //             options: {
  //               limit: 10000
  //             }
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // },
  css: {
    extract: false,
    loaderOptions: {
      sass: {
        data: fs.readFileSync("src/assets/styles/variables.scss", "utf-8"),
        filename: "[name].[ext]"
      }
    }
  }
};
