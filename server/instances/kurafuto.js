const Kurafuto = require("../base/Kurafuto")
const config = require("../../kurafuto.config")
// For multiple servers just insert more instances with custom names,
// Will set up thingy in panel to automate this...
// Need to remember that if there are no instances then it won't do things
module.exports = {
  Kurafuto: new Kurafuto({
    serverPath: config.serverEXEDir,
    configPath: "./kurafuto.config.js",
  }),
}
