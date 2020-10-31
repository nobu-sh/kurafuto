const Kurafuto = require("../base/kurafuto")
const config = require("../../mcbe.config")

module.exports = {
  Kurafuto: new Kurafuto({
    serverPath: config.serverEXEDir,
    configPath: "./mcbe.config.js",
  }),
}
