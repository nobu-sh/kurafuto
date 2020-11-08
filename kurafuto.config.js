module.exports = {
  // Web Stuff
  port: Number(process.env.PORT) || 8080,
  developmentPort: 8081,

  meta: {
    title: 'Kurafuto',
    description: 'Minecraft server panel for Element Zero',
    thumbnail: 'https://animiru.dev/kurafuto.png',
    themeColor: '#C669FF',
    // Change this to your sites url
    url: 'http://localhost:8080',
  },
  devServer: {
    main: "http://localhost:8080",
    api: "http://localhost:8081",
  },

  // Change this to the websites base URL when in production
  // Example https://kurafuto.dev
  // Use http/https accordingly
  socketUrl: "http://localhost:8081",

  sessionSec: "Some Super Random Secret Here",  


  // MCBE Stuff

  // Enables logs to be spit out in the master process console (Not Recommended with multiple servers running)
  debugEnabled: false,

  // If true will store logs in database, this will allow log history to be accessed
  // and allow the console to show log history
  logTrace: true,

  // Database Info (MongoDB)
  mongoEndpoint: "@clustername.nhnzh.mongodb.net/",
  mongoDatabase: "neatDatabase",
  mongoUsername: "Neat Username",
  mongoPassword: "Neat Password",
}
