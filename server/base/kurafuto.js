/* eslint-disable camelcase */
const { EventEmitter } = require("events")
const { spawn } = require('child_process')
const { resolve } = require('path')
const { existsSync } = require("fs")

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
    if (!existsSync(this.server)) return EXIT("Path to MCBE server executable does not exist!")
    if (!existsSync(this.configPath)) return EXIT("Path to MCBE config is does not exist!")
    this.config = require(this.configPath)
    this.stopping = false
    this.restarting = false
    this.child
    this.Create_Server()
    this.Unclog_Logs()
  }
  async Create_Server() {
    if (this.stopping) return {
      "rejected": true,
      "reason": "Server is in shutdown process",
    }
    if (this.restarting) return {
      "rejected": true,
      "reason": "Server is in restart process",
    }
    if (this.child) return {
      "started": false,
      "reason": "This server is already running",
    }
    this.child = spawn(this.server)
    this.Handle_Logs()
    
    return {
      "started": true,
    }
  }
  async Handle_Logs() {
    this.child.stdout.on('data', (data) => {
      this.Add_Log(data.toString())
    })
  }
  async Unclog_Logs() {
    setInterval(() => {
      this.Log_Handle()
    }, 1000 * 60)
  }
  async Add_Log(_log) {
    let logs = _log
      .split(/[\r\n]+/)
      .filter(l => l !== "")
    if (!_LogQueue[0]) {
      _LogQueue = [ 
        ..._LogQueue,
        ...logs,
      ]
      this.Log_Handle()
    } else {
      _LogQueue = [ 
        ..._LogQueue,
        ...logs,
      ]
    }
  }
  async Log_Handle() {
    if (!_LogQueue[0]) return
    _LogQueue.forEach(async _stdout => {
      const _ParsedLog = await this.Log_Parser(_stdout)
      if (_ParsedLog._IsChat) {
        this.Final_Chat(await this.Chat_Handle(_stdout))
      } else {
        const ExPr = _ParsedLog._ExecutorProccess ? _ParsedLog._ExecutorProccess[0] : null
        let Flog = ExPr ? _ParsedLog._Log.replace(`${ExPr} `, "") : _ParsedLog._Log
        this.Final_Log({
          process: ExPr,
          log: Flog,
          timestamp: new Date().toISOString(),
        })
      }
      _LogQueue.shift()
    })
  }
  async Log_Parser(_stdout) {
    const _ExecutorProccess = _stdout
      .toString()
      .match(/\[.*\]/)
    if (_ExecutorProccess && _ExecutorProccess
      .toString()
      .toLowerCase()
      .includes("chat")) {
      return {
        _IsChat: true,
      }
    }

    return {
      _IsChat: false,
      _ExecutorProccess,
      _Log: await this.Clean_Log(_stdout),
    }
  }
  async Clean_Log(_DirtyLog) {
    return _DirtyLog
      .toString()
      .replace(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} (V|I|W|E) /g, "")
  }
  async Chat_Handle(_DirtyChat) {
    let _CleanChat = _DirtyChat
      .toString()
      .replace(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} (V|I|W|E) /g, "")
      .replace(/\(.*\)/, "")
      .replace(/\[CHAT\]/, "")
      .replace(/\s+/g, " ")
      .replace(" ", "")
    let _Sender = _CleanChat
      .match(/\[.*\] /)
    _CleanChat = _CleanChat.replace(_Sender, "")
    _Sender = _Sender
      .toString()
      .replace("[", "")
      .replace("] ", "")

    return {
      author: _Sender,
      message: _CleanChat,
    }
  }
  async Stop_All() {
    if (this.stopping) return {
      "rejected": true,
      "reason": "Server already in shutdown process",
    }
    if (this.restarting) return {
      "rejected": true,
      "reason": "Server is in restart process",
    }
    this.stopping = true
    this.child.stdin.write('stop' + "\n")
    setTimeout(() => {
      this.child.kill()
      this.child = null
      this.stopping = false
      process.exit()
    }, 3000)
  }
  async Stop_Server() {
    return new Promise((resolve) => {
      if (this.stopping) resolve({
        "rejected": true,
        "reason": "Server already in shutdown process",
      })
      if (this.restarting) resolve({
        "rejected": true,
        "reason": "Server is in restart process",
      })
      this.stopping = true
      if (!this.child) resolve({
        "rejected": true,
        "reason": "This server is not running",
      })
      this.child.stdin.write('stop' + "\n")
      setTimeout(() => {
        this.child.kill()
        this.child = null
        this.stopping = false
        resolve({
          "stopped": true,
        })
      }, 3000)
    })
  }
  async Restart_Server() {
    return new Promise((resolve) => {
      if (this.restarting) resolve({
        "rejected": true,
        "reason": "Server already in restart process",
      })
      if (this.stopping) resolve({
        "rejected": true,
        "reason": "Server is in shutdown process",
      })
      this.restarting = true
      if (!this.child) resolve({
        "rejected": true,
        "reason": "This server is not running",
      })
      this.child.stdin.write('stop' + "\n")
      setTimeout(() => {
        this.child.kill()
        this.Create_Server()
        setTimeout(() => {
          this.restarting = false
          resolve({
            "restarted": true,
          })
        }, 2000)
      }, 3000)
    })
  }
  async Execute_Command(_command) {
    this.child.stdin.write(`${_command}\r\n`)
    
    return "Command sent to server process"
  }
  async Final_Chat(_out) {
    return this.emit("KURAFUTO_CHAT", _out)
  }
  async Final_Log(_out) {
    return this.emit("KURAFUTO_LOG", _out)
  }
}

function EXIT (message) {
  console.log(`\n\n${chalk.bgRed("Error")} ${chalk.grey.bold(message)}\n\n`)
  process.exit(0)
}

module.exports = Kurafuto
