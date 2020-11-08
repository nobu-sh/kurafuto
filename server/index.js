const chalk = require("chalk")
const api = require('./api')
const config = require('../kurafuto.config')
const express = require('express')
const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const path = require('path')
const cors = require('cors')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')

const db = require('./database/mongo')

db.then(() => console.log(`${chalk.magentaBright("{Kurafuto Database}")} ${chalk.gray(new Date().toISOString())} ${chalk.green("[Mongo]")} Successfully established a connection to database ${config.mongoDatabase} through user ${config.mongoUsername}`))
  .catch(err => {
    console.log(`${chalk.magentaBright("{Kurafuto Database}")} ${chalk.gray(new Date().toISOString())} ${chalk.red("[Mongo]")} Could not establish a connection, action failed with ${err}`)
    console.log(chalk.red("Stopping backend process, please connect database then restart!"))
    process.exit()
  })

const port = process.env.NODE_ENV === 'development' 
  ? config.developmentPort
  : config.port

app.use(cors())
app.use(express.json())

app.use(session({
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  secret: config.sessionSec,
  resave: false,
  saveUninitialized: true,
  name: "Kurafuto OwO",
  cookie: {
    sameSite: "strict",
    expires: 1000 * 60 * 60 * 24 * 365 * 2,
    //httpOnly: true,
  },
}))

app.set('socketio', io)

app.use('/api', api)
app.use(express.static(path.join(__dirname, '../dist/')))
app.get('*', (req, res) => {
  res.sendFile(path.resolve('dist', 'index.html'))
})

http.listen(port, () => console.log(`Express server listening on port ${port}`))
