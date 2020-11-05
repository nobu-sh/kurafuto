module.exports = {
  // Web Stuff
  port: Number(process.env.PORT) || 8080,
  developmentPort: 8081,

  meta: {
    title: 'Kurafuto',
    description: 'Minecraft server panel for Element Zero',
    thumbnail: 'https://animiru.dev/kurafuto.png',
    themeColor: '#C669FF',
    url: 'https://localhost:8080',
  },

  sessionSec: "Some Super Random Secret Here",  

  // MCBE Stuff

  // Path to bedrock server start (relative from root of this folder)
  serverEXEDir: "../Server Template 736428/bedrock_server_mod.exe",

  // Enables logs to be spit out in the master process console (Not Recommended with multiple servers running)
  debugEnabled: true,

  // Database Info (MongoDB)
  mongoEndpoint: "@clustername.nhnzh.mongodb.net/",
  mongoDatabase: "neatDatabase",
  mongoUsername: "Neat Username",
  mongoPassword: "Neat Password",
}
