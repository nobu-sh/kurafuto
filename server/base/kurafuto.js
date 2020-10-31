/* eslint-disable camelcase */
const { EventEmitter } = require("events")
const { spawn } = require('child_process')
const { createInterface } = require('readline')
const { resolve } = require('path')
const { existsSync } = require("fs")
const chalk = require("chalk")
const ora = require('ora')

let _LogQueue = []

class Kurafuto extends EventEmitter {
  /**
   * @param {Object} options              Options passed to Kurafuto
   * @param {Object} options.serverPath   Path to executable server file (relative from folder root)
   * @param {Object} options.configPath   Path to config file for Kurafuto (relative from folder root)
   * @param {Object} options.scriptsPath  Path to Kurafuto scripts folder (relative from folder root)
   */
  constructor(options) {
    super()
    this.server = resolve(__dirname, "../../", options.serverPath)
    this.configPath = resolve(__dirname, "../../", options.configPath)

    console.log(this.configPath)
    //this.scripts = resolve(__dirname, "../../", options.scriptsPath)

    if (!existsSync(this.server)) return EXIT("Path to MCBE server executable does not exist!")
    if (!existsSync(this.configPath)) return EXIT("Path to MCBE config is does not exist!")
    //if (!existsSync(this.scripts)) return EXIT("Path to scripts folder does not exist!")

    this.config = require(this.configPath)

    this.interface = createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "Kurafuto >> ",
    })
    this.Init_Interceptor()

    this.child
    this.Create_Server()

    // Sometimes log queue gets clogged, this will be sure it is epmty every minute
    this.Unclog_Logs()
  }

  async Create_Server() {
    this.child = spawn(this.server)
    this.Handle_Logs()
  }
  
  async Handle_Logs() {
    this.child.stdout.on('data', (data) => {
      this.Add(data.toString())
    })
  }

  async Init_Interceptor() {
    this.interface.on('line', (line) => {
      this.Command_Handler(line)
    })
  }

  async Add(log) {
    if (!_LogQueue[0]) {
      _LogQueue.push(log)
      this.Log_Handle()
    } else {
      _LogQueue.push(log)
    }
  }

  async Unclog_Logs() {
    setInterval(() => {
      this.Log_Handle()
    }, 1000 * 60)
  }

  async Log_Handle() {
    if (!_LogQueue[0]) return
    _LogQueue.forEach(async _stdout => {
      let _CleanStdout = await this.Log_Parser(_stdout)
      if (!_CleanStdout._IsChat) {
        let _ColorCode = this.config.output.defaultColor
        if (_CleanStdout._ExecutorProccess)_ColorCode = await this.Color_Code(_CleanStdout._ExecutorProccess)
        console.log(_CleanStdout._CleanOut.replace(/\[.*\]/g, chalk.grey.bold(new Date().toISOString()) + " " + chalk `{${_ColorCode} ${chalk.bold(_CleanStdout._ExecutorProccess)}}`))
      }
      _LogQueue.shift()
    })
    //if (_LogQueue[0]) return this.Log_Handle()
  }
  
  async Log_Parser(stdout) {
    const _ExecutorProccess = stdout
      .toString()
      .match(/\[.*\]/)
    if (_ExecutorProccess && _ExecutorProccess.toString().toLowerCase()
      .includes("chat")) {
      this.Handle_Chat(stdout)

      return {
        _IsChat: true,
      }
    }
    const _CleanOut = stdout
      .toString()
      .replace(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} (V|I|W|E) /g, "")
      
    return {
      _IsChat: false,
      _ExecutorProccess,
      _CleanOut,
    } 
  }

  // Console Events
  // ScriptOut, FetchModule, NETWORK, SERVER, DynamicMotd, ScriptEngine, ScriptAPI, PlayerDB, CHAT, DATABASE, ModLoader, Blacklist, Base, LogDatabase, Bus, 

  async Color_Code(ExPR) {
    let Obj = this.config.output.colors.filter(c => c.event === ExPR.toString().toLowerCase()
      .replace("[", "")
      .replace("]", "")
      .replace(/\s+/g, ""))

    return Obj[0] ? Obj[0].color : this.config.output.defaultColor
  }

  async Handle_Chat(stdout) {
    const _OnChatClean = stdout.toString()
      .replace(/\(.*\)/, "")
      .replace(/\[CHAT\]/, "")
      .replace(/\s+/g, " ")
      .replace(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} (V|I|W|E) /g, "")
    this.emit("KURAFUTO_ONCHAT", _OnChatClean)
  }

  async Command_Handler(line) {
    if (line.toLowerCase() === "stop") return this.Stop_Server()
    else if (line.toLowerCase() === "restart") return this.Restart_Server()
    else {
      this.child.stdin.write(line.toString() + "\n")
      const handler = () => {
        setTimeout(() => {
          this.interface.prompt(false)

          return this.child.stdout.removeListener('data', handler)
        }, 5)
      }

      return this.child.stdout.on('data', handler)
    }
  }

  async Stop_Server() {
    this.child.stdout.removeAllListeners()
    this.child.stdin.write('stop' + "\n")
    console.log("\n\n")
    const _ServerStop = ora(chalk.red("Stopping Server\n\n")).start()
    _ServerStop.color = "red"
    setTimeout(() => {
      _ServerStop.succeed()
      this.child.kill()
      process.exit()
    }, 3000)
  }
  async Restart_Server() {
    this.child.stdout.removeAllListeners()
    this.child.stdin.write('stop' + "\n")
    console.log("\n\n")
    const _RestartServer = ora(chalk.green("Restarting Server\n\n")).start()
    _RestartServer.color = "green"
    setTimeout(() => {
      this.child.kill()
      _RestartServer.succeed()
      this.Create_Server()
    }, 4000)
  }
}

function EXIT (message) {
  console.log(`\n\n${chalk.bgRed("Error")} ${chalk.grey.bold(message)}\n\n`)
  process.exit(0)
}

module.exports = Kurafuto
