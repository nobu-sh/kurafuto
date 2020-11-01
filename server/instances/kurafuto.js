const Kurafuto = require("../base/kurafuto")
const config = require("../../kurafuto.config")

module.exports = {
  Kurafuto: new Kurafuto({
    serverPath: config.serverEXEDir,
    configPath: "./kurafuto.config.js",
  }),
}
