module.exports = {
  // Path to bedrock server start (relative from this files current dir)
  serverEXEDir: "../Server Template 736428/bedrock_server_mod.exe",

  adminLoginCredentials: {
    username: "Kurafuto",
    password: "Kurafuto",
  },

  output: {
    // Allowed Colors
    // black, red, green, yellow, blue, magenta, cyan, white, gray
    // Event should be all lowercase
    // If I missed an event just add it in here, it should auto update on next start 
    defaultColor: "gray",
    colors: [


      {
        event: "scriptout",
        color: "red",
      },
      {
        event: "fetchmodule",
        color: "green",
      },
      {
        event: "network",
        color: "magenta",
      },
      {
        event: "server",
        color: "magenta",
      },
      {
        event: "dynamicmotd",
        color: "gray",
      },
      {
        event: "scriptengine",
        color: "red",
      },
      {
        event: "scriptapi",
        color: "red",
      },
      {
        event: "playerdb",
        color: "cyan",
      },
      {
        event: "database",
        color: "blue",
      },
      {
        event: "modloader",
        color: "green",
      },
      {
        event: "blacklist",
        color: "gray",
      },
      {
        event: "base",
        color: "gray",
      },
      {
        event: "bus",
        color: "yellow",
      },

    ],

  },

}
