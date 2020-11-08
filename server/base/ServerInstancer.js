const IH = require('../utils/instanceHandler')
const config = require('../../kurafuto.config')
const chalk = require('chalk')
const { EventEmitter } = require("events")
let started = false
let instances = []
class Instances extends EventEmitter {
  constructor() {
    this.start()
  }
  /**
   * Initial loop though all servers and create an instance
   */
  async start() {
    if (started) return {
      rejected: true,
      info: "Instance startup process has already ran. Maybe try .reload()?",
    }
    started = true
    IH.getAll().then(res => {
      if (!res[0]) return console.log(chalk.yellow("No server instances in database, skipping server(s) startup..."))
      res.forEach(obj => {
        console.log(chalk.green(`Starting server ${obj.name} should be open on port ${obj.port} server has an object id of ${obj._id}`))
        let instance = new (require('./Kurafuto'))({ 
          server: obj,
          configPath: "./kurafuto.config.js",
        })
        instances.push(
          {
            id: obj._id,
            name: obj.name,
            path: obj.path,
            port: obj.port,
            instance: instance,
            debug: config.debugEnabled ? new (require('./Debug'))(instance) : false,
          },
        )
        this.registerEventEmitters(instance)
      })
    })
  }
  /**
   * Used to initially register all events for server
   * @param {Instance} instance 
   */
  async registerEventEmitters(instance) {
    if (!instance.serverName && !instance.serverID) {
      return {
        rejected: true,
        reason: "This is only needed to initially register the events",
      }
    }
    instance.on("KURAFUTO_CHAT", data => {
      this.emit("KurafutoChat", data)
    })
    instance.on("KURAFUTO_LOG", data => {
      this.emit("KurafutoLog", data)
    })
    instance.on("KURAFUTO_ERR", data => {
      this.emit("KurafutoError", data)
    })
  }
  /**
   * Gets all servers from database and spawns instances for servers that do not have one already
   */
  async refresh() {
    IH.getAll().then(async res => {
      if (!res[0]) return console.log(chalk.yellow("No server instances in database, skipping server(s) refresh..."))
      res.forEach(async obj => {
        let si = await instances.find(s => s.id.equals(obj._id))
        if (!si) {
          console.log(chalk.green(`Starting server ${obj.name} should be open on port ${obj.port} server has an object id of ${obj._id} was started on a ServerInstancer .reload()`))
          let instance = new (require('./Kurafuto'))({ 
            server: obj,
            configPath: "./kurafuto.config.js",
          })
          instances.push(
            {
              id: obj._id,
              name: obj.name,
              path: obj.path,
              port: obj.port,
              instance: instance,
              debug: config.debugEnabled ? new (require('./Debug'))(instance) : false,
            },
          )
          this.registerEventEmitters(instance)
        }
      })
    })
  }
  /**
   * Kill a server instance by its name (Server instance will respawn instance on reload)
   * @param {String} name Name server is referenced by
   */
  async killByName(name) {
    let server = instances.find(s => s.name === name)
    if (!server) return {
      rejected: true,
      info: `No instances running with the name "${name}"`,  
    }

    await server.instance.Stop_Server()
    instances = instances.filter(s => s.name !== name)

    return {
      rejected: false,
      info: `Killed instance with name "${name}" instance will be re-added on next instance reload`,
    }
  }
  /**
   * Kill a server instance by its id (Server instance will respawn instance on reload)
   * @param {String} id Servers mongo object id
   */
  async killByID(id) {
    let server = instances.find(s => s.id.equals(id))
    if (!server) return {
      rejected: true,
      info: `No instances running with the id "${id}"`,  
    }

    await server.instance.Stop_Server()
    instances = instances.filter(s => !s.id.equals(id))

    return {
      rejected: false,
      info: `Killed instance with id "${id}" instance will be re-added on next instance reload`,
    }
  }
  /**
   * Stop a server by its name (Instance will still be alive. MC server will stop though)
   * @param {String} name Name server is referenced by
   */
  async stopByName(name) {
    let server = instances.find(s => s.name === name)
    if (!server) return {
      rejected: true,
      info: `No instances running with the name "${name}"`,  
    }

    return await server.instance.Stop_Server()
  }
  /**
   * Stop a server by its id (Instance will still be alive. MC server will stop though)
   * @param {String} id Servers mongo object id
   */
  async stopByID(id) {
    let server = instances.find(s => s.id.equals(id))
    if (!server) return {
      rejected: true,
      info: `No instances running with the id "${id}"`,  
    }

    return await server.instance.Stop_Server()
  }
  /**
   * Start a server by its name (Will start any stopped servers that still have an instance)
   * @param {String} name Name server is referenced by
   */
  async startByName(name) {
    let server = instances.find(s => s.name === name)
    if (!server) return {
      rejected: true,
      info: `No instances running with the name "${name}"`,  
    }

    return await server.instance.Create_Server()
  }
  /**
   * Start a server by its name (Will start any stopped servers that still have an instance)
   * @param {String} id Servers mongo object id
   */
  async startByID(id) {
    let server = instances.find(s => s.id.equals(id))
    if (!server) return {
      rejected: true,
      info: `No instances running with the id "${id}"`,  
    }

    return await server.instance.Create_Server()
  }
  /**
   * Restart a server by its name (Will restart any running servers)
   * @param {String} name Name server is referenced by
   */
  async restartByName(name) {
    let server = instances.find(s => s.name === name)
    if (!server) return {
      rejected: true,
      info: `No instances running with the name "${name}"`,  
    }

    return await server.instance.Restart_Server()
  }
  /**
   * Restart a server by its name (Will restart any running servers)
   * @param {String} id Servers mongo object id
   */
  async restartByID(id) {
    let server = instances.find(s => s.id.equals(id))
    if (!server) return {
      rejected: true,
      info: `No instances running with the id "${id}"`,  
    }

    return await server.instance.Restart_Server()
  }
  /**
   * Execute a command in server by its name (Will execute a command in specified servers console)
   * @param {String} name Name server is referenced by
   * @param {String} command Any command that is registered to the game and is usable by console
   */
  async executeCommandByName(name, command) {
    let server = instances.find(s => s.name === name)
    if (!server) return {
      rejected: true,
      info: `No instances running with the name "${name}"`,  
    }

    return await server.instance.Execute_Command(command)
  }
  /**
   * Execute a command in server by its id (Will execute a command in specified servers console)
   * @param {String} id Servers mongo object id
   * @param {String} command Any command that is registered to the game and is usable by console
   */
  async executeCommandByID(id, command) {
    let server = instances.find(s => s.id.equals(id))
    if (!server) return {
      rejected: true,
      info: `No instances running with the id "${id}"`,  
    }

    return await server.instance.Execute_Command(command)
  }
}

module.exports = Instances
