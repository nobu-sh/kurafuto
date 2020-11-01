const Kurafuto = require("../base/Kurafuto")
const config = require("../../kurafuto.config")

module.exports = {
  Kurafuto: new Kurafuto({
    serverPath: config.serverEXEDir,
    configPath: "./kurafuto.config.js",
  }),
}
