/* eslint-disable camelcase */
const { createInterface } = require('readline')
const chalk = require("chalk")
const ora = require('ora')

class Debug {
  /**
   * @param {import('./Kurafuto')} kurafuto Instance of kurafuto
   */
  constructor(kurafuto) {
    this.kurafuto = kurafuto
    this.interface = createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "",
    })
    this.Init_Interceptor()
    this.Chat_Handle()
    this.Log_Handle()
  }
  async Init_Interceptor() {
    this.interface.on('line', line => {
      this.Command_Handler(line)
    })
  }
  async Chat_Handle() {
    this.kurafuto.on("KURAFUTO_CHAT", res => {
      console.log(`${chalk.magentaBright("{KurafutoChat::DEBUG}")} ${chalk.blue(`<${res.author}>`)} ${res.message}`)
    })
  }
  async Log_Handle() {
    this.kurafuto.on("KURAFUTO_LOG", async res => {
      let color = await this.Get_Color(res.process)
      console.log(`${chalk.magentaBright("{KurafutoLog::DEBUG}")} ${chalk.gray(res.timestamp)} ${chalk `{${color} ${res.process}}`} ${res.log}`)
    })
  }
  async Get_Color(ExPR) {
    if (!ExPR) return ColorRefs.defaultColor
    let Obj = ColorRefs.colors.filter(c => c.event === ExPR
      .toString()
      .toLowerCase()
      .replace("[", "")
      .replace("]", "")
      .replace(/\s+/g, ""))

    return Obj[0] ? Obj[0].color : ColorRefs.defaultColor
  }
  async Command_Handler(line) {
    if (line.toLowerCase() === "stopall") return await this.kurafuto.Stop_All()
    else if (line.toLowerCase() === "stop") return await this.kurafuto.Stop_Server()
    else if (line.toLowerCase() === "restart") return this.kurafuto.Restart_Server()
    else if (line.toLowerCase() === "start") return this.kurafuto.Create_Server()
    else return this.kurafuto.Execute_Command(line.toString())
  }
}


module.exports = Debug


const ColorRefs = {
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
}
