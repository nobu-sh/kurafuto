const chalk = require("chalk")
const express = require('express')
const path = require('path')
const api = require('./api')
const config = require('../kurafuto.config')

const app = express()
const db = require('./database/mongo')

db.then(() => console.log(`${chalk.magentaBright("{Kurafuto Database}")} ${chalk.gray(new Date().toISOString())} ${chalk.green("[Mongo]")} Successfully established a connection to database ${config.mongoDatabase} through user ${config.mongoUsername}`))
  .catch(err => console.log(`${chalk.magentaBright("{Kurafuto Database}")} ${chalk.gray(new Date().toISOString())} ${chalk.red("[Mongo]")} Could not establish a connection, action failed with ${err}`))
const port = process.env.NODE_ENV === 'development' 
  ? config.developmentPort
  : config.port

app.use('/api', api)
app.use('/', express.static(path.resolve('dist')))
app.use('*', (req, res) => res.sendFile(path.resolve('dist', 'index.html')))

app.listen(port)

console.log(`Open on port ${port}`)

const { Kurafuto } = require("./instances/kurafuto")
if (config.debugEnabled) {
  const debug = new (require('./base/Debug'))(Kurafuto)
}
